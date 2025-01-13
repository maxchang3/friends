import defineConfig from '@maxchang/eslint-config'

export default defineConfig({
    type: 'lib',
    yaml: false,
    ignores: ['./dist/'],
}, {
    rules: {
        'antfu/no-top-level-await': 'off',
    },
})
