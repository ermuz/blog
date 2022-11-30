import { transformFileSync } from '@babel/core';
import insertParametersPlugin from '../plugins/parameters-insert-plugin.js';
import { join, dirname } from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const { code } = transformFileSync(join(__dirname, './sourceCode.js'), {
    plugins: [insertParametersPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx'],
    },
});

console.log(code);
