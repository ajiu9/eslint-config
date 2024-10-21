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

export default ajiu9({}, {
  ignores: [
    'fixtures',
    '_fixtures',
    'packages',
  ],
})

// const configs = await ajiu9({})

// var a;

// // eslint-disable-next-line no-console
// // console.dir(config, { depth: 5});

// function replacer(key, value, seenObjects = new WeakSet()) {
//   if (typeof value === 'function') {
//     // 过滤掉函数
//     return undefined;
//   }
//   if (typeof value === 'object' && value !== null) {
//     if (seenObjects.has(value)) {
//       // 已经处理过的对象，跳过
//       return undefined;
//     }
//     seenObjects.add(value);
//     if (value instanceof Map || value instanceof Set) {
//       return Array.from(value);
//     }
//   }
//   return value;
// }

// const jsonString = JSON.stringify(configs, replacer, 2);

// await fs.writeFile('./eslint.json', jsonString, 'utf-8');
