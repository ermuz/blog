module.exports = {
    extends: ['plugin:@typescript-eslint/recommended'],
    parserOptions: {
        parser: '@typescript-eslint/parser', // 解析 .ts 文件
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'semi': [2, 'always']
    }
};
