import { build } from "esbuild";
import httpImport from "./plugin/http-import-plugin";
import htmlPlugin from "./plugin/html-plugin";
import path from "path";
async function runBuild() {
    build({
        absWorkingDir: process.cwd(),
        entryPoints: [path.join(__dirname, "./src/index.tsx")],
        outdir: "dist",
        bundle: true,
        format: "esm",
        splitting: true,
        sourcemap: true,
        metafile: true,
        plugins: [httpImport(), htmlPlugin()],
    }).then(() => {
        console.log("🚀 Build Finished!");
    });
}

runBuild();