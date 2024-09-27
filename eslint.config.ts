import { ajiu9 } from './src'

// export default ajiu9({},{
//   ignores: [
//     'fixtures',
//     '_fixtures',
//   ],
// },
// {
//   files: ['src/**/*.ts'],
//   rules: {
//     'perfectionist/sort-objects': 'error',
//   },
// }
// )


export default ajiu9({})

const config = await  ajiu9({})


var a;

console.dir(config, { depth: 5});

