import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import types from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;

const sourceCode = `console.log(1)`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
});

traverse(ast, {
    CallExpression(path) {
        if (
            types.isMemberExpression(path.node.callee) &&
            path.node.callee.object.name === 'console' &&
            ['log', 'warn', 'info', 'error', 'debug'].includes(
                path.node.callee.property.name,
            )
        ) {
            const { column, line } = path.node.loc.start;
            path.node.arguments.unshift(
                types.stringLiteral(`filename:(${line},${column})`),
            );
        }
    },
});

const { code, map } = generate(ast, { sourceMaps: true });

console.log(code, map);
