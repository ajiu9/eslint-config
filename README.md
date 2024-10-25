# @ajiu9/eslint-config

[![npm](https://img.shields.io/npm/v/@ajiu9/eslint-config?color=a1b858&label=)](https://npmjs.com/package/@ajiu9/eslint-config)

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Designed to work with TypeScript, Markdown, Vue, YAML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent
  - Sorted imports, dangling commas
  - Single quotes, no semi
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

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

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

### Vue

Vue support is detected automatically by checking if `vue` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
  vue: true
})
```

#### Vue 2

We have limited support for Vue 2 (as it's already [reached EOL](https://v2.vuejs.org/eol/)). If you are still using Vue 2, you can configure it manually by setting `vueVersion` to `2`:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
  vue: {
    vueVersion: 2
  },
})
```

As it's in maintenance mode, we only accept bug fixes for Vue 2. It might also be removed in the future when `eslint-plugin-vue` drops support for Vue 2. We recommend upgrading to Vue 3 if possible.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered by [`eslint-plugin-format`](https://github.com/ajiu9/eslint-plugin-format).

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier'
  }
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9(
  {
    vue: true,
    typescript: true
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```
