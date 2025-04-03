module.exports = {

    rules: {

        // 1️⃣ No hardcoded waits (e.g., browser.pause(5000))

        'no-hardcoded-waits': {

            create: function (context) {

                return {

                    CallExpression(node) {

                        if (

                            node.callee.property &&

                            node.callee.property.name === 'pause' &&

                            node.arguments.length &&

                            node.arguments[0].type === 'Literal'

                        ) {

                            context.report(node, 'Avoid using hardcoded waits. Use explicit waits instead.');

                        }

                    },

                };

            },

        },

        // 2️⃣ No duplicate test names in Mocha/Jest

        'no-duplicate-test-names': {

            create: function (context) {

                const testNames = new Set();

                return {

                    CallExpression(node) {

                        if (node.callee.name === 'it' || node.callee.name === 'test') {

                            const testName = node.arguments[0]?.value;

                            if (testNames.has(testName)) {

                                context.report(node, `Duplicate test name found: "${testName}". Test names should be unique.`);

                            }

                            testNames.add(testName);

                        }

                    },

                };

            },

        },

        // 3️⃣ No direct selectors (use page objects instead)

        'no-direct-selectors': {

            create: function (context) {

                return {

                    Literal(node) {

                        if (typeof node.value === 'string' && node.value.match(/(\.|#)[a-zA-Z0-9_-]+/)) {

                            context.report(node, 'Avoid using direct selectors. Use page object methods instead.');

                        }

                    },

                };

            },

        },

        // 4️⃣ Require at least one assertion in every test

        'require-assertions': {

            create: function (context) {

                return {

                    CallExpression(node) {

                        if (node.callee.name === 'it' || node.callee.name === 'test') {

                            const body = node.arguments[1]?.body;

                            if (

                                body &&

                                body.body &&

                                !body.body.some((statement) => statement.type === 'ExpressionStatement' && statement.expression.callee)

                            ) {

                                context.report(node, 'Each test must contain at least one assertion.');

                            }

                        }

                    },

                };

            },

        },

    },

};

