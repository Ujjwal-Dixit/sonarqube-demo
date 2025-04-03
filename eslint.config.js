import js from '@eslint/js';

export default [
    js.configs.recommended, // Extends recommended ESLint rules
    {
        plugins: {
            'custom-rules': {
                rules: {
                    'no-hardcoded-waits': {
                        meta: {
                            type: 'problem',
                            docs: {
                                description: 'Disallow hardcoded waits in tests',
                            },
                        },
                        create: function (context) {
                            return {
                                CallExpression(node) {
                                    if (node.callee.name === 'browser.pause') {
                                        context.report({ node, message: 'Avoid hardcoded waits (browser.pause)' });
                                    }
                                },
                            };
                        },
                    },
                    'no-duplicate-test-names': {
                        meta: {
                            type: 'problem',
                            docs: {
                                description: 'Disallow duplicate test names',
                            },
                        },
                        create: function (context) {
                            const testNames = new Set();
                            return {
                                CallExpression(node) {
                                    if (
                                        node.callee.name === 'it' ||
                                        node.callee.name === 'test' ||
                                        node.callee.name === 'describe'
                                    ) {
                                        const testName = node.arguments[0] && node.arguments[0].value;
                                        if (testName && testNames.has(testName)) {
                                            context.report({ node, message: `Duplicate test name detected: "${testName}"` });
                                        }
                                        testNames.add(testName);
                                    }
                                },
                            };
                        },
                    },
                    'no-direct-selectors': {
                        meta: {
                            type: 'problem',
                            docs: {
                                description: 'Disallow direct CSS/XPath selectors in test scripts',
                            },
                        },
                        create: function (context) {
                            return {
                                Literal(node) {
                                    if (typeof node.value === 'string' && (node.value.includes('//') || node.value.includes('#'))) {
                                        context.report({
                                            node,
                                            message: 'Avoid using direct CSS/XPath selectors. Use page object locators instead.',
                                        });
                                    }
                                },
                            };
                        },
                    },
                    'require-assertions': {
                        meta: {
                            type: 'problem',
                            docs: {
                                description: 'Ensure at least one assertion is present in each test',
                            },
                        },
                        create: function (context) {
                            let hasAssertion = false;
                            return {
                                CallExpression(node) {
                                    if (
                                        node.callee.name === 'expect' ||
                                        node.callee.name === 'assert' ||
                                        node.callee.name === 'chai'
                                    ) {
                                        hasAssertion = true;
                                    }
                                },
                                'Program:exit': function (node) {
                                    if (!hasAssertion) {
                                        context.report({
                                            node,
                                            message: 'Each test must have at least one assertion.',
                                        });
                                    }
                                },
                            };
                        },
                    },
                },
            },
        },
        rules: {
            'custom-rules/no-hardcoded-waits': 'error',
            'custom-rules/no-duplicate-test-names': 'error',
            'custom-rules/no-direct-selectors': 'error',
            'custom-rules/require-assertions': 'error',
        },
    },
];