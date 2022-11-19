// @ts-ingore

import type { Plugin, PluginBuild, OnLoadArgs, OnResolveArgs, OnLoadResult } from 'esbuild';

export default (): Plugin => ({
    name: 'esbuild:http',
    setup(build: PluginBuild) {
        const http = import('http');
        const https = import('https');

        // 拦截http请求 并添加 http-url 的 namespace
        build.onResolve({ filter: /^https?:\/\// }, (args: OnResolveArgs) => ({
            path: args.path,
            namespace: 'http-url'
        }))

        // 处理外置http请求的前置依赖
        build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args: OnResolveArgs) => ({
            path: new URL(args.path, args.importer).toString(),
            namespace: 'http-url'
        }))

        // 路径解析
        build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args: OnLoadArgs) => {
            const contents: OnLoadResult['contents'] = await new Promise((resolve, reject) => {
                async function fetch(url: string) {
                    console.log(`Downloading: ${url}`);
                    const lib = url.startsWith("https") ? https : http;
                    const req = (await lib)
                        .get(url, (res: any) => {
                            if ([301, 302, 307].includes(res.statusCode)) {
                                // 重定向
                                fetch(new URL(res.headers.location, url).toString());
                                req.abort();
                            } else if (res.statusCode === 200) {
                                // 响应成功
                                const chunks: Array<any> = [];
                                res.on("data", (chunk: any) => {
                                    chunks.push(chunk);
                                });
                                res.on("end", () => resolve(Buffer.concat(chunks)));
                            } else {
                                reject(
                                    new Error(`GET ${url} failed: status ${res.statusCode}`)
                                );
                            }
                        })
                        .on("error", reject);
                }
                fetch(args.path);
            });

            return {
                contents
            }
        })
    }
})