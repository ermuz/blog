import type { Plugin, PluginBuild, BuildResult } from 'esbuild';
import { join } from 'path'
import fs from 'fs'
import { createScript, createLink, generateHTML } from './utils';

export default (): Plugin => ({
    name: 'esbuild: html',
    setup(build: PluginBuild) {
        build.onEnd(async (buildResult: BuildResult) => {
            if (buildResult.errors.length) {
                return;
            }
            const { metafile } = buildResult;
            // 1. 拿到 metafile 后获取所有的 js 和 css 产物路径
            const scripts: Array<string> = [];
            const links: Array<string> = [];
            console.log('metafile', metafile)
            if (metafile) {
                const { outputs } = metafile;
                const assets = Object.keys(outputs);

                assets.forEach((asset) => {
                    if (asset.endsWith(".js")) {
                        scripts.push(createScript(asset));
                    } else if (asset.endsWith(".css")) {
                        links.push(createLink(asset));
                    }
                });
            }
            // 2. 拼接 HTML 内容
            const templateContent = generateHTML(scripts, links);
            // 3. HTML 写入磁盘
            const templatePath = join(process.cwd(), "index.html");
            await fs.writeFile(templatePath, templateContent, (error) => {
                if (error) throw new Error(error.message);
            });
        });
    }
})