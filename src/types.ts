import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'


export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord>, 'plugins'> & {
  plugins?: Record<string, any>
}

export interface OptionsConfig {
  gitignore?: boolean | FlatGitignoreOptions
  stylistic?: boolean | StylisticConfig
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}
