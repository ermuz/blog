import{_ as a,c as l,o as p,d as e}from"./app.0a37167d.js";const o="/blog/engineering/construct/babel/babel-transplie.webp",r="/blog/engineering/construct/babel/babel-parse.webp",t="/blog/engineering/construct/babel/babel-transform.webp",c="/blog/engineering/construct/babel/babel-generate.webp",y="/blog/engineering/construct/babel/babel-ast-class.webp",D="/blog/engineering/construct/babel/babel-traverse-visit.webp",s="/blog/engineering/construct/babel/babel-traverse-visit-path.webp",i="/blog/engineering/construct/babel/babel-traverse-visit-state.webp",F="/blog/engineering/construct/babel/babel-code-frame.webp",C="/blog/engineering/construct/babel/babel-demo-console.png",A="/blog/engineering/construct/babel/babel-traverse-visitor-1.webp",b="/blog/engineering/construct/babel/babel-traverse-visitor-2.webp",u="/blog/engineering/construct/babel/babel-traverse-container-listkey-key-1.webp",d="/blog/engineering/construct/babel/babel-traverse-container-listkey-key-2.webp",m="/blog/engineering/construct/babel/babel-generate-while.webp",h="/blog/engineering/construct/babel/babel-generate-conditionalExpression.webp",g="/blog/engineering/construct/babel/babel-sourcemap.webp",f="/blog/engineering/construct/babel/babel-code-frame-1.webp",n="/blog/engineering/construct/babel/babel-code-frame-2.webp",v="/blog/engineering/construct/babel/babel-code-frame-3.webp",E="/blog/engineering/construct/babel/babel-code-frame-4.webp",x="/blog/engineering/construct/babel/babel-hightlight-1.webp",k="/blog/engineering/construct/babel/babel-hightlight-2.webp",S="/blog/engineering/construct/babel/babel-hightlight-3.webp",j="/blog/engineering/construct/babel/babel-termial-highlight.png",w="/blog/engineering/construct/babel/babel-preset-1.webp",B="/blog/engineering/construct/babel/babel-preset-2.webp",q="/blog/engineering/construct/babel/babel-inside-ablility.webp",T="/blog/engineering/construct/babel/babel-inside-syntax.webp",_="/blog/engineering/construct/babel/babel-inside-syntax-rft.webp",I="/blog/engineering/construct/babel/babel-inside-helper-global-1.webp",P="/blog/engineering/construct/babel/babel-inside-helper-global-2.webp",U=JSON.parse('{"title":"Babel","description":"","frontmatter":{},"headers":[{"level":2,"title":"初识Babel","slug":"初识babel","link":"#初识babel","children":[{"level":3,"title":"babel 的用途","slug":"babel-的用途","link":"#babel-的用途","children":[]}]},{"level":2,"title":"Babel 的编译流程","slug":"babel-的编译流程","link":"#babel-的编译流程","children":[{"level":3,"title":"编译器和转译器","slug":"编译器和转译器","link":"#编译器和转译器","children":[]},{"level":3,"title":"babel 的转义流程","slug":"babel-的转义流程","link":"#babel-的转义流程","children":[]}]},{"level":2,"title":"Babel 的 AST","slug":"babel-的-ast","link":"#babel-的-ast","children":[{"level":3,"title":"常见的 AST 节点","slug":"常见的-ast-节点","link":"#常见的-ast-节点","children":[]},{"level":3,"title":"AST 可视化查看工具","slug":"ast-可视化查看工具","link":"#ast-可视化查看工具","children":[]},{"level":3,"title":"AST 的公共属性","slug":"ast-的公共属性","link":"#ast-的公共属性","children":[]}]},{"level":2,"title":"Babel 的 API","slug":"babel-的-api","link":"#babel-的-api","children":[{"level":3,"title":"babel 的 api 有哪些","slug":"babel-的-api-有哪些","link":"#babel-的-api-有哪些","children":[]},{"level":3,"title":"@babel/parser","slug":"babel-parser","link":"#babel-parser","children":[]},{"level":3,"title":"@babel/traverse","slug":"babel-traverse","link":"#babel-traverse","children":[]},{"level":3,"title":"@babel/types","slug":"babel-types","link":"#babel-types","children":[]},{"level":3,"title":"@babel/template","slug":"babel-template","link":"#babel-template","children":[]},{"level":3,"title":"@babel/generator","slug":"babel-generator","link":"#babel-generator","children":[]},{"level":3,"title":"@babel/code-frame","slug":"babel-code-frame","link":"#babel-code-frame","children":[]},{"level":3,"title":"@babel/core","slug":"babel-core","link":"#babel-core","children":[]}]},{"level":2,"title":"实战案例：插入函数调用参数","slug":"实战案例-插入函数调用参数","link":"#实战案例-插入函数调用参数","children":[{"level":3,"title":"需求描述","slug":"需求描述","link":"#需求描述","children":[]},{"level":3,"title":"需求变更","slug":"需求变更","link":"#需求变更","children":[]},{"level":3,"title":"插件化","slug":"插件化","link":"#插件化","children":[]}]},{"level":2,"title":"traverse 的 path、scope、visitor","slug":"traverse-的-path、scope、visitor","link":"#traverse-的-path、scope、visitor","children":[{"level":3,"title":"visitor 模式","slug":"visitor-模式","link":"#visitor-模式","children":[]},{"level":3,"title":"path 和 scope","slug":"path-和-scope","link":"#path-和-scope","children":[]},{"level":3,"title":"state","slug":"state-1","link":"#state-1","children":[]},{"level":3,"title":"AST 的别名","slug":"ast-的别名","link":"#ast-的别名","children":[]}]},{"level":2,"title":"Generaotr 和 SourceMap 的奥秘","slug":"generaotr-和-sourcemap-的奥秘","link":"#generaotr-和-sourcemap-的奥秘","children":[{"level":3,"title":"generate","slug":"generate-1","link":"#generate-1","children":[]},{"level":3,"title":"sourcemap","slug":"sourcemap","link":"#sourcemap","children":[]},{"level":3,"title":"soruce-map","slug":"soruce-map","link":"#soruce-map","children":[]}]},{"level":2,"title":"Code-Frame 和代码高亮原理","slug":"code-frame-和代码高亮原理","link":"#code-frame-和代码高亮原理","children":[{"level":3,"title":"如何打印 code frame","slug":"如何打印-code-frame","link":"#如何打印-code-frame","children":[]},{"level":3,"title":"如何实现语法高亮","slug":"如何实现语法高亮","link":"#如何实现语法高亮","children":[]},{"level":3,"title":"如何在控制台打印颜色","slug":"如何在控制台打印颜色","link":"#如何在控制台打印颜色","children":[]}]},{"level":2,"title":"Babel 插件和 preset","slug":"babel-插件和-preset","link":"#babel-插件和-preset","children":[{"level":3,"title":"plugin 的使用","slug":"plugin-的使用","link":"#plugin-的使用","children":[]},{"level":3,"title":"preset","slug":"preset","link":"#preset","children":[]},{"level":3,"title":"ConfigItem","slug":"configitem","link":"#configitem","children":[]},{"level":3,"title":"顺序","slug":"顺序","link":"#顺序","children":[]},{"level":3,"title":"名字","slug":"名字","link":"#名字","children":[]}]},{"level":2,"title":"Babel 插件的单元测试","slug":"babel-插件的单元测试","link":"#babel-插件的单元测试","children":[{"level":3,"title":"babel 插件单元测试的方式","slug":"babel-插件单元测试的方式","link":"#babel-插件单元测试的方式","children":[]},{"level":3,"title":"babel-plugin-tester","slug":"babel-plugin-tester","link":"#babel-plugin-tester","children":[]}]},{"level":2,"title":"Babel 的内置功能一","slug":"babel-的内置功能一","link":"#babel-的内置功能一","children":[{"level":3,"title":"插件 --> preset","slug":"插件-preset","link":"#插件-preset","children":[]}]},{"level":2,"title":"Babel 的内置功能二","slug":"babel-的内置功能二","link":"#babel-的内置功能二","children":[{"level":3,"title":"preset-es20xx 到 preset-env","slug":"preset-es20xx-到-preset-env","link":"#preset-es20xx-到-preset-env","children":[]},{"level":3,"title":"helper --> runtime","slug":"helper-runtime","link":"#helper-runtime","children":[]}]},{"level":2,"title":"实战案例：自动埋点","slug":"实战案例-自动埋点","link":"#实战案例-自动埋点","children":[{"level":3,"title":"思路分析","slug":"思路分析-1","link":"#思路分析-1","children":[]},{"level":3,"title":"代码实现","slug":"代码实现-1","link":"#代码实现-1","children":[]}]}],"relativePath":"engineering/construct/babel.md","lastUpdated":1670863460000}'),M={name:"engineering/construct/babel.md"},N=e("",636),L=[N];function O(X,W,V,$,G,R){return p(),l("div",null,L)}const J=a(M,[["render",O]]);export{U as __pageData,J as default};
