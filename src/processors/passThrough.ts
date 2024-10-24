import type { Linter } from "eslint";

/**
 * Pass-through the file itself
 */

export const processorPassThrough: Linter.Processor = {
  meta: {
    name: 'pass-through',
  },
  preprocess(text) {
    return [text];
  },
  postprocess(messages) {
    return messages[0];
  },
};
