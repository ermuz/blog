# Vue.js 技术内幕

## Vue.js的整体设计

### Vue3 的优化

#### 源码优化

##### monorepo

`Vue3` 使用 `monorepo` 的方式进行维护，并根据功能将不同的模块拆分到 `packages` 目录下的不同子目录下。

模块拆分的颗粒度更细，职责划分更明确，模块之间的依赖关系也更加明显，使开发人员更容易阅读、李杰和更改所有模块的源码，提高了代码的可维护性。

##### TypeScript

`TypeScript` 提供了更好的类型检查，能支持复杂的类型推导。

#### 性能优化

##### 源码体积优化

- 移除冷门功能
- 引入 `tree-shaking` 技术，减小打包体积。

##### 数据劫持优化

`Vue2` 存在的问题：

- 使用 `Object.defineProperty` 劫持数据的 `getter` 和 `setter`，不能检测对象属性新增和删除。但提供了 `$set` 和 `$delete` ，会增加用户的心智负担。
- 嵌套层级较深的对象，需要进行递归遍历，会产生相当大的性能负担。

`Vue3` 使用 `Proxy` 能检测到对象属性的增加和删除，虽然无法侦听到深层次，但是 `Vue3` 是在 `Proxy` 对象处理器对象的 `getter` 中递归响应。只有真正访问到的内部对象才会变成响应式的，而不是“无脑”递归

#### 编译优化

`Vue3` 通过编译阶段对静态模版的分析，编译生成了 `Block Tree`。`Block Tree` 是将模版基于动态节点指令切割的嵌套区块，每个区块的内部结构都是固定的，而且每个区块只需要以一个Array来追踪自身包含的动态节点。

借助 `Block Tree` ,`Vue3` 将 `vnode` 的更新性能由与模版整体大小相关提升为与动态内容的数据量相关

#### 语法 API 优化

Composition API

### Vue3 源码总览

#### 源码目录结构

```md
.
├── packages
│   ├── compiler-core
│   ├── compiler-dom
│   ├── compiler-sfc
│   ├── compiler-ssr
│   ├── reactivity
│   ├── reactivity-transform
│   ├── runtime-core
│   ├── runtime-dom
│   ├── runtime-test
│   ├── server-renderer
│   ├── sfc-playground
│   ├── shared
│   ├── size-check
│   ├── template-explorer
│   ├── vue
│   └── vue-compat
```

- compiler core
- compiler dom
-

## 组件

### 组件的渲染

#### 什么是 `vnode`
