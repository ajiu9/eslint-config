import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ParserOptions } from '@typescript-eslint/parser'

export type Awaitable<T> = T | Promise<T>

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord>, 'plugins'> & {
  plugins?: Record<string, any>
}

export interface OptionsConfig {
  gitignore?: boolean | FlatGitignoreOptions
  stylistic?: boolean | StylisticConfig
  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean

  /**
 * Control to disable some rules in editors.
 * @default auto-detect based on the process.env
 */
  isInEditor?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    stylistic?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
  }
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}
