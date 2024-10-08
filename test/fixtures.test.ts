import { afterAll, beforeAll, it } from 'vitest'
import fs from 'fs-extra'
import { join, resolve } from 'node:path'

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})
// afterAll(async () => {
//   await fs.rm('_fixtures', { recursive: true, force: true })
// })

runWithConfig('js', {
  typescript: false,
  vue: false,
})


function runWithConfig(name: string, configs, ...items) {
  console.log('runWithConfig', name)
  it.concurrent(name, async ({ expect }) => {
    const from = resolve('fixtures/input')
    const target = resolve('_fixtures', name)

    await fs.copy(from, target, {
      filter: (src) => {
        return !src.includes('node_modules')
      },
    })

  }, 30_000)
}
