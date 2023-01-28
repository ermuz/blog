# vite

## 预构建

### 为什么要进行预构建

1. 是将其他格式(如 `UMD` 和 `CommonJS`)的产物转换为 `ESM` 格式，使其在浏览器通过 `<script type="module"><script>`的方式正常加载。
2. 是打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少 HTTP 请求数量，避免页面加载性能劣化。

而这两件事情全部由性能优异的 `Esbuild` (基于 `Golang` 开发)完成，而不是传统的 `Webpack/Rollup`，所以也不会有明显的打包性能问题，反而是 `Vite` 项目启动飞快(秒级启动)的一个核心原因。

### 如何开启

#### 自动开启

第一次启动项目的时候，便会自动开启。命令行中会显示

```shell
Pre-building dependencies:
...
```

在项目启动成功后，根目录下的 `node_modules` 中发现 `.vite` 目录，这就是构建产物文件存放的目录。

在浏览器访问页面后，打开 `Dev Tools` 中的网络调试面板，可以发现第三方包的引入路径已经被重写

```js
import React from "react";
// 路径被重写，定向到预构建产物文件中
import __vite__cjsImport0_react from "/node_modules/.vite/react.js?v=979739df";
const React = __vite__cjsImport0_react.__esModule
  ? __vite__cjsImport0_react.default
  : __vite__cjsImport0_react;
```

并且对于依赖的请求结果，`Vite` 的 `Dev Server` 会设置强缓存:

```text
Cache-Control: max-age=31536000,immutable
```

缓存过期时间被设置为一年，表示缓存过期前浏览器对 `react` 预构建产物的请求不会再经过 `Vite Dev Server`，直接用缓存结果。

当然，除了 `HTTP` 缓存，`Vite` 还设置了本地文件系统的缓存，所有的预构建产物默认缓存在 `node_modules/.vite` 目录中。如果以下 3 个地方都没有改动，`Vite` 将一直使用缓存文件:

1. `package.json` 的 `dependencies` 字段
2. 各种包管理器的 `lock` 文件
3. `optimizeDeps` 配置内容

#### 手动开启

自动开启中提到了与构建中本地文件系统的产物缓存机制，少数场景下我们不希望用本地的缓存文件，比如需要调试某个包的预构建结构，推荐下面3中方法清除缓存：

1. 删除 `node_modules/.vite` 目录。
2. 在 `Vite` 配置文件中，将 `server.force` 设为 `true`。(注意，`Vite 3.0` 中配置项有所更新，你需要将 `optimizeDeps.force` 设为 `true` )
3. 命令行执行 `npx vite --force` 或者 `npx vite optimize`

> `Vite` 项目的启动可以分为两步，第一步是依赖预构建，第二步才是 `Dev Server` 的启动，`npx vite optimize` 相比于其它的方案，仅仅完成第一步的功能。

### 自定义配置详解

#### 入口文件——entries

通过这个参数你可以自定义预构建的入口文件, `optimizeDeps.entries`

实际上，在项目第一次启动时，Vite 会默认抓取项目中所有的 HTML 文件（如当前脚手架项目中的index.html），将 HTML 文件作为应用入口，然后根据入口文件扫描出项目中用到的第三方依赖，最后对这些依赖逐个进行编译。

那么，当默认扫描 HTML 文件的行为无法满足需求的时候，比如项目入口为vue格式文件时，你可以通过 entries 参数来配置:

```ts
// vite.config.ts
{
  optimizeDeps: {
    // 为一个字符串数组
    entries: ["./src/main.vue"];
  }
}
```

当然，`entries` 配置也支持 `glob` 语法，非常灵活，如:

```ts
// 将所有的 .vue 文件作为扫描入口
entries: ["**/*.vue"];
```

不光是 `.vue` 文件，`Vite` 同时还支持各种格式的入口，包括: `html、svelte、astro、js、jsx、ts` 和 `tsx`。可以看到，只要可能存在 `import` 语句的地方，`Vite` 都可以解析，并通过内置的扫描机制搜集到项目中用到的依赖，通用性很强。

#### 添加一些依赖——include

`includes` 也是一个很长用的配置，它决定了可以强制预构建的依赖项

```ts
// vite.config.ts
optimizeDeps: {
  // 配置为一个字符串数组，将 `lodash-es` 和 `vue`两个包强制进行预构建
  include: ["lodash-es", "vue"];
}
```

通过前面我们知道，`Vite` 会根据应用入口 `entries` 自动收集依赖，然后进行预构建，那么什么场景我们需要配置 `includes` 来呢？

##### 动态import

在某些动态import 的场景下，由于 Vite 天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来。

```ts
// src/locales/zh_CN.js
import objectAssign from "object-assign";
console.log(objectAssign);

// main.tsx
const importModule = (m) => import(`./locales/${m}.ts`);
importModule("zh_CN");
```

在上面的例子中，动态 `import` 的路径只有在运行时才能确定，无法在预构建阶段扫描出来。在访问项目时控制台会出现下面的日志信息，触发**二次构建**。

```shell
[vite] new dependencies found: object-assign, updating...
[vite] ✨ dependencies updated, reloading page...
```

在复杂项目中，这个项目会执行多次。然而，二次预构建的成本也比较大。我们不仅需要把预构建的流程重新运行一遍，还得重新刷新页面，并且需要重新请求所有的模块。尤其是在大型项目中，这个过程会严重拖慢应用的加载速度！因此，我们要尽力避免运行时的二次预构建。此时，可以显示声明需要按需加载的依赖

```ts
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 按需加载的依赖都可以声明到这个数组里
      "object-assign",
    ];
  }
}
```

##### 某些包被手动 exclude

`exclude` 是 `optimizeDeps` 中的另一个配置项，与 `include` 相对，用于将某些依赖从预构建的过程中排除。不过这个配置并不常用，也不推荐大家使用。如果真遇到了要在预构建中排除某个包的情况，需要注意它所依赖的包是否具有 `ESM` 格式，如下面这个例子:

```ts
// vite.config.ts
{
  optimizeDeps: {
    exclude: ["@loadable/component"];
  }
}
```

浏览器会出现如下报错

```shell
The request module '/node_modules/hoist-non-react-statics/**/**.cjs.js' does not provide an export named 'default'
```

原因是我们刚刚 `exclude` 的包 `@loadable/component`，本身具有 `ESM` 格式的产物，但它的某个依赖 `hoist-non-react-statics` 的产物并没有提供 `ESM` 格式，导致运行时加载失败。`includes` 手动加入 `hoist-non-react-statics`，间接引用进行预构建

```ts
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      "@loadable/component > hoist-non-react-statics",
    ];
  }
}
```

#### 自定义 Esbuild 行为

`Vite` 提供了 `esbuildOptions` 参数来让我们自定义 `Esbuild` 本身的配置，常用的场景是加入一些 `Esbuild` 插件:

```ts
// vite.config.ts
{
  optimizeDeps: {
    esbuildOptions: {
       plugins: [
        // 加入 Esbuild 插件
      ];
    }
  }
}
```

这个配置主要是处理一些特殊情况，如某个第三方包本身的代码出现问题了。接下来，我们就来讨论一下。

##### 特殊情况: 第三方包出现问题怎么办？

由于我们无法保证第三方包的代码质量，在某些情况下我们会遇到莫名的第三方库报错。我举一个常见的案例——`react-virtualized` 库。这个库被许多组件库用到，但它的 `ESM` 格式产物有明显的问题，在 `Vite` 进行预构建的时候会直接抛出这个错误：

![react-virtualized-error](/engineering/construct/vite/react-virtualized-error.webp)

原因是这个库的 ES 产物莫名其妙多出了一行无用的代码:

```ts
// WindowScroller.js 并没有导出这个模块
import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";
```

其实我们并不需要这行代码，但它却导致 Esbuild 预构建的时候直接报错退出了。那这一类的问题如何解决呢？

###### 修改第三方库

使用 `patch-package` 可以修改并同步到 `git` 上，`@milahu/patch-package` pnpm 版本

步骤

1. 修改 node_modules 目录下源码
2. `npx patch-package react-virtualized`
3. 在 `package.json` 的 `scripts` 中增加如下内容

    ```json
    {
        "scripts": {
            // 省略其它 script
            "postinstall": "patch-package"
        }
    }
    ```

###### 加入 Esbuild 插件

第二种方式是通过 Esbuild 插件修改指定模块的内容，这里我给大家展示一下新增的配置内容:

```ts
// vite.config.ts
const esbuildPatchPlugin = {
  name: "react-virtualized-patch",
  setup(build) {
    build.onLoad(
      {
        filter:
          /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/,
      },
      async (args) => {
        const text = await fs.promises.readFile(args.path, "utf8");

        return {
          contents: text.replace(
            'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
            ""
          ),
        };
      }
    );
  },
};

// 插件加入 Vite 预构建配置
{
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPatchPlugin];
    }
  }
}
```

## 双引擎架构

`Vite` 底层深度使用的两个构建引擎—— `Esbuild` 和 `Rollup`，一图胜千言，下面是 `Vite` 架构图

![vite-architecture](/engineering/construct/vite/vite-architecture.webp)

### 性能利器——Esbuild

`Esbuild` 的确是 `Vite` 高性能的得力助手，在很多关键的构建阶段让 `Vite` 获得了相当优异的性能，如果这些阶段用传统的打包器/编译器来完成的话，开发体验要下降一大截。

#### 依赖预构建——作为Bundle工具

首先是开发阶段的<a href="#预构建">依赖预构建</a>阶段

`Vite 1.x` 版本中使用 `Rollup` 来做这件事情，但 `Esbuild` 的性能实在是太恐怖了，`Vite 2.x` 果断采用 `Esbuild` 来完成第三方依赖的预构建，至于性能到底有多强，大家可以参照它与传统打包工具的性能对比图:

![性能对比图](/engineering/construct/vite/build-tools-benchmark.webp)

当然，`Esbuild` 作为打包工具也有一些缺点。

1. 不支持降级到 `ES5` 的代码。这意味着在低端浏览器代码会跑不起来。
2. 不支持 `const enum` 等语法。这意味着单独使用这些语法在 `esbuild` 中会直接抛错。
3. 不提供操作打包产物的接口，像 `Rollup` 中灵活处理打包产物的能力(如`renderChunk`钩子)在 `Esbuild` 当中完全没有。
4. 不支持自定义 `Code Splitting` 策略。传统的 `Webpack` 和 `Rollup` 都提供了自定义拆包策略的 `API`，而 `Esbuild` 并未提供，从而降级了拆包优化的灵活性。

尽管 `Esbuild` 作为一个社区新兴的明星项目，有如此多的局限性，但依然不妨碍 `Vite` 在开发阶段使用它成功启动项目并获得极致的性能提升，生产环境处于稳定性考虑当然是采用功能更加丰富、生态更加成熟的 `Rollup` 作为依赖打包工具了。

#### 单文件编译——作为 TS 和 JSX 编译工具

在 `TS(X)/JS(X)` 单文件编译上面，`Vite` 以插件的形式使用 `Esbuild` 进行语法转译，也就是将 `Esbuild` 作为 `Transformer` 来用。这部分能力用来替换原先 `Babel` 或者 `TSC` 的功能，因为无论是 `Babel` 还是 `TSC` 都有性能问题，大家对这两个工具普遍的认知都是: **慢，太慢了**。

当 `Vite` 使用 `Esbuild` 做单文件编译之后，提升可以说相当大了，我们以一个巨大的 `50MB+` 的纯代码文件为例，来对比 `Esbuild、Babel、TSC` 包括 `SWC` 的编译性能:

![build-performance](/engineering/construct/vite/build-performance.webp)

可以看到，虽然 `Esbuild Transfomer` 能带来巨大的性能提升，但其自身也有局限性，最大的局限性就在于 `TS` 中的类型检查问题。这是因为 `Esbuild` 并没有实现 `TS` 的类型系统，在编译 `TS`(或者 `TSX`) 文件时仅仅抹掉了类型相关的代码，暂时没有能力实现类型检查。

#### 代码压缩——作为压缩工具

> Vite 从 2.6 版本开始，就官宣默认使用 Esbuild 来进行生产环境的代码压缩，包括 JS 代码和 CSS 代码。

传统的方式都是使用 `Terser` 这种 `JS` 开发的压缩器来实现，在 `Webpack` 或者 `Rollup` 中作为一个 `Plugin` 来完成代码打包后的压缩混淆的工作。但 `Terser` 其实很慢，主要有 2 个原因。

1. 压缩这项工作涉及大量 `AST` 操作，并且在传统的构建流程中，`AST` 在各个工具之间无法共享，比如 `Terser` 就无法与 `Babel` 共享同一个 `AST`，造成了很多重复解析的过程。
2. `JS` 本身属于解释性 + `JIT`（即时编译） 的语言，对于压缩这种 `CPU` 密集型的工作，其性能远远比不上 `Golang` 这种原生语言。

因此，`Esbuild` 这种从头到尾共享 `AST` 以及原生语言编写的 `Minifier` 在性能上能够甩开传统工具的好几十倍。

总的来说，`Vite` 将 `Esbuild` 作为自己的性能利器，将 `Esbuild` 各个垂直方向的能力(`Bundler、Transformer、Minifier`)利用的淋漓尽致，给 `Vite` 的高性能提供了有利的保证。

### 构建基石——Rollup

它既是 `Vite` 用作生产环境打包的核心工具，也直接决定了 `Vite` 插件机制的设计。

#### 生产环境 Bundle

虽然 ESM 已经得到众多浏览器的原生支持，但生产环境做到完全no-bundle也不行，会有网络性能问题。为了在生产环境中也能取得优秀的产物性能，Vite 默认选择在生产环境中利用 Rollup 打包，并基于 Rollup 本身成熟的打包能力进行扩展和优化，主要包含 3 个方面:

1. CSS 代码分割。如果某个异步模块中引入了一些 CSS 代码，Vite 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的缓存复用率。
2. 自动预加载。Vite 会自动为入口 chunk 的依赖自动生成预加载标签`<link rel="moduelpreload">` ，如:

    ```html

    <head>
    <!-- 省略其它内容 -->
    <!-- 入口 chunk -->
    <script type="module" crossorigin src="/assets/index.250e0340.js"></script>
    <!--  自动预加载入口 chunk 所依赖的 chunk-->
    <link rel="modulepreload" href="/assets/vendor.293dca09.js">
    </head>
    ```

    这种适当预加载的做法会让浏览器提前下载好资源，优化页面性能。

3. 异步 Chunk 加载优化。在异步引入的 Chunk 中，通常会有一些公用的模块，如现有两个异步引入的 Chunk: A 和 B，而且两者有一个公共依赖 C，如下图:
    ![async-chunk-load](/engineering/construct/vite/async-chunk-load.webp)

    一般情况下

    ```text
    entry -> A -> C
    ```

    Rollup 优化后

    ```text
    entry -> (A + C)
    ```

#### 兼容插件机制

无论是开发阶段还是生产环境，`Vite` 都根植于 `Rollup` 的插件机制和生态。`Vite` 的做法是从头到尾根植于的 `Rollup` 的生态，设计了和 `Rollup` 非常吻合的插件机制，而 `Rollup` 作为一个非常成熟的打包方案，从诞生至今已经迭代了六年多的时间，npm 年下载量达到上亿次，产物质量和稳定性都经历过大规模的验证。某种程度上说，这种根植于已有成熟工具的思路也能打消或者降低用户内心的疑虑，更有利于工具的推广和发展。

## Esbuild 功能使用与插件开发

### 为什么 Esbuild 性能极高

Esbuild 是由 Figma 的 CTO 「Evan Wallace」基于 Golang 开发的一款打包工具，相比传统的打包工具，主打性能优势，在构建速度上可以比传统工具快 10~100 倍。那么，它是如何达到这样超高的构建性能的呢？主要原因可以概括为 4 点。

1. **使用 Golang 开发**，构建逻辑代码直接被编译为原生机器码，而不用像 JS 一样先代码解析为字节码，然后转换为机器码，大大节省了程序运行时间。

2. **多核并行**。内部打包算法充分利用多核 CPU 优势，所有的步骤尽可能并行，这也是得益于 Go 当中多线程共享内存的优势。

3. **从零造轮子**。 几乎没有使用任何第三方库，所有逻辑自己编写，大到 AST 解析，小到字符串的操作，保证极致的代码性能。

4. **高效的内存利用**。Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，而不用像 JS 打包工具中频繁地解析和传递 AST 数据（如 string -> TS -> JS -> string)，造成内存的大量浪费。

### Esbuild 功能使用

### Esbuild 插件开发

我们在使用 `Esbuild` 的时候难免会遇到一些需要加上自定义插件的场景，并且 `Vite` 依赖预编译的实现中大量应用了 `Esbuild` 插件的逻辑。因此，插件开发是 `Esbuild` 中非常重要的内容，

#### 基本概念

插件开发其实就是基于原有的体系结构中进行扩展和自定义。 `Esbuild` 插件也不例外，通过 `Esbuild` 插件我们可以扩展 `Esbuild` 原有的路径解析、模块加载等方面的能力，并在 `Esbuild` 的构建过程中执行一系列自定义的逻辑。

`Esbuild` 插件结构被设计为一个对象，里面有 `name` 和 `setup` 两个属性，name是插件的名称，`setup` 是一个函数，其中入参是一个 `build` 对象，这个对象上挂载了一些钩子可供我们自定义一些钩子函数逻辑。以下是一个简单的 `Esbuild` 插件示例:

```js
let envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, args => ({
      path: args.path,
      namespace: 'env-ns',
    }))

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }))
  },
}

require('esbuild').build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'out.js',
  // 应用插件
  plugins: [envPlugin],
}).catch(() => process.exit(1))

```

#### 钩子函数的使用

##### `onResolve` 钩子 和 `onLoad` 钩子

`onResolve` 和 `onLoad` ，分别控制路径解析和模块内容加载的过程。

```js
build.onResolve({ filter: /^env$/ }, args => ({
  path: args.path,
  namespace: 'env-ns',
}));
build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
  contents: JSON.stringify(process.env),
  loader: 'json',
}));
```

两个钩子函数都需要传入两个参数：`Options`、`Callback`

```ts
interface Options {
  filter: RegExp;
  namespace?: string;
}
```

`filter` 为必传参数，是一个正则表达式，它决定了要过滤出的特征文件。

::: warning
插件中的 filter 正则是使用 Go 原生正则实现的，为了不使性能过于劣化，规则应该尽可能严格。同时它本身和 JS 的正则也有所区别，不支持前瞻(?<=)、后顾(?=)和反向引用(\1)这三种规则。
:::

`namespace` 为选填参数，一般在 `onResolve` 钩子中的回调参数返回 `namespace` 属性作为标识，我们可以在 `onLoad` 钩子中通过 `namespace` 将模块过滤出来。如上述插件示例就在 `onLoad` 钩子通过 env-ns 这个 `namespace` 标识过滤出了要处理的env模块。

除了 `Options` 参数，还有一个回调参数 `Callback`，它的类型根据不同的钩子会有所不同。相比于 `Options`，`Callback` 函数入参和返回值的结构复杂得多，涉及很多属性。

```ts
export type ImportKind =
  | 'entry-point'

  // JS
  | 'import-statement'
  | 'require-call'
  | 'dynamic-import'
  | 'require-resolve'

  // CSS
  | 'import-rule'
  | 'url-token'

interface onResolveArgs {
  // 模块路径
  path: string;
  // 父模块路径
  importer: string;
  // namespace 标识
  namespace: string;
  // 基准路径
  resolveDir: string;
  // 导入方式，如 import、require
  kind: ImportKind;
  // 额外绑定的插件数据
  pluginData: any;
}

interface onResolveResult {
  // 插件名称
  pluginName?: string;

  // 错误信息
  errors?: any[];
  // 警告信息
  warnings?: any[];

  // 模块路径
  path?: string;
  // 是否需要 external
  external?: boolean;
  // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
  sideEffects?: boolean;
  // namespace 标识
  namespace?: string;
  // 添加一些路径后缀，如`?xxx`
  suffix?: string;
  // 额外绑定的插件数据
  pluginData?: any;

  // 仅仅在 Esbuild 开启 watch 模式下生效
  // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
  watchFiles?: string[];
  watchDirs?: string[];
}
```

```ts
interface OnLoadArgs {
  // 模块路径
  path: string;
  // // namespace 标识
  namespace: string;
  // 后缀信息
  suffix: string;
  // 额外的插件数据
  pluginData: any;
}

export interface OnLoadResult {
  // 插件名称
  pluginName?: string;

  // 错误信息
  errors?: any[];
  // 警告信息
  warnings?: any[];

  // 模块具体内容
  contents?: string | Uint8Array;
  // 基准路径
  resolveDir?: string;
  // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
  loader?: Loader;
  // 额外的插件数据
  pluginData?: any;

 // 同上
  watchFiles?: string[];
  watchDirs?: string[];
}

```

##### 其他钩子

在 `build` 对象中，除了 `onResolve` 和 `onLoad`，还有 `onStart` 和 `onEnd` 两个钩子用来在构建开启和结束时执行一些自定义的逻辑，使用上比较简单，如下面的例子所示:

```ts
let examplePlugin = {
  name: 'example',
  setup(build) {
    build.onStart(() => {
      console.log('build started')
    });
    build.onEnd((buildResult) => {
      if (buildResult.errors.length) {
        return;
      }
      // 构建元信息
      // 获取元信息后做一些自定义的事情，比如生成 HTML
      console.log(buildResult.metafile)
    })
  },
}
```

在使用这些钩子的时候，有 2 点需要注意。

`onStart` 的执行时机是在每次 `build` 的时候，包括触发 `watch` 或者 `serve` 模式下的重新构建。
`onEnd` 钩子中如果要拿到 `metafile`，必须将 `Esbuild` 的构建配置中 `metafile` 属性设为 `true`。

## Rollup 插件机制

`Rollup` 内部主要经历了 `Build` 和 `Output` 两大阶段：

![rollup-flow-chart](/engineering/construct/vite/rollup-flow-chart.webp)

对于一次完整的构建过程而言， `Rollup` 会先进入到 `Build` 阶段，解析各模块的内容及依赖关系，然后进入 `Output` 阶段，完成打包及输出的过程。

### 拆解插件工作流

#### 插件 Hook 类型

插件的各种 `Hook` 可以根据上述这两个构建阶段分为两类: `Build Hook` 与 `Output Hook`。

- `Build Hook` 即在 `Build` 阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、`AST` 解析以及模块依赖的解析，那么这个阶段的 `Hook` 对于代码的操作粒度一般为模块级别，也就是单文件级别。
- `Ouput Hook`(官方称为`Output Generation Hook`)，则主要进行代码的打包，对于代码而言，操作粒度一般为 `chunk` 级别(一个 `chunk` 通常指很多文件打包到一起的产物)。

还可以根据 `Hook` 的执行方式进行分类，主要包括 `Async、Sync、Parallel、Squential、First` 这5种。

1. Async & Sync

    首先是Async和Sync钩子函数，两者其实是相对的，分别代表异步和同步的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。

2. Parallel

    这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。

    比如对于Build阶段的buildStart钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实插件之间的操作并不是相互依赖的，也就是可以并发执行，从而提升构建性能。反之，对于需要依赖其他插件处理结果的情况就不适合用 Parallel 钩子了，比如 transform。

3. Sequential

    Sequential 指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如transform。

4. First

    如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止。比较典型的 Hook 是 resolveId，一旦有插件的 resolveId 返回了一个路径，将停止执行后续插件的 resolveId 逻辑。

刚刚我们介绍了 Rollup 当中不同插件 Hook 的类型，实际上不同的类型是可以叠加的，Async/Sync 可以搭配后面三种类型中的任意一种，比如一个 Hook既可以是 Async 也可以是 First 类型，接着我们将来具体分析 Rollup 当中的插件工作流程，里面会涉及到具体的一些 Hook，大家可以具体地感受一下。

#### Build 工作流

![rollup-build-work-flow](/engineering/construct/vite/rollup-build-work-flow.webp)

1. 首先经历 options 钩子进行配置的转换，得到处理后的配置对象。

2. 随之 Rollup 会调用buildStart钩子，正式开始构建流程。

3. Rollup 先进入到 resolveId 钩子中解析文件路径。(从 input 配置指定的入口文件开始)。

4. Rollup 通过调用load钩子加载模块内容。

5. 紧接着 Rollup 执行所有的 transform 钩子来对模块内容进行进行自定义的转换，比如 babel 转译。

6. 现在 Rollup 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 moduleParsed 钩子:

   1. 如果是普通的 import，则执行 resolveId 钩子，继续回到步骤3。
   2. 如果是动态 import，则执行 resolveDynamicImport 钩子解析路径，如果解析成功，则回到步骤4加载模块，否则回到步骤3通过 resolveId 解析路径。

7. 直到所有的 import 都解析完毕，Rollup 执行buildEnd钩子，Build 阶段结束。

#### Output 阶段工作流

![rollup-output-work-flow](/engineering/construct/vite/rollup-output-work-flow.webp)

1. 执行所有插件的 outputOptions 钩子函数，对 output 配置进行转换。

2. 执行 renderStart，并发执行 renderStart 钩子，正式开始打包。

3. 并发执行所有插件的banner、footer、intro、outro 钩子(底层用 Promise.all 包裹所有的这四种钩子函数)，这四个钩子功能很简单，就是往打包产物的固定位置(比如头部和尾部)插入一些自定义的内容，比如协议声明内容、项目介绍等等。

4. 从入口模块开始扫描，针对动态 import 语句执行 renderDynamicImport钩子，来自定义动态 import 的内容。

5. 对每个即将生成的 chunk，执行 augmentChunkHash钩子，来决定是否更改 chunk 的哈希值，在 watch 模式下即可能会多次打包的场景下，这个钩子会比较适用。

6. 如果没有遇到 import.meta 语句，则进入下一步，否则:

    1. 对于 import.meta.url 语句调用 resolveFileUrl 来自定义 url 解析逻辑
    2. 对于其他import.meta 属性，则调用 resolveImportMeta 来进行自定义的解析。
7. 接着 Rollup 会生成所有 chunk 的内容，针对每个 chunk 会依次调用插件的renderChunk方法进行自定义操作，也就是说，在这里时候你可以直接操作打包产物了。

8. 随后会调用 generateBundle 钩子，这个钩子的入参里面会包含所有的打包产物信息，包括 chunk (打包后的代码)、asset(最终的静态资源文件)。你可以在这里删除一些 chunk 或者 asset，最终这些内容将不会作为产物输出。

9. 前面提到了rollup.rollup方法会返回一个bundle对象，这个对象是包含generate和write两个方法，两个方法唯一的区别在于后者会将代码写入到磁盘中，同时会触发writeBundle钩子，传入所有的打包产物信息，包括 chunk 和 asset，和 generateBundle钩子非常相似。不过值得注意的是，这个钩子执行的时候，产物已经输出了，而 generateBundle 执行的时候产物还并没有输出。顺序如下图所示:

    ![rollup-output-work-flow-8](/engineering/construct/vite/rollup-output-work-flow-8.webp)

10. 当上述的bundle的close方法被调用时，会触发closeBundle钩子，到这里 Output 阶段正式结束。

## HMR

`HMR` 的全称叫做 `Hot Module Replacement`，即模块热替换或者模块热更新。`HMR` 的作用就是在页面模块更新的时候，直接把页面中发生变化的模块替换为新的模块，同时不会影响其它模块的正常运作。

### HMR API

`Vite` 作为一个完整的构建工具，本身实现了一套 `HMR` 系统，值得注意的是，这套 `HMR` 系统基于原生的 `ESM` 模块规范来实现，在文件发生改变时 `Vite` 会侦测到相应 `ES` 模块的变化，从而触发相应的 `API`，实现局部的更新。

```ts
interface ImportMeta {
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: string[], cb: (mods: any[]) => void): void
    prune(cb: () => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
}
```

`import.meta` 对象为现代浏览器原生的一个内置对象，`Vite` 所做的事情就是在这个对象上的 `hot` 属性中定义了一套完整的属性和方法。因此，在 `Vite` 当中，你就可以通过`import.meta.hot`来访问关于 `HMR` 的这些属性和方法，比如`import.meta.hot.accept()`

#### 模块更新时逻辑: hot.accept

在 `import.meta.hot` 对象上有一个非常关键的方法 `accept` ，因为它决定了 `Vite` 进行热更新的边界，那么如何来理解这个 `accept` 的含义呢？

它是用来接受模块更新的。 一旦 `Vite` 接受了这个更新，当前模块就会被认为是 `HMR` 的边界。那么，`Vite` 接受谁的更新呢？这里会有三种情况：

- 接受**自身模块**的更新
- 接受**某个子模块**的更新
- 接受**多个子模块**的更新

##### 接受自身更新

当模块接受自身的更新时，则当前模块会被认为 `HMR` 的边界。也就是说，除了当前模块，其他的模块均未受到任何影响。

![vite-hmr-self-accept](/engineering/construct/vite/vite-hmr-self-accept.webp)

在需要更新的模块中加入以下代码，该模块即可自动更新

```ts
// 条件守卫
if (import.meta.hot) {
    import.meta.hot.accept((mod) => mod.[method]())
}
```

##### 接受依赖模块的更新

![vite-hmr-dep-accept](/engineering/construct/vite/vite-hmr-dep-accept.webp)

```ts
if (import.meta.hot) {
    import.meta.hot.accept('./render.ts', (newModule) => {
        newModule.[method]();
    })
}
```

##### 接受多个子模块的更新

![vite-hmr-mtil-dep-accept](/engineering/construct/vite/vite-hmr-mtil-dep-accept.webp)

```ts
if (import.meta.hot) {
    import.meta.hot.accept(['./render.ts', './state.ts'], (modules) => {
        // 自定义更新
        const [moduleA, moduleB] = modules;
        if (moduleA) {
        moduleA.[method]();
        }
        if (moduleB) {
        moduleB.[method]();
        }
    })
}
```

::: warning
代码中如果使用了定时器可能会有问题，在模块更新的时候，定时器并没有被销毁
:::

```ts
// vite accept 定义
accept(deps?: any, callback?: any) {
    if (typeof deps === 'function' || !deps) {
        // self-accept: hot.accept(() => {})
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod))
    } else if (typeof deps === 'string') {
        // explicit deps
        acceptDeps([deps], ([mod]) => callback && callback(mod))
    } else if (Array.isArray(deps)) {
        acceptDeps(deps, callback)
    } else {
        throw new Error(`invalid hot.accept() usage.`)
    }
},

```

#### 模块销毁时逻辑: hot.dispose

代表在模块更新、旧模块需要销毁时需要做的一些事情

```ts
// state.ts 销毁定时器
let timer: number | undefined;
if (import.meta.hot) {
  import.meta.hot.dispose(() => {// [!code ++]
    if (timer) { // [!code ++]
      clearInterval(timer);// [!code ++]
    } // [!code ++]
  }) // [!code ++]
}
export function initState() {
  let count = 0;
  timer = setInterval(() => {
    let countEle = document.getElementById('count');
    countEle!.innerText =  ++count + '';
  }, 1000);
}
```

使用上述代码后，热更新后，状态将会初始化，不符合期望

#### 共享数据: hot.data 属性

用来在不同的模块实例间共享一些数据。使用上也非常简单

```ts
let timer: number | undefined;
if (import.meta.hot) {
    // 初始化 count
    if (!import.meta.hot.data.count) { // [!code ++]
        import.meta.hot.data.count = 0; // [!code ++]
    } // [!code ++]
    import.meta.hot.dispose(() => {
        if (timer) {
            clearInterval(timer);
        }
    })
}
export function initState() {
    const getAndIncCount = () => { // [!code ++]
        const data = import.meta.hot?.data || { // [!code ++]
            count: 0 // [!code ++]
        }; // [!code ++]
        data.count = data.count + 1; // [!code ++]
        return data.count; // [!code ++]
    }; // [!code ++]
    timer = setInterval(() => {
        let countEle = document.getElementById('count');
        countEle!.innerText =  getAndIncCount() + ''; // [!code ++]
    }, 1000);
}
```

#### 其他方法

1. import.meta.hot.decline()

    相当于表示此模块不可热更新，当模块更新时会强制进行页面刷新

2. import.meta.hot.invalidate()

    用来强制刷新页面。

3. 自定义事件

   你还可以通过 import.meta.hot.on 来监听 HMR 的自定义事件，内部有这么几个事件会自动触发:

   - vite:beforeUpdate 当模块更新时触发；
   - vite:beforeFullReload 当即将重新刷新页面时触发；
   - vite:beforePrune 当不再需要的模块即将被剔除时触发；
   - vite:error 当发生错误时（例如，语法错误）触发。

## Code Splitting

术语：

- `bundle` 指的是整体的打包产物，包含 `JS` 和各种静态资源。
- `chunk` 指的是打包后的 `JS` 文件，是 `bundle` 的子集。
- `vendor` 是指第三方包的打包产物，是一种特殊的 `chunk`。
  
### 解决的问题

在传统的单 `chunk` 打包模式下，当项目代码越来越庞大，最后会导致浏览器下载一个巨大的文件，从页面加载性能的角度来说，主要会导致两个问题:

- 无法做到按需加载，即使是当前页面不需要的代码也会进行加载。
- 线上缓存复用率极低，改动一行代码即可导致整个 `bundle` 产物缓存失效

### Vite 默认拆包策略

在生产环境下 Vite 完全利用 Rollup 进行构建，因此拆包也是基于 Rollup 来完成的，但 Rollup 本身是一个专注 JS 库打包的工具，对应用构建的能力还尚为欠缺，Vite 正好是补足了 Rollup 应用构建的能力，在拆包能力这一块的扩展就是很好的体现。

```md
.
├── assets
│   ├── Dynamic.3df51f7a.js    // Async Chunk
│   ├── Dynamic.f2cbf023.css   // Async Chunk (CSS)
│   ├── favicon.17e50649.svg   // 静态资源
│   ├── index.1e236845.css     // Initial Chunk (CSS)
│   ├── index.6773c114.js      // Initial Chunk
│   └── vendor.ab4b9e1f.js     // 第三方包产物 Chunk
└── index.html                 // 入口 HTML
```

一方面 `Vite` 实现了自动 `CSS` 代码分割的能力，即实现一个 `chunk` 对应一个 `css` 文件，比如上面产物中 `index.js` 对应一份 `index.css`，而按需加载的 `chunk Danamic.js` 也对应单独的一份 `Danamic.css` 文件，与 `JS` 文件的代码分割同理，这样做也能提升 `CSS` 文件的缓存复用率。

而另一方面， `Vite` 基于 `Rollup` 的 `manualChunksAPI` 实现了应用拆包的策略:

- 对于 `Initital Chunk` 而言，业务代码和第三方包代码分别打包为单独的 `chunk`，在上述的例子中分别对应`index.js` 和 `vendor.js`。需要说明的是，这是 `Vite 2.9` 版本之前的做法，而在 `Vite 2.9` 及以后的版本，默认打包策略更加简单粗暴，将所有的 `js` 代码全部打包到 `index.js` 中。

- 对于 `Async Chunk` 而言 ，动态 `import` 的代码会被拆分成单独的 `chunk`，如上述的 `Dynacmic` 组件。

### 自定义拆包策略

针对更细粒度的拆包，Vite 的底层打包引擎 Rollup 提供了manualChunks，让我们能自定义拆包策略，它属于 Vite 配置的一部分。 manualChunks 主要有两种配置的形式，可以配置为一个对象或者一个函数。

```ts
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {},
      },
    }
  },
}
```

对象

```ts
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          'react-vendor': ['react', 'react-dom'],
          // 将 Lodash 库的代码单独打包
          'lodash': ['lodash-es'],
          // 将组件库的代码打包
          'library': ['antd', '@arco-design/web-react'],
        },
      },
    }
  },
}
```

函数

```ts
// Vite 部分源码
function createMoveToVendorChunkFn(config: ResolvedConfig): GetManualChunk {
  const cache = new Map<string, boolean>()
  // 返回值为 manualChunks 的配置
  return (id, { getModuleInfo }) => {
    // Vite 默认的配置逻辑其实很简单
    // 主要是为了把 Initial Chunk 中的第三方包代码单独打包成`vendor.[hash].js`
    if (
      id.includes('node_modules') &&
      !isCSSRequest(id) &&
      // 判断是否为 Initial Chunk
      staticImportedByEntry(id, getModuleInfo, cache)
    ) {
      return 'vendor'
    }
  }
}
```

### 拆包插件

`Vite` 自定义拆包的终极解决方案——`vite-plugin-chunk-split`

```ts
// vite.config.ts
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

export default {
  chunkSplitPlugin({
    // 指定拆包策略
    customSplitting: {
      // 1. 支持填包名。`react` 和 `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的依赖，如 object-assign)
      'react-vendor': ['react', 'react-dom'],
      // 2. 支持填正则表达式。src 中 components 和 utils 下的所有文件被会被打包为`component-util`的 chunk 中
      'components-util': [/src\/components/, /src\/utils/]
    }
  })
}
```

## 语法降级与Polyfill

> 通过 `Vite` 构建我们完全可以兼容各种低版本浏览器，打包出既支持现代(`Modern`)浏览器又支持旧版(`Legacy`)浏览器的产物。

旧版浏览器的语法兼容问题主要分两类: 语法降级问题和 `Polyfill` 缺失问题。前者比较好理解，比如某些浏览器不支持箭头函数，我们就需要将其转换为`function(){}`语法；而对后者来说，`Polyfill`本身可以翻译为垫片，也就是为浏览器提前注入一些 `API` 的实现代码，如 `Object.entries` 方法的实现，这样可以保证产物可以正常使用这些 `API`，防止报错。

这两类问题本质上是通过前端的编译工具链(如`Babel`)及 `JS` 的基础 `Polyfill` 库(如`corejs`)来解决的，不会跟具体的构建工具所绑定。也就是说，对于这些本质的解决方案，在其它的构建工具(如 `Webpack`)能使用，在 `Vite` 当中也完全可以使用。

### 底层工具链

#### 工具概述

解决上述提到的两类语法兼容问题，主要需要用到两方面的工具，分别包括:

- **编译时工具**。代表工具有`@babel/preset-env`和`@babel/plugin-transform-runtime`。

- **运行时基础库**。代表库包括`core-js`和`regenerator-runtime`。

编译时工具的作用是在代码编译阶段进行语法降级及添加 `polyfill` 代码的引用语句，如:

```ts
import "core-js/modules/es6.set.js"
```

而运行时基础库是根据 ESMAScript官方语言规范提供各种Polyfill实现代码，主要包括core-js和regenerator-runtime两个基础库，不过在 babel 中也会有一些上层的封装，包括：

- @babel/polyfill
- @babel/runtime
- @babel/runtime-corejs2
- @babel/runtime-corejs3 看似各种运行时库眼花缭乱，其实都是core-js和regenerator-runtime不同版本的封装罢了(@babel/runtime是个特例，不包含 core-js 的 Polyfill)。

##### 实际使用

```shell
pnpm i @babel/cli @babel/core @babel/preset-env
```

- @babel/cli: 为 babel 官方的脚手架工具，很适合我们练习用。
- @babel/core: babel 核心编译库。
- @babel/preset-env: babel 的预设工具集，基本为 babel 必装的库。

babel配置文件 `.babelrc.json`

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        // 指定兼容的浏览器版本
        "targets": {
          "ie": "11"
        },
        // 基础库 core-js 的版本，一般指定为最新的大版本
        "corejs": 3,
        // Polyfill 注入策略，后文详细介绍
        "useBuiltIns": "usage",
        // 不将 ES 模块语法转换为其他模块语法
        "modules": false
      }
    ]
  ]
}
```

##### targets

我们可以通过 targets 参数指定要兼容的浏览器版本，你既可以填如上配置所示的一个对象:

> .babelrc.json

```json
{
    "targets": {
        "ie": "11"
    }
}
```

```json
{
  // ie 不低于 11 版本，全球超过 0.5% 使用，且还在维护更新的浏览器
  "targets": "ie >= 11, > 0.5%, not dead"
}
```

> package.json

```json
// package.json
{
  "browserslist": "ie >= 11"
}
```

> .browserslistrc

```text
// .browserslistrc
ie >= 11
```

##### useBuiltIns

决定了添加 Polyfill 策略，默认是 false，即不添加任何的 Polyfill。你可以手动将useBuiltIns配置为entry或者usage，

> entry
>
需要再入口文件入口添加代码

```ts
import 'core-js';
```

根据目标浏览器的配置为我们添加了大量的 Polyfill 代码，其中有很多我们 Polyfill 我们并没有用到

> usage

可以做到按需引入，而且不需要添加任何代码

##### 小结

@babel/preset-env 进行了目标浏览器语法的降级和 Polyfill 注入，同时用到了 core-js 和regenerator-runtime 两个核心的运行时库。但 @babel/preset-env 的方案也存在一定局限性:

- 如果使用新特性，往往是通过基础库(如 core-js)往全局环境添加 Polyfill，如果是开发应用没有任何问题，如果是开发第三方工具库，则很可能会对全局空间造成污染。
- 很多工具函数的实现代码(如上面示例中的 _defineProperty 方法)，会在许多文件中重现出现，造成文件体积冗余。

#### 更优的 Polyfill 注入方案: transform-runtime

为了解决@babel/preset-env的种种局限性

> 需要提前说明的是，transform-runtime 方案可以作为 @babel/preset-env 中 useBuiltIns 配置的替代品，也就是说，一旦使用 transform-runtime 方案，你应该把 useBuiltIns 属性设为 false。

两个必要依赖

- @babel/plugin-transform-runtime 编译时工具，用来转换语法和添加 Polyfill
- @babel/runtime-corejs3 运行时基础库，封装了core-js、regenerator-runtime和各种语法转换用到的工具函数

> core-js 有三种产物，分别是core-js、core-js-pure和core-js-bundle。第一种是全局 Polyfill 的做法，@babel/preset-env 就是用的这种产物；第二种不会把 Polyfill 注入到全局环境，可以按需引入；第三种是打包好的版本，包含所有的 Polyfill，不太常用。@babel/runtime-corejs3 使用的是第二种产物。

```json
{
  "plugins": [ 
    // 添加 transform-runtime 插件
    [ // [!code ++]
      "@babel/plugin-transform-runtime", // [!code ++]
      {// [!code ++]
        "corejs": 3// [!code ++]
      }// [!code ++]
    ]// [!code ++]
  ],// [!code ++]
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "ie": "11"
        },
        "corejs": 3,
        // 关闭 @babel/preset-env 默认的 Polyfill 注入
        "useBuiltIns": "usage", // [!code --]
        "useBuiltIns": false, // [!code ++]
        "modules": false
      }
    ]
  ]
}
```

### Vite 语法降级与 Polyfill 注入

`Vite` 官方已经为我们封装好了一个开箱即用的方案: `@vitejs/plugin-legacy`，我们可以基于它来解决项目语法的浏览器兼容问题。这个插件内部同样使用 `@babel/preset-env` 以及 `core-js` 等一系列基础库来进行语法降级和 `Polyfill` 注入。

```ts
// vite.config.ts
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // 省略其它插件
    legacy({
      // 设置目标浏览器，browserslist 配置语法
      targets: ['ie >= 11'],
    })
  ]
})
```

```md
.
├── assets
│   ├── index-legacy.[hash].js
│   ├── vendor-legacy.[hash].js
│   ├── polyfills-legacy.[hash].js
│   ├── favicon.[hash].svg
│   ├── index.[hash].css
│   ├── index.[hash].js
│   └── vendor.[hash].js
└── index.html
```

相比一般的打包过程，多出了index-legacy.js、vendor-legacy.js以及polyfills-legacy.js三份产物文件。让我们继续观察一下index.html的产物内容:

```html{9,16,17,18}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.[hash].svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <!-- 1. Modern 模式产物 -->
    <script type="module" crossorigin src="/assets/index.[hash].js"></script>
    <link rel="modulepreload" href="/assets/vendor.[hash].js">
    <link rel="stylesheet" href="/assets/index.[hash].css">
  </head>
  <body>
    <div id="root"></div>
    <!-- 2. Legacy 模式产物 -->
    <script nomodule>兼容 iOS nomodule 特性的 polyfill，省略具体代码</script>
    <script nomodule id="vite-legacy-polyfill" src="/assets/polyfills-legacy.[hash].js"></script>
    <script nomodule id="vite-legacy-entry" data-src="/assets/index-legacy.[hash].js">System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))</script>
  </body>
</html>
```

通过官方的legacy插件， Vite 会分别打包出Modern模式和Legacy模式的产物，然后将两种产物插入同一个 HTML 里面，Modern产物被放到 type="module"的 script 标签中，而Legacy产物则被放到带有 nomodule 的 script 标签中。浏览器的加载策略

- 现代浏览器 加载 type="module" ，忽略 nomodule
- 低版本浏览器 加载 nomodule ，忽略 type="module"

#### 插件执行原理

![plugin-legacy](/engineering/construct/vite/plugin-legacy.webp)

首先是在 `configResolved` 钩子中调整了 `output` 属性，这么做的目的是让 `Vite` 底层使用的打包引擎 `Rollup` 能另外打包出一份 `Legacy` 模式的产物，实现代码如下:

```ts
const createLegacyOutput = (options = {}) => {
  return {
    ...options,
    // system 格式产物
    format: 'system',
    // 转换效果: index.[hash].js -> index-legacy.[hash].js
    entryFileNames: getLegacyOutputFileName(options.entryFileNames),
    chunkFileNames: getLegacyOutputFileName(options.chunkFileNames)
  }
}

const { rollupOptions } = config.build
const { output } = rollupOptions
if (Array.isArray(output)) {
  rollupOptions.output = [...output.map(createLegacyOutput), ...output]
} else {
  rollupOptions.output = [createLegacyOutput(output), output || {}]
}
```

接着，在 `renderChunk` 阶段，插件会对 `Legacy` 模式产物进行语法转译和 `Polyfill` 收集，值得注意的是，这里并不会真正注入 `Polyfill`，而仅仅只是收集 `Polyfill`，:

```ts
renderChunk(raw, chunk, opts) {
    // 1. 使用 babel + @babel/preset-env 进行语法转换与 Polyfill 注入
    // 2. 由于此时已经打包后的 Chunk 已经生成
    //   这里需要去掉 babel 注入的 import 语句，并记录所需的 Polyfill
    // 3. 最后的 Polyfill 代码将会在 generateBundle 阶段生成
}
```

由于场景是应用打包，这里直接使用 @babel/preset-env 的useBuiltIns: 'usage'来进行全局 Polyfill 的收集是比较标准的做法。

回到 Vite 构建的主流程中，接下来会进入generateChunk钩子阶段，现在 Vite 会对之前收集到的Polyfill进行统一的打包，实现也比较精妙，主要逻辑集中在buildPolyfillChunk函数中:

```ts
// 打包 Polyfill 代码
async function buildPolyfillChunk(
  name,
  imports
  bundle,
  facadeToChunkMap,
  buildOptions,
  externalSystemJS
) {
  let { minify, assetsDir } = buildOptions
  minify = minify ? 'terser' : false
  // 调用 Vite 的 build API 进行打包
  const res = await build({
    // 根路径设置为插件所在目录
    // 由于插件的依赖包含`core-js`、`regenerator-runtime`这些运行时基础库
    // 因此这里 Vite 可以正常解析到基础 Polyfill 库的路径
    root: __dirname,
    write: false,
    // 这里的插件实现了一个虚拟模块
    // Vite 对于 polyfillId 会返回所有 Polyfill 的引入语句
    plugins: [polyfillsPlugin(imports, externalSystemJS)],
    build: {
      rollupOptions: {
        // 访问 polyfillId
        input: {
          // name 暂可视作`polyfills-legacy`
          // pofyfillId 为一个虚拟模块，经过插件处理后会拿到所有 Polyfill 的引入语句
          [name]: polyfillId
        },
      }
    }
  });
  // 拿到 polyfill 产物 chunk
  const _polyfillChunk = Array.isArray(res) ? res[0] : res
  if (!('output' in _polyfillChunk)) return
  const polyfillChunk = _polyfillChunk.output[0]
  // 后续做两件事情:
  // 1. 记录 polyfill chunk 的文件名，方便后续插入到 Modern 模式产物的 HTML 中；
  // 2. 在 bundle 对象上手动添加 polyfill 的 chunk，保证产物写到磁盘中
}
```

因此，你可以理解为这个函数的作用即通过 vite build 对renderChunk中收集到 polyfill 代码进行打包，生成一个单独的 chunk: legacy-polyfill

> 需要注意的是，polyfill chunk 中除了包含一些 core-js 和 regenerator-runtime 的相关代码，也包含了 SystemJS 的实现代码，你可以将其理解为 ESM 的加载器，实现了在旧版浏览器下的模块加载能力。

```ts
{
  transformIndexHtml(html) {
    // 1. 插入 Polyfill chunk 对应的 <script nomodule> 标签
    // 2. 插入 Legacy 产物入口文件对应的 <script nomodule> 标签
  }
}
```

插件相关问题

- 当插件参数中开启了modernPolyfills选项时，Vite 也会自动对 Modern 模式的产物进行 Polyfill 收集，并单独打包成polyfills-modern.js的 chunk，原理和 Legacy 模式下处理 Polyfill 一样。

- Sarari 10.1 版本不支持 nomodule，为此需要单独引入一些[补丁代码](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc/)。

- 部分低版本 Edge 浏览器虽然支持 type="module"，但不支持动态 import，为此也需要插入一些[补丁代码](https://github.com/vitejs/vite/pull/3885/)，针对这种情况下降级使用 Legacy 模式的产物。

## 性能优化

对于项目的加载性能优化而言，常见的优化手段可以分为下面三类:

- **网络优化** 包括 `HTTP2`、`DNS` 预解析、`Preload`、`Prefetch`等手段。
- **资源优化** 包括构建产物分析、资源压缩、产物拆包、按需加载等优化方式。
- **预渲染优化** 本文主要介绍服务端渲染(SSR)和静态站点生成(SSG)两种手段。

### 网络优化

#### HTTP2

传统的 `HTTP 1.1` 存在队头阻塞的问题，同一个 `TCP` 管道中同一时刻只能处理一个 `HTTP` 请求，也就是说如果当前请求没有处理完，其它的请求都处于阻塞状态，另外浏览器对于同一域名下的并发请求数量都有限制，比如 `Chrome` 中只允许 `6` 个请求并发（这个数量不允许用户配置），也就是说请求数量超过 `6` 个时，多出来的请求只能排队、等待发送。

因此，在 `HTTP 1.1` 协议中，队头阻塞和请求排队问题很容易成为网络层的性能瓶颈。而 `HTTP 2` 的诞生就是为了解决这些问题，它主要实现了如下的能力：

多路复用。将数据分为多个二进制帧，多个请求和响应的数据帧在同一个 `TCP` 通道进行传输，解决了之前的队头阻塞问题。而与此同时，在 `HTTP2` 协议下，浏览器不再有同域名的并发请求数量限制，因此请求排队问题也得到了解决。
`Server Push`，即服务端推送能力。可以让某些资源能够提前到达浏览器，比如对于一个 `html` 的请求，通过 `HTTP 2` 我们可以同时将相应的 `js` 和 `css` 资源推送到浏览器，省去了后续请求的开销。

在 `Vite` 中，我们可以通过 `vite-plugin-mkcert` 在本地 `Dev Server` 上开启 `HTTP2`:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    // https 选项需要开启
    https: true,
  },
});
```

插件的原理也比较简单，由于 HTTP2 依赖 TLS 握手，插件会帮你自动生成 TLS 证书，然后支持通过 HTTPS 的方式启动，而 Vite 会自动把 HTTPS 服务升级为 HTTP2。

#### DNS 预解析

浏览器在向跨域的服务器发送请求时，首先会进行 `DNS` 解析，将服务器域名解析为对应的 IP 地址。我们通过 `dns-prefetch` 技术将这一过程提前，降低 `DNS` 解析的延迟时间，具体使用方式如下:

```html
<!-- href 为需要预解析的域名 -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com/">
```

一般情况下 dns-prefetch 会与 preconnect 搭配使用，前者用来解析 DNS，而后者用来会建立与服务器的连接，建立 TCP 通道及进行 TLS 握手，进一步降低请求延迟。使用方式如下所示:

```html
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
<link rel="dns-prefetch" href="https://fonts.gstatic.com/">
```

#### Preload/Prefetch

##### Preload

对于一些比较重要的资源，我们可以通过 Preload 方式进行预加载，即在资源使用之前就进行加载，而不是在用到的时候才进行加载，这样可以使资源更早地到达浏览器。其中我们一般会声明 href 和 as 属性，分别表示资源地址和资源类型。

```html
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
```

与普通 script 标签不同的是，对于原生 ESM 模块，浏览器提供了modulepreload来进行预加载:

```html
<link rel="modulepreload" href="/src/app.js" />
```

仅有 70% 左右的浏览器支持这个特性，不过在 Vite 中我们可以通过配置一键开启 modulepreload 的 Polyfill，从而在使所有支持原生 ESM 的浏览器(占比 90% 以上)都能使用该特性，配置方式如下:

```ts
// vite.config.ts
export default {
  build: {
    polyfillModulePreload: true
  }
}
```

##### Prefetch

Prefetch 作用是在浏览器空闲的时候去预加载其它页面的资源，比如对于 A 页面中插入了这样的 link 标签:

```html
<link rel="prefetch" href="https://B.com/index.js" as="script">
```

这样浏览器会在 A 页面加载完毕之后去加载B这个域名下的资源，如果用户跳转到了B页面中，浏览器会直接使用预加载好的资源，从而提升 B 页面的加载速度。

### 资源优化

#### 产物分析报告

使用 rollup-plugin-visualizer 插件可视化地感知到产物的体积情况

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: true,
    }),
  ],
});
```

#### 资源压缩

在生产环境中，为了极致的代码体积，我们一般会通过构建工具来对产物进行压缩。具体来说，有这样几类资源可以被压缩处理: JavaScript 代码、CSS 代码和图片文件。

##### JavaScript 压缩

在 Vite 生产环境构建的过程中，JavaScript 产物代码会自动进行压缩，相关的配置参数如下:

```ts
// vite.config.ts
export default {
  build: {
    // 类型: boolean | 'esbuild' | 'terser'
    // 默认为 `esbuild`
    minify: 'esbuild',
    // 产物目标环境
    target: 'modules',
    // 如果 minify 为 terser，可以通过下面的参数配置具体行为
    // https://terser.org/docs/api-reference#minify-options
    terserOptions: {}
  }
}
```

值得注意的是target参数，也就是压缩产物的目标环境。Vite 默认的参数是modules，即如下的 browserlist:

```text
['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1']
```

其实，对于 JS 代码压缩的理解仅仅停留在去除空行、混淆变量名的层面是不够的，为了达到极致的压缩效果，压缩器一般会根据浏览器的目标，会对代码进行语法层面的转换，比如下面这个例子:

```ts
// 业务代码中
info == null ? undefined : info.name
```

如果你将 target 配置为esnext，也就是最新的 JS 语法，会发现压缩后的代码变成了下面这样:

```ts
info?.name
```

这就是压缩工具在背后所做的事情，将某些语句识别之后转换成更高级的语法，从而达到更优的代码体积。

因此，设置合适的 target 就显得特别重要了，一旦目标环境的设置不能覆盖所有的用户群体，那么极有可能在某些低端浏览器中出现语法不兼容问题，从而发生线上事故。

##### CSS 压缩

```ts
// vite.config.ts
export default {
  build: {
    // 设置 CSS 的目标环境
    cssTarget: ''
  }
}
```

一般不需要配置，会自动压缩，在需要兼容安卓端微信的 webview 时，我们需要将 build.cssTarget 设置为 chrome61，以防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式，出现样式问题。

##### 图片压缩

图片资源是一般是产物体积的大头，如果能有效地压缩图片体积，那么对项目体积来说会得到不小的优化。而在 Vite 中我们一般使用 `vite-plugin-imagemin` 来进行图片压缩

##### 产物拆包

一般来说，如果不对产物进行代码分割(或者拆包)，全部打包到一个 chunk 中，会产生如下的问题:

首屏加载的代码体积过大，即使是当前页面不需要的代码也会进行加载。
线上缓存复用率极低，改动一行代码即可导致整个 bundle 产物缓存失效。
而 Vite 中内置如下的代码拆包能力:

CSS 代码分割，即实现一个 chunk 对应一个 css 文件。
默认有一套拆包策略，将应用的代码和第三方库的代码分别打包成两份产物，并对于动态 import 的模块单独打包成一个 chunk。

当然，我们也可以通过manualChunks参数进行自定义配置：

```ts
// vite.config.ts
{
  build {
    rollupOptions: {
      output: {
        // 1. 对象配置
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          'react-vendor': ['react', 'react-dom'],
          // 将 Lodash 库的代码单独打包
          'lodash': ['lodash-es'],
          // 将组件库的代码打包
          'library': ['antd'],
        },
        // 2. 函数配置
          if (id.includes('antd') || id.includes('@arco-design/web-react')) {
            return 'library';
          }
          if (id.includes('lodash')) {
            return 'lodash';
          }
          if (id.includes('react')) {
            return 'react';
          }
      },
    }
  },
}
```

##### 按需加载

在一个完整的 Web 应用中，对于某些模块当前页面可能并不需要，如果浏览器在加载当前页面的同时也需要加载这些不必要的模块，那么可能会带来严重的性能问题。一个比较好的方式是对路由组件进行动态引入，

#### 预渲染优化

预渲染是当今比较主流的优化手段，主要包括服务端渲染(SSR)和静态站点生成(SSG)这两种技术。

在 SSR 的场景下，服务端生成好完整的 HTML 内容，直接返回给浏览器，浏览器能够根据 HTML 渲染出完整的首屏内容，而不需要依赖 JS 的加载，从而降低浏览器的渲染压力；而另一方面，由于服务端的网络环境更优，可以更快地获取到页面所需的数据，也能节省浏览器请求数据的时间。

而 SSG 可以在构建阶段生成完整的 HTML 内容，它与 SSR 最大的不同在于 HTML 的生成在构建阶段完成，而不是在服务器的运行时。SSG 同样可以给浏览器完整的 HTML 内容，不依赖于 JS 的加载，可以有效提高页面加载性能。不过相比 SSR，SSG 的内容往往动态性不够，适合比较静态的站点，比如文档、博客等场景。
