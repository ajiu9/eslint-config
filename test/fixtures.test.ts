import { afterAll, beforeAll, it } from 'vitest'
import fs from 'fs-extra'
import { join, resolve } from 'node:path'
import { execa } from 'execa'


beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})
// afterAll(async () => {
//   await fs.rm('_fixtures', { recursive: true, force: true })
// })

runWithConfig('js')


function runWithConfig(name: string) {
  console.log('runWithConfig', name)
  it.concurrent(name, async ({ expect }) => {
    const from = resolve('fixtures/input')
    const target = resolve('_fixtures', name)

    await fs.copy(from, target, {
      filter: (src) => {
        return !src.includes('node_modules')
      },
    })
    
    await fs.writeFile(join(target, 'eslint.config.js'), `
    // @eslint-disable
    import ajiu9 from '@ajiu9/eslint-config'
    
    export default ajiu9()

      `)
      // console.log(ajiu9(
      //   ${JSON.stringify(configs)},
      //   ...${JSON.stringify(items) ?? []},
      // ))

    await execa('npx', ['eslint', '.', '--fix'], {
      cwd: target,
      stdio: 'pipe',
    })

  }, 30_000)
}
