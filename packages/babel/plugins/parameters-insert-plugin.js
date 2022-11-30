export default function ({ types, template }) {
    const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
        (item) => `console.${item}`,
    );
    return {
        visitor: {
            CallExpression(path) {
                if (path.node._skip) return;
                const calleeName = path.get('callee').toString();
                if (targetCalleeName.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(
                        `console.log("filename: (${line}, ${column})")`,
                    )();
                    newNode._skip = true;
                    if (path.findParent((path) => path.isJSXElement())) {
                        path.replaceWith(
                            types.arrayExpression([newNode, path.node]),
                        );
                        path.skip();
                    } else {
                        path.insertBefore(types.expressionStatement(newNode));
                    }
                }
            },
        },
    };
}
