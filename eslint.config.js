import defineConfig from '@antfu/eslint-config'

export default defineConfig({
    type: 'lib',
    markdown: true,
    yaml: false,
    stylistic: {
        indent: 4,
    },
    typescript: {
        overrides: {
            'ts/explicit-function-return-type': 'off',
        },
    },
    lessOpinionated: true,
}, {
    rules: {
        'no-console': 'off',
        'style/max-statements-per-line': 'off',
        'jsdoc/require-returns-description': 'off',
        'jsonc/indent': ['error', 2],
        'curly': 'off',
    },
})
