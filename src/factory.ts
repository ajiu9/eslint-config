import type { OptionsConfig, TypedFlatConfigItem, Awaitable } from './types'
import type { Linter } from 'eslint'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isInEditorEnv } from './utils'
import { isPackageExists } from 'local-pkg'

import { comments, javascript, ignores, imports, node, stylistic, typescript, markdown, formatters, jsonc, jsdoc, sortPackageJson,
  sortTsconfig, vue } from './configs'

export const defaultPluginRenaming = {
  // '@eslint-react': 'react',
  // '@eslint-react/dom': 'react-dom',
  // '@eslint-react/hooks-extra': 'react-hooks-extra',
  // '@eslint-react/naming-convention': 'react-naming-convention',

  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  'n': 'node',
  // 'vitest': 'test',
  // 'yml': 'yaml',
}

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
]

export async function ajiu9(options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]) {
  const {
    jsx: enableJsx = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    componentExts = [],
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
  } = options

  let isInEditor = options.isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log('[@ajiu9/eslint-config] Detected running in editor, some rules are disabled.')
    }
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = enableJsx

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  const typescriptOptions = resolveSubOptions(options, 'typescript') as object

  // Base configs
  configs.push(
    ignores(options.ignores),
    comments(),
    node(),
    javascript({ isInEditor }),
    imports({ stylistic: stylisticOptions }),
    jsdoc({
      stylistic: stylisticOptions,
    }),
  )
  
  if (enableVue) {
    componentExts.push('vue')
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      overrides: getOverrides(options, 'typescript'),
    }))
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
    }))
  }
  
  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue') as object,
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }))
  }

  if (options.markdown ?? true) {
    configs.push(markdown({
      componentExts,
      overrides: getOverrides(options, 'markdown'),
    }))
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
    ))
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    )
  }

  let composer = new FlatConfigComposer()

  composer = composer.append(...configs, ...userConfigs as any).renamePlugins(defaultPluginRenaming)

  return composer
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {}
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
