export default [
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                browser: true,
                es2021: true
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off"
        }
    }
];