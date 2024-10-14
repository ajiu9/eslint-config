import type { OptionsConfig, TypedFlatConfigItem, Awaitable } from "./types";
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isInEditorEnv } from './utils'


import { comments, javascript, ignores, imports, node, stylistic } from "./configs";

export const defaultPluginRenaming = {
  // '@eslint-react': 'react',
  // '@eslint-react/dom': 'react-dom',
  // '@eslint-react/hooks-extra': 'react-hooks-extra',
  // '@eslint-react/naming-convention': 'react-naming-convention',

  '@stylistic': 'style',
  // '@typescript-eslint': 'ts',
  'import-x': 'import',
  'n': 'node',
  // 'vitest': 'test',
  // 'yml': 'yaml',
}
export async function ajiu9(options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},) {
  const {
    jsx: enableJsx = true,
  } = options
  
  let isInEditor = options.isInEditor
  if (isInEditor == null) {
    isInEditor = isInEditorEnv()
    if (isInEditor)
      // eslint-disable-next-line no-console
      console.log('[@ajiu9/eslint-config] Detected running in editor, some rules are disabled.')
  }
  
  const stylisticOptions = options.stylistic === false
  ? false
  : typeof options.stylistic === 'object'
    ? options.stylistic
    : {}
    
    if (stylisticOptions && !('jsx' in stylisticOptions))
      stylisticOptions.jsx = enableJsx
    
  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  // Base configs
  configs.push(
    ignores(options.ignores),
    comments(), 
    node(),
    javascript({ isInEditor }),
    imports({stylistic:stylisticOptions})
  )

  console.log('stylisticOptions: ', stylisticOptions)

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
    }))
  }

  let composer = new FlatConfigComposer()

  composer = composer.append(...configs).renamePlugins(defaultPluginRenaming)
  
  

  return composer
}

