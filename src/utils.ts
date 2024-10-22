import type { Awaitable } from './types'
import process from 'node:process'
import type { Linter } from 'eslint'
import { isPackageExists } from 'local-pkg'
import { fileURLToPath } from 'node:url'

const isCwdInScope = isPackageExists('@ajiu9/eslint-config')

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}

export function isInEditorEnv(): boolean {
  if (process.env.CI)
    return false

  if (isInGitHooksOrLintStaged())
    return false

  return !!(false
    || process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  )
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false) return

  const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[]
  if (nonExistingPackages.length === 0) return

  const p = await import('@clack/prompts')
  const result = await p.confirm({
    message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
  })
}

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@ajiu9/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value]
        }

        return [key, value]
      }),
  )
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(false
    || process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

/**
 * Merge multiple processors into one
 *
 * @param processors
 */
export function mergeProcessors(processors: Linter.Processor[]): Linter.Processor {
  const cache = new Map<string, number[]>()

  return {
    meta: {
      name: `merged-processor:${processors.map(processor => processor.meta?.name || 'unknown').join('+')}`,
    },
    supportsAutofix: true,
    preprocess(text, filename) {
      const counts: number[] = []
      cache.set(filename, counts)
      return processors.flatMap((processor) => {
        const result = processor.preprocess?.(text, filename) || []
        counts.push(result.length)
        return result
      })
    },
    postprocess(messages, filename) {
      const counts = cache.get(filename)!
      cache.delete(filename)
      let index = 0
      return processors.flatMap((processor, idx) => {
        const msgs = messages.slice(index, index + counts[idx])
        index += counts[idx]
        return processor.postprocess?.(msgs, filename) || []
      })
    },
  }
}

/**
 * Pass-through the file itself
 */
export const processorPassThrough: Linter.Processor = {
  meta: {
    name: 'pass-through',
  },
  preprocess(text) {
    return [text]
  },
  postprocess(messages) {
    return messages[0]
  },
}
