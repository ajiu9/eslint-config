import { interopDefault } from '../utils'

export async function taro(): Promise<any[]> {
  const [
    pluginTaro,
  ] = await Promise.all([
    // @ts-expect-error eslint-config-taro has no types
    interopDefault(import('eslint-config-taro')),
  ] as const)

  return [
    {
      name: 'ajiu9/taro/setup',
      plugins: {
        taro: pluginTaro,
      },
    },
  ]
}
