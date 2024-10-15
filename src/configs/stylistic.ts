import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      name: 'ajiu9/stylistic/rules',
      plugins: {
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {

            }
        ),

        ...overrides,
      },
    },
  ]
}
