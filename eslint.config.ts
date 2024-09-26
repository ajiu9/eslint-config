import { ajiu9 } from './src'

export default ajiu9({},{
  ignores: [
    'fixtures',
    '_fixtures',
  ],
},
{
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
}
)
