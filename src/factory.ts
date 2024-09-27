import type { OptionsConfig } from "./types";
import { FlatConfigComposer } from 'eslint-flat-config-utils'


import { comments } from "./configs";
export async function ajiu9(options: OptionsConfig) {
  const configs = []

  configs.push(comments())

  let composer = new FlatConfigComposer()

  composer = composer.append(...configs)
  
  

  return composer
}

