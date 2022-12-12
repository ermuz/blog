import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
import autoTrackPlugin from '../plugins/data-auto-tracker.js';

const sourceCode = `
import aa from 'aa';
import * as bb from 'bb';
import {cc} from 'cc';
import 'dd';

function a () {
    console.log('aaa');
}

class B {
    bb() {
        return 'bbb';
    }
}

const c = () => 'ccc';

const d = function () {
    console.log('ddd');
}
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [
        [
            autoTrackPlugin,
            {
                trackerPath: 'tracker',
            },
        ],
    ],
});

console.log(code);
