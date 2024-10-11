import { pluginComments } from '../plugins'
export async function comments(): Promise<any> {
 return [
  {
    name: 'ajiu9/eslint-comments/rules',
    plugins: {
      'eslint-comments': pluginComments,
    },
    rules: {
      'eslint-comments/no-aggregating-enable': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-enable': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  }
 ]
}
