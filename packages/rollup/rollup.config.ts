import { defineConfig } from 'rollup';
import typescript, { RollupTypescriptPluginOptions } from '@rollup/plugin-typescript';
import alias, { RollupAliasOptions } from '@rollup/plugin-alias';
import { resolve } from "path";
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    input: './src/index.ts',
    plugins: [
        alias({
            entries: [
                {
                    find: '@', replacement: resolve(__dirname, './src')
                }
            ]
        }),
        typescript({
            tsconfig: './tsconfig.json'
        })
    ],
    output: [
        {
            format: 'esm',
            dir: './dist',
            sourcemap: true,
        }
    ]
})