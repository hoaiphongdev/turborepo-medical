/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  extends: ['next/core-web-vitals', 'eslint-config-base']
}
