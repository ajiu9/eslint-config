import type { OptionsConfig, TypedFlatConfigItem } from "./types";
import { FlatConfigComposer } from 'eslint-flat-config-utils'


import { comments, javascript, ignores, imports, node } from "./configs";

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
  const stylisticOptions = options.stylistic === false
  ? false
  : typeof options.stylistic === 'object'
    ? options.stylistic
    : {}
    
  const configs = []

  // Base configs
  configs.push(
    ignores(options.ignores),
    comments(), 
    node(),
    javascript(),
    imports({stylistic:stylisticOptions})
  )

  let composer = new FlatConfigComposer()

  composer = composer.append(...configs).renamePlugins(defaultPluginRenaming)
  
  

  return composer
}

