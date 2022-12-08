import{_ as e,c as a,o as d,d as r}from"./app.043f1600.js";const f=JSON.parse('{"title":"Vue.js \u6280\u672F\u5185\u5E55","description":"","frontmatter":{},"headers":[{"level":2,"title":"Vue.js\u7684\u6574\u4F53\u8BBE\u8BA1","slug":"vue-js\u7684\u6574\u4F53\u8BBE\u8BA1","link":"#vue-js\u7684\u6574\u4F53\u8BBE\u8BA1","children":[{"level":3,"title":"Vue3 \u7684\u4F18\u5316","slug":"vue3-\u7684\u4F18\u5316","link":"#vue3-\u7684\u4F18\u5316","children":[]}]}],"relativePath":"framework-and-lib/frameworks/vue/technology-insider.md","lastUpdated":1669819636000}'),o={name:"framework-and-lib/frameworks/vue/technology-insider.md"},c=r('<h1 id="vue-js-\u6280\u672F\u5185\u5E55" tabindex="-1">Vue.js \u6280\u672F\u5185\u5E55 <a class="header-anchor" href="#vue-js-\u6280\u672F\u5185\u5E55" aria-hidden="true">#</a></h1><h2 id="vue-js\u7684\u6574\u4F53\u8BBE\u8BA1" tabindex="-1">Vue.js\u7684\u6574\u4F53\u8BBE\u8BA1 <a class="header-anchor" href="#vue-js\u7684\u6574\u4F53\u8BBE\u8BA1" aria-hidden="true">#</a></h2><h3 id="vue3-\u7684\u4F18\u5316" tabindex="-1">Vue3 \u7684\u4F18\u5316 <a class="header-anchor" href="#vue3-\u7684\u4F18\u5316" aria-hidden="true">#</a></h3><h4 id="\u6E90\u7801\u4F18\u5316" tabindex="-1">\u6E90\u7801\u4F18\u5316 <a class="header-anchor" href="#\u6E90\u7801\u4F18\u5316" aria-hidden="true">#</a></h4><h5 id="monorepo" tabindex="-1">monorepo <a class="header-anchor" href="#monorepo" aria-hidden="true">#</a></h5><p><code>Vue3</code> \u4F7F\u7528 <code>monorepo</code> \u7684\u65B9\u5F0F\u8FDB\u884C\u7EF4\u62A4\uFF0C\u5E76\u6839\u636E\u529F\u80FD\u5C06\u4E0D\u540C\u7684\u6A21\u5757\u62C6\u5206\u5230 <code>packages</code> \u76EE\u5F55\u4E0B\u7684\u4E0D\u540C\u5B50\u76EE\u5F55\u4E0B\u3002</p><p>\u6A21\u5757\u62C6\u5206\u7684\u9897\u7C92\u5EA6\u66F4\u7EC6\uFF0C\u804C\u8D23\u5212\u5206\u66F4\u660E\u786E\uFF0C\u6A21\u5757\u4E4B\u95F4\u7684\u4F9D\u8D56\u5173\u7CFB\u4E5F\u66F4\u52A0\u660E\u663E\uFF0C\u4F7F\u5F00\u53D1\u4EBA\u5458\u66F4\u5BB9\u6613\u9605\u8BFB\u3001\u674E\u6770\u548C\u66F4\u6539\u6240\u6709\u6A21\u5757\u7684\u6E90\u7801\uFF0C\u63D0\u9AD8\u4E86\u4EE3\u7801\u7684\u53EF\u7EF4\u62A4\u6027\u3002</p><h5 id="typescript" tabindex="-1">TypeScript <a class="header-anchor" href="#typescript" aria-hidden="true">#</a></h5><p><code>TypeScript</code> \u63D0\u4F9B\u4E86\u66F4\u597D\u7684\u7C7B\u578B\u68C0\u67E5\uFF0C\u80FD\u652F\u6301\u590D\u6742\u7684\u7C7B\u578B\u63A8\u5BFC\u3002</p><h4 id="\u6027\u80FD\u4F18\u5316" tabindex="-1">\u6027\u80FD\u4F18\u5316 <a class="header-anchor" href="#\u6027\u80FD\u4F18\u5316" aria-hidden="true">#</a></h4><h5 id="\u6E90\u7801\u4F53\u79EF\u4F18\u5316" tabindex="-1">\u6E90\u7801\u4F53\u79EF\u4F18\u5316 <a class="header-anchor" href="#\u6E90\u7801\u4F53\u79EF\u4F18\u5316" aria-hidden="true">#</a></h5><ul><li>\u79FB\u9664\u51B7\u95E8\u529F\u80FD</li><li>\u5F15\u5165 <code>tree-shaking</code> \u6280\u672F\uFF0C\u51CF\u5C0F\u6253\u5305\u4F53\u79EF\u3002</li></ul><h5 id="\u6570\u636E\u52AB\u6301\u4F18\u5316" tabindex="-1">\u6570\u636E\u52AB\u6301\u4F18\u5316 <a class="header-anchor" href="#\u6570\u636E\u52AB\u6301\u4F18\u5316" aria-hidden="true">#</a></h5><p><code>Vue2</code> \u5B58\u5728\u7684\u95EE\u9898\uFF1A</p><ul><li>\u4F7F\u7528 <code>Object.defineProperty</code> \u52AB\u6301\u6570\u636E\u7684 <code>getter</code> \u548C <code>setter</code>\uFF0C\u4E0D\u80FD\u68C0\u6D4B\u5BF9\u8C61\u5C5E\u6027\u65B0\u589E\u548C\u5220\u9664\u3002\u4F46\u63D0\u4F9B\u4E86 <code>$set</code> \u548C <code>$delete</code> \uFF0C\u4F1A\u589E\u52A0\u7528\u6237\u7684\u5FC3\u667A\u8D1F\u62C5\u3002</li><li>\u5D4C\u5957\u5C42\u7EA7\u8F83\u6DF1\u7684\u5BF9\u8C61\uFF0C\u9700\u8981\u8FDB\u884C\u9012\u5F52\u904D\u5386\uFF0C\u4F1A\u4EA7\u751F\u76F8\u5F53\u5927\u7684\u6027\u80FD\u8D1F\u62C5\u3002</li></ul><p><code>Vue3</code> \u4F7F\u7528 <code>Proxy</code> \u80FD\u68C0\u6D4B\u5230\u5BF9\u8C61\u5C5E\u6027\u7684\u589E\u52A0\u548C\u5220\u9664\uFF0C\u867D\u7136\u65E0\u6CD5\u4FA6\u542C\u5230\u6DF1\u5C42\u6B21\uFF0C\u4F46\u662F <code>Vue3</code> \u662F\u5728 <code>Proxy</code> \u5BF9\u8C61\u5904\u7406\u5668\u5BF9\u8C61\u7684 <code>getter</code> \u4E2D\u9012\u5F52\u54CD\u5E94\u3002\u53EA\u6709\u771F\u6B63\u8BBF\u95EE\u5230\u7684\u5185\u90E8\u5BF9\u8C61\u624D\u4F1A\u53D8\u6210\u54CD\u5E94\u5F0F\u7684\uFF0C\u800C\u4E0D\u662F\u201C\u65E0\u8111\u201D\u9012\u5F52</p><h4 id="\u7F16\u8BD1\u4F18\u5316" tabindex="-1">\u7F16\u8BD1\u4F18\u5316 <a class="header-anchor" href="#\u7F16\u8BD1\u4F18\u5316" aria-hidden="true">#</a></h4><p><code>Vue3</code> \u901A\u8FC7\u7F16\u8BD1\u9636\u6BB5\u5BF9\u9759\u6001\u672B\u73ED\u7684\u5206\u6790\uFF0C\u7F16\u8BD1\u751F\u6210\u4E86 <code>Block Tree</code>\u3002<code>Block Tree</code> \u662F\u5C06\u6A21\u7248\u57FA\u4E8E\u52A8\u6001\u8282\u70B9\u6307\u4EE4\u5207\u5272\u7684\u5D4C\u5957\u533A\u5757\uFF0C\u6BCF\u4E2A\u533A\u5757\u7684\u5185\u90E8\u7ED3\u6784\u90FD\u662F\u56FA\u5B9A\u7684\uFF0C\u800C\u4E14\u6BCF\u4E2A\u533A\u5757\u53EA\u9700\u8981\u4EE5\u4E00\u4E2AArray\u6765\u8FFD\u8E2A\u81EA\u8EAB\u5305\u542B\u7684\u52A8\u6001\u8282\u70B9\u3002</p><p>\u501F\u52A9 Block Tree ,Vue3 \u5C06 vnode \u7684\u66F4\u65B0\u6027\u80FD\u7531\u4E0E\u6A21\u7248\u6574\u4F53\u5927\u5C0F\u76F8\u5173\u63D0\u5347\u4E3A\u4E0E\u52A8\u6001\u5185\u5BB9\u7684\u6570\u636E\u91CF\u76F8\u5173</p><h4 id="\u8BED\u6CD5-api-\u4F18\u5316" tabindex="-1">\u8BED\u6CD5 API \u4F18\u5316 <a class="header-anchor" href="#\u8BED\u6CD5-api-\u4F18\u5316" aria-hidden="true">#</a></h4><p>Composition API</p>',21),i=[c];function t(h,n,s,l,u,p){return d(),a("div",null,i)}const m=e(o,[["render",t]]);export{f as __pageData,m as default};