import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import _template from '@babel/template';
import types from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;
const template = _template.default;

// const sourceCode = `console.log(1)`;
const sourceCode = `<div>{console.log(111)}</div>`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
    (item) => `console.${item}`,
);

traverse(ast, {
    CallExpression(path) {
        if (path.node._skip) return;
        const calleeName = generate(path.node.callee).code;
        if (targetCalleeName.includes(calleeName)) {
            const { line, column } = path.node.loc.start;
            const newNode = template.expression(
                `console.log("filename: (${line}, ${column})")`,
            )();
            newNode._skip = true;
            if (path.findParent((path) => path.isJSXElement())) {
                path.replaceWith(types.arrayExpression([newNode, path.node]));
                path.skip();
            } else {
                path.insertBefore(types.expressionStatement(newNode));
            }
        }
    },
});

const { code, map } = generate(ast, { sourceMaps: true });

console.log(code, map);
