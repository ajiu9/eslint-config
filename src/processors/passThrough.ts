import type { Linter } from 'eslint'

/**
 * Pass-through the file itself
 */

export const processorPassThrough: Linter.Processor = {
  meta: {
    name: 'pass-through',
  },
  postprocess(messages) {
    return messages[0]
  },
  preprocess(text) {
    return [text]
  },
}
