import type { OptionsConfig } from "./types";
import { FlatConfigComposer } from 'eslint-flat-config-utils'


import { comments, javascript } from "./configs";
export async function ajiu9(options: OptionsConfig) {
  const configs = []

  configs.push(comments(), javascript())

  let composer = new FlatConfigComposer()

  composer = composer.append(...configs)
  
  

  return composer
}

