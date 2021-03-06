module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'space-before-function-paren': 0 ,//禁用语法规则
        'no-trailing-spaces': 0,
        'object-curly-newline': 0,
        'indent': 0,
        'semi': 0,
        'eol-last': 0,
        'no-multiple-empty-lines': 0,
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'vue/no-unused-vars': 0
    }
}