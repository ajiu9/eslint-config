# @ajiu9/eslint-config

[![npm](https://img.shields.io/npm/v/@ajiu9/eslint-config?color=a1b858&label=)](https://npmjs.com/package/@ajiu9/eslint-config)

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Designed to work with TypeScript, Markdown
- Sorted imports, dangling commas
- **Style principle**: Minimal for reading, stable for diff
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+-

#Usage

```bash
pnpm add -D eslint @ajiu9/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": "@ajiu9"
}
```

> You don't need `.eslintignore` normally as it has been provided by the preset.

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### VS Code support (auto fix)

### VS Code support (auto fix)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `settings.json`:

```jsonc
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },

  // The following is optional.
  // It's better to put under project setting `.vscode/settings.json`
  // to avoid conflicts with working with different eslint configs
  // that does not support all formats.
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml"
  ]
}
```

### TypeScript Aware Rules

Type aware rules are enabled when a `tsconfig.eslint.json` is found in the project root, which will introduce some stricter rules into your project. If you want to enable it while have no `tsconfig.eslint.json` in the project root, you can change tsconfig name by modifying `ESLINT_TSCONFIG` env.

```js
// .eslintrc.js
process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@ajiu9'
}
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "scripts": {
    "prepare": "simple-git-hooks"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks
```

## Customization

Normally you only need to import the `ajiu9` preset:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9()
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
// Type of the project. 'lib' for libraries, the default is 'app'
  type: 'lib',

  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are autodetected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/fixtures',
    // ...globs
  ]
})
```

The `ajiu9` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9(
  {
    // Configures for ajiu9's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```
