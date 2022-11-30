# Babel

## 初识Babel

### babel 的用途

#### 转译 esnext、typescript、flow 等到目标环境支持的 js

这个是最常用的功能，用来把代码中的 esnext 的新的语法、typescript 和 flow 的语法转成基于目标环境支持的语法的实现。并且还可以把目标环境不支持的 api 进行 polyfill。

babel7 支持了 preset-env，可以指定 targets 来进行按需转换，转换更加的精准，产物更小。

#### 一些特定用途的代码转换

babel 是一个转译器，暴露了很多 api，用这些 api 可以完成代码到 AST 的解析、转换、以及目标代码的生成。

开发者可以用它来来完成一些特定用途的转换，比如函数插桩（函数中自动插入一些代码，例如埋点代码）、自动国际化等。这些都是后面的实战案例。

现在比较流行的小程序转译工具 taro，就是基于 babel 的 api 来实现的。

#### 代码的静态分析

对代码进行 parse 之后，能够进行转换，是因为通过 AST 的结构能够理解代码。理解了代码之后，除了进行转换然后生成目标代码之外，也同样可以用于分析代码的信息，进行一些检查。

- linter 工具就是分析 AST 的结构，对代码规范进行检查。

- api 文档自动生成工具，可以提取源码中的注释，然后生成文档。

- type checker 会根据从 AST 中提取的或者推导的类型信息，对 AST 进行类型是否一致的检查，从而减少运行时因类型导致的错误。

- 压缩混淆工具，这个也是分析代码结构，进行删除死代码、变量名混淆、常量折叠等各种编译优化，生成体积更小、性能更优的代码。

- js 解释器，除了对 AST 进行各种信息的提取和检查以外，我们还可以直接解释执行 AST。

## Babel 的编译流程

### 编译器和转译器

编译的定义就是从一种编程语言转成另一种编程语言。主要指的是高级语言到低级语言。

> 高级语言：有很多用于描述逻辑的语言特性，比如分支、循环、函数、面向对象等，接近人的思维，可以让开发者快速的通过它来表达各种逻辑。比如 c++、javascript。

> 低级语言：与硬件和执行细节有关，会操作寄存器、内存，具体做内存与寄存器之间的复制，需要开发者理解熟悉计算机的工作原理，熟悉具体的执行细节。比如汇编语言、机器语言。

一般编译器 Compiler 是指高级语言到低级语言的转换工具，对于高级语言到高级语言的转换工具，被叫做转换编译器，简称转译器 (Transpiler)。

babel 就是一个 Javascript Transpiler。

### babel 的转义流程

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

![babel的编译流程](/engineering/construct/babel/babel-transplie.webp)

#### 为什么会分为这三步

为了让计算机理解代码需要先对源码字符串进行 parse，生成 AST，把对代码的修改转为对 AST 的增删改，转换完 AST 之后再打印成目标代码字符串。

#### 这三步都做了什么

##### parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

比如 let name = 'guang'; 这样一段源码，我们要先把它分成一个个不能细分的单词（token），也就是 let, name, =, 'guang'，这个过程是词法分析，按照单词的构成规则来拆分字符串成单词。

![babel-parse](/engineering/construct/babel/babel-parse.webp)

之后要把 token 进行递归的组装，生成 AST，这个过程是语法分析，按照不同的语法结构，来把一组单词组合成对象，比如声明语句、赋值表达式等都有对应的 AST 节点。

##### transform

transform 阶段是对 parse 生成的 AST 的处理，会进行 AST 的遍历，遍历的过程中处理到不同的 AST 节点会调用注册的相应的 visitor 函数，visitor 函数里可以对 AST 节点进行增删改，返回新的 AST（可以指定是否继续遍历新生成的 AST）。这样遍历完一遍 AST 之后就完成了对代码的修改。

![babel-transform](/engineering/construct/babel/babel-transform.webp)

##### generate

generate 阶段会把 AST 打印成目标代码字符串，并且会生成 sourcemap。不同的 AST 对应的不同结构的字符串。比如 IfStatement 就可以打印成 if(test) {} 格式的代码。这样从 AST 根节点进行递归的字符串拼接，就可以生成目标代码的字符串。

![babel-generate](/engineering/construct/babel/babel-generate.webp)

sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置，用于调试的时候把编译后的代码映射回源码，或者线上报错的时候把报错位置映射到源码

## Babel 的 AST

### 常见的 AST 节点

AST 是对源码的抽象，字面量、标识符、表达式、语句、模块语法、class 语法都有各自的 AST。

#### Literal 字面量

比如 `let name = 'guang'`中，`'guang'`就是一个字符串字面量 `StringLiteral`，相应的还有数字字面量 `NumericLiteral`，布尔字面量 `BooleanLiteral`，字符串字面量 `StringLiteral`，正则表达式字面量 `RegExpLiteral` 等。

```js
'gang'      // StringLiteral
`gang`      // TemplateLiteral
123         // NumericLiteral
/^[a-z]+/   // RegExpLiteral
true        // BooleanLiteral
1.23n       // BigintLiteral
null        // NullLiteral
```

#### Identifier 标识符

变量名、属性名、参数名等各种声明和引用的名字，都是Identifer。我们知道，JS 中的标识符只能包含字母或数字或下划线（“_”）或美元符号（“$”），且不能以数字开头。这是 Identifier 的词法特点。

下面这段代码中有多少 Identifier

```js
const name = 'guang';// name

function say(name) { // say、name
  console.log(name); // console、log
}

const obj = {       // obj
  name: 'guang'     // name
}
```

#### Statement 语句

可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的每一条可以独立执行的代码都是语句。

语句末尾一般会加一个分号分隔，或者用换行分隔。

下面这些我们经常写的代码，每一行都是一个 Statement：

```js
break;                              // BreakStatement
continue;                           // ContinueStatement
return;                             // ReturnStatement
debugger;                           // DebuggerStatement
throw Error();                      // ThrowStatement
{}                                  // BlockStatement
try {} catch(e) {} finally{}        // TryStatement
for (let key in obj) {}             // ForInStatement
for (let i = 0;i < 10;i ++) {}      // ForStatement
while (true) {}                     // WhileStatement
do {} while (true)                  // DoWhileStatement
switch (v){case 1: break;default:;} // SwitchStatement
label: console.log();               // LabelStatement
with (a){}                          // WithStatement
```

#### Declaration 声明

是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。

```js
const a = 1;            // VariableDeclaration
function b(){}          // FunctionDeclaration
class C {}              // ClassDeclaration

import d from 'e';      // ImportDeclaration

export default e = 1;   // ExportDefaultDeclaration
export {e};             // ExportNameDeclaration
export * from 'e';      // ExportAllDeclaration
```

#### Expression 表达式

特点是执行完以后有返回值，这是和语句 (statement) 的区别。

```js
[1,2,3]         // ArrayExpression
a = 1           // AssignmentExpression
1 + 2;          // BinaryExpression
-1;             // UnaryExpression
function(){};   // FunctionExpression
() => {};       // ArrowFunctionExpression
class{};        // ClassExpression
a;              // Identifier
this;           // ThisExpression
super;          // Super
a::b;           // BindExpress
```

#### Class

class 的语法也有专门的 AST 节点来表示。

整个 class 的内容是 ClassBody，属性是 ClassProperty，方法是ClassMethod（通过 kind 属性来区分是 constructor 还是 method）。

```js
class Guang extends Person{
    name = 'guang';
    constructor() {}
    eat() {}
}
```

![class](/engineering/construct/babel/babel-ast-class.webp)

#### Modules

es module 是语法级别的模块规范，所以也有专门的 AST 节点。

##### import

```js
import {c, d} from 'c'; // named import
import a from 'a'; // default import
import * as b from 'b'; // namespaced import
```

这 3 种语法都对应 ImportDeclaration 节点，但是 specifiers 属性不同，分别对应 ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier。

##### export

```js
export { b, d};     // named export
export default a;   // default export
export * from 'c';  // all export
```

分别对应 ExportNamedDeclaration、ExportDefaultDeclaration、ExportAllDeclaration 的 AST。

#### Program & Directive

program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放 Directive 节点，比如"use strict" 这种指令会使用 Directive 节点表示。

#### File & Comment

babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。

注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。

### AST 可视化查看工具

通过 <https://astexplorer.net> 查看

### AST 的公共属性

每种 AST 都有自己的属性，但是它们也有一些公共的属性：

- `type`： AST 节点的类型
- `start、end、loc`：start 和 end 代表该节点在源码中的开始和结束下标。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束的行列号。
- `leadingComments、innerComments、trailingComments`： 表示开始的注释、中间的注释、结尾的注释，每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，想拿到某个 AST 的注释就通过这三个属性。
- `extra`：记录一些额外的信息，用于处理一些特殊情况。比如 StringLiteral 的 value 只是值的修改，而修改 extra.raw 则可以连同单双引号一起修改。

## Babel 的 API

### babel 的 api 有哪些

我们知道 babel 的编译流程分为三步：parse、transform、generate，每一步都暴露了一些 api 出来。

- parse 阶段有@babel/parser，功能是把源码转成 AST
- transform 阶段有 @babel/traverse，可以遍历 AST，并调用 visitor 函数修改 AST，修改 AST 自然涉及到 AST 的判断、创建、修改等，这时候就需要 @babel/types 了，当需要批量创建 AST 的时候可以使用 @babel/template 来简化 AST 创建逻辑。
- generate 阶段会把 AST 打印为目标代码字符串，同时生成 sourcemap，需要 @babel/generator 包
- 中途遇到错误想打印代码位置的时候，使用 @babel/code-frame 包
- babel 的整体功能通过 @babel/core 提供，基于上面的包完成 babel 整体的编译流程，并应用 plugin 和 preset。

我们主要学习的就是 @babel/parser，@babel/traverse，@babel/generator，@babel/types，@babel/template 这五个包的 api 的使用。

### @babel/parser

babel parser 叫 babylon，是基于 acorn 实现的，扩展了很多语法，可以支持 es next（现在支持到 es2020）、jsx、flow、typescript 等语法的解析。默认只能 parse js 代码，jsx、flow、typescript 这些非标准的语法的解析需要指定语法插件。

它提供了有两个 api：parse 和 parseExpression。两者都是把源码转成 AST，不过 parse 返回的 AST 根节点是 File（整个 AST），parseExpression 返回的 AST 根节点是是 Expression（表达式的 AST），粒度不同。

```ts
function parse(input: string, options?: ParserOptions): File
function parseExpression(input: string, options?: ParserOptions): Expression
```

options 主要分为两类：

- parse 的内容是什么
- 以什么方式去 parse

详细的可以查看[文档](https://babeljs.io/docs/en/babel-parser)

#### parse 的内容是什么

- `plugins`： 指定jsx、typescript、flow 等插件来解析对应的语法
- `allowXxx`： 指定一些语法是否允许，比如函数外的 await、没声明的 export等
- `sourceType`： 指定是否支持解析模块语法，有 module、script、unambiguous 3个取值：
  - `module`：解析 es module 语法
  - `script`：不解析 es module 语法
  - `unambiguous`：根据内容是否有 import 和 export 来自动设置 module 还是 script

一般我们会指定 sourceType 为 unambiguous。

#### 以什么方式 parse

- `strictMode` 是否是严格模式
- `startLine` 从源码哪一行开始 parse
- `errorRecovery` 出错时是否记录错误并继续往下 parse
- `tokens` parse 的时候是否保留 token 信息
- `ranges` 是否在 ast 节点中添加 ranges 属性

### @babel/traverse

parse 出的 AST 由 @babel/traverse 来遍历和修改，babel traverse 包提供了 traverse 方法：

```ts
function traverse(parent, opts)
```

常用的就前面两个参数，parent 指定要遍历的 AST 节点，opts 指定 visitor 函数。babel 会在遍历 parent 对应的 AST 时调用相应的 visitor 函数。

#### 遍历过程

visitor 是指定对什么 AST 做什么处理的函数，babel 会在遍历到对应的 AST 时回调它们。

而且可以指定刚开始遍历（enter）和遍历结束后（exit）两个阶段的回调函数，

比如：

```js
traverse(ast, {
  FunctionDeclaration: {
      enter(path, state) {}, // 进入节点时调用
      exit(path, state) {} // 离开节点时调用
  }
})
```

如果只指定了一个函数，那就是 enter 阶段会调用的：

```js
traverse(ast, {
  FunctionDeclaration(path, state) {} // 进入节点时调用
})
```

enter 时调用是在遍历当前节点的子节点前调用，exit 时调用是遍历完当前节点的子节点后调用。

![babel-traverse-visit](/engineering/construct/babel/babel-traverse-visit.webp)

而且同一个 visitor 函数可以用于多个 AST 节点的处理，方式是指定一系列 AST，用 | 连接

```js
// 进入 FunctionDeclaration 和 VariableDeclaration 节点时调用
traverse(ast, {
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
})
```

此外，AST 还有别名的，比如各种 XxxStatement 有个 Statement 的别名，各种 XxxDeclaration 有个 Declaration 的别名，那自然可以通过别名来指定对这些 AST 的处理：

```js
// 通过别名指定离开各种 Declaration 节点时调用
traverse(ast, {
  Declaration: {
      exit(path, state) {}
  }
})
```

具体的别名有哪些在[babel-types 的类型定义](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2059)可以查。

每个 visitor 都有 path 和 state 的参数，这些是干啥的呢？

##### path

AST 是棵树，遍历过程中肯定是有个路径的，path 就记录了这个路径：

![babel-traverse-visit-path](/engineering/construct/babel/babel-traverse-visit-path.webp)

如图，节点 1、节点 2、节点 3 是三层 AST，通过两个 path 关联了起来，

path1 就关联了节点 1 和 节点 2，记录了节点 1 是父节点，节点 2 是子节点。

path2 关联了节点 2 和节点 3，记录了节点 2 是父节点，节点 3 是子节点。

而且 path1 和 path2 还有父子关系。

通过这样的 path 对象，就把遍历的路径串联起来。

而且，最重要的是 path 有很多属性和方法，比如记录父子、兄弟等关系的：

- path.node 指向当前 AST 节点
- path.parent 指向父级 AST 节点
- path.getSibling、path.getNextSibling、path.getPrevSibling 获取兄弟节点
- path.find 从当前节点向上查找节点
- path.get、path.set 获取 / 设置属性的 path

还有作用域相关的：

- path.scope 获取当前节点的作用域信息

判断 AST 类型的：

- path.isXxx 判断当前节点是不是 xx 类型
- path.assertXxx 判断当前节点是不是 xx 类型，不是则抛出异常

增删改 AST 的：

- path.insertBefore、path.insertAfter 插入节点
- path.replaceWith、path.replaceWithMultiple、replaceWithSourceString 替换节点
- path.remove 删除节点

跳过遍历的：

- path.skip 跳过当前节点的子节点的遍历
- path.stop 结束后续遍历

可以增删改 AST，可以按照路径查找任意的节点，还有作用域的信息，那怎么转换和分析代码不就呼之欲出了么。

##### state

第二个参数 state 则是遍历过程中在不同节点之间传递数据的机制，插件会通过 state 传递 options 和 file 信息，我们也可以通过 state 存储一些遍历过程中的共享数据。

![babel-traverse-visit-state](/engineering/construct/babel/babel-traverse-visit-state.webp)

### @babel/types

遍历 AST 的过程中需要创建一些 AST 和判断 AST 的类型，这时候就需要 `@babel/types` 包。

举例来说，如果要创建IfStatement就可以调用

```js
t.ifStatement(test, consequent, alternate);
```

而判断节点是否是 IfStatement 就可以调用 isIfStatement 或者 assertIfStatement

```js
t.isIfStatement(node, opts);
t.assertIfStatement(node, opts);
```

opts 可以指定一些属性是什么值，增加更多限制条件，做更精确的判断。

```js
t.isIdentifier(node, { name: "paths" })
```

isXxx 和 assertXxx 看起来很像，但是功能不大一样：isXxx 会返回 boolean，而 assertXxx 则会在类型不一致时抛异常。

### @babel/template

通过 @babel/types 创建 AST 还是比较麻烦的，要一个个的创建然后组装，如果 AST 节点比较多的话需要写很多代码，这时候就可以使用 @babel/template 包来批量创建。

这个包有这些 api：

```js
const ast = template(code, [opts])(args);
const ast = template.ast(code, [opts]);
const ast = template.program(code, [opts]);
```

这些都是传入一段字符串，返回创建好的 AST，区别只是返回的 AST 粒度不大一样：

template.ast 返回的是整个 AST。

template.program 返回的是 Program 根节点。

template.expression 返回创建的 expression 的 AST。

template.statements 返回创建的 statems 数组的 AST。

### @babel/generator

AST 转换完之后就要打印成目标代码字符串，通过 @babel/generator 包的 generate api

```js
function (ast: Object, opts: Object, code: string): {code, map}
```

第一个参数是要打印的 AST。

第二个参数是 options，指定打印的一些细节，比如通过 comments 指定是否包含注释，通过 minified 指定是否包含空白字符。

第三个参数当多个文件合并打印的时候需要用到，这部分直接看文档即可，基本用不到。

options 中常用的是 sourceMaps，开启了这个选项才会生成 sourcemap。

```js
import generate from "@babel/generator";

const { code, map } = generate(ast, { sourceMaps: true })
```

### @babel/code-frame

babel 的报错一半都会直接打印错误位置的代码，而且还能高亮，

我们打印错误信息的时候也可以用，就是 @babel/code-frame 这个包。

```js
const result = codeFrameColumns(rawLines, location, {
  /* options */
});
```

options 可以设置 highlighted （是否高亮）、message（展示啥错误信息）。

比如

```js
const { codeFrameColumns } = require("@babel/code-frame");

try {
 throw new Error("xxx 错误");
} catch (err) {
  console.error(codeFrameColumns(`const name = guang`, {
      start: { line: 1, column: 14 }
  }, {
    highlightCode: true,
    message: err.message
  }));
}
```

打印的错误就是这样的：
![babel-code-frame](/engineering/construct/babel/babel-code-frame.webp)

### @babel/core

前面讲了 @babel/parser、@babel/traverse、@babel/generaotr、@babel/types、@babel/template 等包，babel 的功能就是通过这些包来实现的。

babel 基于这些包来实现编译、插件、预设等功能的包就是 @babel/core。

这个包的功能就是完成整个编译流程，从源码到目标代码，生成 sourcemap。实现 plugin 和 preset 的调用。

api 也有好几个：

```js
transformSync(code, options); // => { code, map, ast }

transformFileSync(filename, options); // => { code, map, ast }

transformFromAstSync(
  parsedAst,
  sourceCode,
  options
); // => { code, map, ast }
```

比如这三个 transformXxx 的 api 分别是从源代码、源代码文件、源代码 AST 开始处理，最终生成目标代码和 sourcemap。

options 主要配置 plugins 和 presets，指定具体要做什么转换。

这些 api 也同样提供了异步的版本，异步地进行编译，返回一个 promise

```js
transformAsync("code();", options).then(result => {})
transformFileAsync("filename.js", options).then(result => {})
transformFromAstAsync(parsedAst, sourceCode, options).then(result => {})
```

:::warning
不带 sync、async 的 api 已经被标记过时了，也就是 transformXxx 这些，后续会删掉，不建议用，直接用 transformXxxSync 和 transformXxxAsync。也就是明确是同步还是异步。
:::

## 实战案例：插入函数调用参数

### 需求描述

我们经常会打印一些日志来辅助调试，但是有的时候会不知道日志是在哪个地方打印的。希望通过 babel 能够自动在 console.log 等 api 中插入文件名和行列号的参数，方便定位到代码。

也就是把这段代码：

```js
console.log(1);
```

转换为这样：

```js
console.log('文件名（行号，列号）：', 1);
```

#### 思路分析

![babel-demo-console](/engineering/construct/babel/babel-demo-console.png)

函数调用表达式的 AST 是 CallExpression。

那我们要做的是在遍历 AST 的时候对 console.log、console.info 等 api 自动插入一些参数，也就是要通过 visitor 指定对 CallExpression 的 AST 做一些修改。

CallExrpession 节点有两个属性，callee 和 arguments，分别对应调用的函数名和参数， 所以我们要判断当 callee 是 console.xx 时，在 arguments 的数组中中插入一个 AST 节点。

#### 代码实现

##### 初步实现

```js
import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import types from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;

const sourceCode = `console.log(1)`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous'
});

traverse(ast, {
    CallExpression(path) {
        if (types.isMemberExpression(path.node.callee)
            && path.node.callee.object.name === 'console'
            && ['log', 'warn', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
        ) {
            const { column, line } = path.node.loc.start;
            path.node.arguments.unshift(types.stringLiteral(`filename:(${line},${column})`));
        }
    }
});

const { code, map } = generate(ast,{ sourceMaps: true });

console.log(code, map);

// console.log("filename:(1,0)", 1); {
//   version: 3,
//   file: undefined,
//   names: [],
//   sourceRoot: undefined,
//   sources: [],
//   sourcesContent: [],
//   mappings: ''
// }
```

##### 优化

现在判断条件比较复杂，要先判断 path.node.callee 的类型，然后一层层取属性来判断，其实我们可以用 generator 模块来简化.

```js{15,19,21}
import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import types from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;

const sourceCode = `console.log(1)`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse(ast, {
    CallExpression(path, state) {
        const calleeName = generate(path.node.callee).code;

        if (targetCalleeName.includes(calleeName)) {
            const { line, column } = path.node.loc.start;
            path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
        }
    }
});
```

### 需求变更

在同一行打印会影响原本的参数的展示，所以想改为在 console.xx 节点之前打印的方式

比如之前是

```js
console.log(1);
```

转换为

```js
console.log('文件名（行号，列号）：', 1);
```

现在希望转换为：

```js
console.log('文件名（行号，列号）：');
console.log(1);
```

#### 需求变更-思路分析

这个需求的改动只是从插入一个参数变成了在当前 console.xx 的 AST 之前插入一个 console.log 的 AST，整体流程还是一样。

这里有两个注意的点：

- JSX 中的 console 代码不能简单的在前面插入一个节点，而要把整体替换成一个数组表达式，因为 JSX 中只支持写单个表达式。

	也就是

	```js
	<div>{console.log(111)}</div>
	```

	要替换成数组的形式

	```js
	<div>{[console.log('filename.js(11,22)'), console.log(111)]}</div>
	```

	因为 {} 里只能是表达式，这个 AST 叫做 JSXExpressionContainer，表达式容器。

- 用新的节点替换了旧的节点之后，插入的节点也是 console.log，也会进行处理，这是没必要的，所以要跳过新生成的节点的处理。

#### 需求变更-代码实现

```js
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import _template from '@babel/template';
import types from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;
const template = _template.default;

// const sourceCode = `console.log(1)`;
const sourceCode = `<div>{console.log(111)}</div>`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
    (item) => `console.${item}`,
);

traverse(ast, {
    CallExpression(path) {
        if (path.node._skip) return;
        const calleeName = generate(path.node.callee).code;
        if (targetCalleeName.includes(calleeName)) {
            const { line, column } = path.node.loc.start;
            const newNode = template.expression(
                `console.log("filename: (${line}, ${column})")`,
            )();
            newNode._skip = true;
            if (path.findParent((path) => path.isJSXElement())) {
                path.replaceWith(types.arrayExpression([newNode, path.node]));
                path.skip();
            } else {
                path.insertBefore(types.expressionStatement(newNode));
            }
        }
    },
});

const { code, map } = generate(ast, { sourceMaps: true });

console.log(code, map);
```

### 插件化

函数的第一个参数可以拿到 types、template 等常用包的 api，这样我们就不需要单独引入这些包了。

```js{1,9}
export default function ({ types, template }) {
    const targetCalleeName = ['log', 'info', 'error', 'debug'].map(
        (item) => `console.${item}`,
    );
    return {
        visitor: {
            CallExpression(path) {
                if (path.node._skip) return;
                const calleeName = path.get('callee').toString();
                if (targetCalleeName.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(
                        `console.log("filename: (${line}, ${column})")`,
                    )();
                    newNode._skip = true;
                    if (path.findParent((path) => path.isJSXElement())) {
                        path.replaceWith(
                            types.arrayExpression([newNode, path.node]),
                        );
                        path.skip();
                    } else {
                        path.insertBefore(types.expressionStatement(newNode));
                    }
                }
            },
        },
    };
}
```

## traverse 的 path、scope、visitor

### visitor 模式

visitor 模式的思想是：当被操作的对象结构比较稳定，而操作对象的逻辑经常变化的时候，通过分离逻辑和对象结构，使得他们能独立扩展。

![babel-traverse-visitor-1](/engineering/construct/babel/babel-traverse-visitor-1.webp)

如图，Element 和 Visitor 分别代表对象结构和操作逻辑，两者可以独立扩展，在 Client 里面来组合两者，使用 visitor 操作 element。这就是 visitor 模式。

对应到 babel traverse 的实现，就是 AST 和 visitor 分离，在 traverse（遍历）AST 的时候，调用注册的 visitor 来对其进行处理。

![babel-traverse-visitor-2](/engineering/construct/babel/babel-traverse-visitor-2.webp)

这样 AST 是独立的扩展的，visitor 是独立的扩展的，两者可以各自独立扩展单还能轻易地结合在一起。

### path 和 scope

path 是记录遍历路径的 api，它记录了父子节点的引用，还有很多增删改查 AST 的 api：

![babel-traverse-visit-path](/engineering/construct/babel/babel-traverse-visit-path.webp)

#### path

```js
path {
    // 属性：
    node                    // 当前 AST 节点
    parent                  // 父 AST 节点
    parentPath              // 父 AST 节点的 path
    scope                   // 作用域
    hub                     // 可以通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串
    container               // 当前 AST 节点所在的父节点属性的属性值
    key                     // 当前 AST 节点所在父节点属性的属性名或所在数组的下标
    listKey                 // 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined

    // 方法
    get(key)
    set(key, node)
    inList()
    getSibling(key)
    getNextSibling()
    getPrevSibling()
    getAllPrevSiblings()
    getAllNextSiblings()
    isXxx(opts)
    assertXxx(opts)
    find(callback)
    findParent(callback)

    insertBefore(nodes)
    insertAfter(nodes)
    replaceWith(replacement)
    replaceWithMultiple(nodes)
    replaceWithSourceString(replacement)
    remove()

    traverse(visitor, state)
    skip()
    stop()
}
```

含义：

- path.node 当前 AST 节点
- path.parent 父 AST 节点
- path.parentPath 父 AST 节点的 path
- path.scope 作用域
- path.hub 可以通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串
- path.container 当前 AST 节点所在的父节点属性的属性值
- path.key 当前 AST 节点所在父节点属性的属性名或所在数组的下标
- path.listkey 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined

##### container、listkey、key

因为 AST 节点要挂在父 AST 节点的某个属性上，那个属性的属性值就是这个 AST 节点的 container。

比如 CallExpression 有 callee 和 arguments 属性，那么对于 callee 的 AST 节点来说，callee 的属性值就是它的 container，而 callee 就是它的 key。

因为不是一个列表，所以 listkey 是 undefined。

![babel-traverse-container-listkey-key-1](/engineering/construct/babel/babel-traverse-container-listkey-key-1.webp)

而 BlockStatement 有 body 属性，是一个数组，对于数组中的每一个 AST 来说，这个数组就是它们的 container，而 listKey 是 body，key 则是下标。

![babel-traverse-container-listkey-key-2](/engineering/construct/babel/babel-traverse-container-listkey-key-2.webp)

#### path 的方法

path 有如下方法，同样也不需要记：

- get(key) 获取某个属性的 path
- set(key, node) 设置某个属性的值
- getSibling(key) 获取某个下标的兄弟节点
- getNextSibling() 获取下一个兄弟节点
- getPrevSibling() 获取上一个兄弟节点
- getAllPrevSiblings() 获取之前的所有兄弟节点
- getAllNextSiblings() 获取之后的所有兄弟节点
- find(callback) 从当前节点到根节点来查找节点（包括当前节点），调用 callback（传入 path）来决定是否终止查找
- findParent(callback) 从当前节点到根节点来查找节点（不包括当前节点），调用 callback（传入 path）来决定是否终止查找
- inList() 判断节点是否在数组中，如果 container 为数组，也就是有 listkey 的时候，返回 true
- isXxx(opts) 判断当前节点是否是某个类型，可以传入属性和属性值进一步判断，比如path.isIdentifier({name: 'a'})
- assertXxx(opts) 同 isXxx，但是不返回布尔值，而是抛出异常
- insertBefore(nodes) 在之前插入节点，可以是单个节点或者节点数组
- insertAfter(nodes) 在之后插入节点，可以是单个节点或者节点数组
- replaceWith(replacement) 用某个节点替换当前节点
- replaceWithMultiple(nodes) 用多个节点替换当前节点
- replaceWithSourceString(replacement) 解析源码成 AST，然后替换当前节点
- remove() 删除当前节点
- traverse(visitor, state) 遍历当前节点的子节点，传入 visitor 和 state（state 是不同节点间传递数据的方式）
- skip() 跳过当前节点的子节点的遍历
- stop() 结束所有遍历

#### 作用域 path.scope

scope 是作用域信息，javascript 中能生成作用域的就是模块、函数、块等，而且作用域之间会形成嵌套关系，也就是作用域链。babel 在遍历的过程中会生成作用域链保存在 path.scope 中。

```js
path.scope {
    bindings
    block
    parent
    parentBlock
    path
    references

    dump()
    parentBlock()
    getAllBindings()
    getBinding(name)
    hasBinding(name)
    getOwnBinding(name)
    parentHasBinding(name)
    removeBinding(name)
    moveBindingTo(name, scope)
    generateUid(name)
}
```

各自的含义：

- scope.bindings 当前作用域内声明的所有变量
- scope.block 生成作用域的 block，详见下文
- scope.path 生成作用域的节点对应的 path
- scope.references 所有 binding 的引用对应的 path，详见下文
- scope.dump() 打印作用域链的所有 binding 到控制台
- scope.parentBlock() 父级作用域的 block
- getAllBindings() 从当前作用域到根作用域的所有 binding 的合并
- getBinding(name) 查找某个 binding，从当前作用域一直查找到根作用域
- getOwnBinding(name) 从当前作用域查找 binding
- parentHasBinding(name, noGlobals) 查找某个 binding，从父作用域查到根作用域，不包括当前作用域。可以通过 noGlobals 参数指定是否算上全局变量（比如console，不需要声明就可用），默认是 false
- removeBinding(name) 删除某个 binding
- hasBinding(name, noGlobals) 从当前作用域查找 binding，可以指定是否算上全局变量，默认是 false
- moveBindingTo(name, scope) 把当前作用域中的某个 binding 移动到其他作用域
- generateUid(name) 生成作用域内唯一的名字，根据 name 添加下划线，比如 name 为 a，会尝试生成 _a，如果被占用就会生成 __a，直到生成没有被使用的名字。

##### scope.block

能形成 scope 的有这些节点，这些节点也叫 block 节点。

```ts
export type Scopable =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ClassExpression
  | ClassDeclaration
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | StaticBlock
  | TSModuleBlock;
```

我们可以通过 path.scope.block 来拿到所在的块对应的节点，通过 path.scope.parentBlock 拿到父作用域对应的块节点。

一般情况下我们不需要拿到生成作用域的块节点，只需要通过 path.scope 拿到作用域的信息，通过 path.scope.parent 拿到父作用域的信息。

##### scope.bindings、scope.references（重点）

作用域中保存的是声明的变量和对应的值，**每一个声明叫做一个binding**。

比如这样一段代码

```js
const a = 1;
```

它的 path.scope.bindings 是这样的

```js
bindings: {
    a: {
        constant: true,
        constantViolations: [],
        identifier: {type: 'Identifier', ...}
        kind:'const',
        path: {node,...}
        referenced: false
        referencePaths: [],
        references: 0,
        scope: ...
    }
}
```

因为我们在当前 scope 中声明了 a 这个变量，所以 bindings 中有 a 的 binding，每一个 binding 都有 kind，这代表绑定的类型：

- var、let、const 分别代表 var、let、const 形式声明的变量
- param 代表参数的声明
- module 代表 import 的变量的声明

binding 有多种 kind，代表变量是用不同的方式声明的。

binding.identifier 和 binding.path，分别代表标识符、整个声明语句。

声明之后的变量会被引用和修改，binding.referenced 代表声明的变量是否被引用，binding.constant 代表变量是否被修改过。如果被引用了，就可以通过 binding.referencePaths 拿到所有引用的语句的 path。如果被修改了，可以通过 binding.constViolations 拿到所有修改的语句的 path。

path 的 api 还是比较多的，这也是 babel 最强大的地方。主要是操作当前节点、当前节点的父节点、兄弟节点，作用域，以及增删改的方法。

### state

state 是遍历过程中 AST 节点之间传递数据的方式。插件的 visitor 中，第一个参数是 path，第二个参数就是 state。

插件可以从 state 中拿到 opts，也就是插件的配置项，也可以拿到 file 对象，file 中有一些文件级别的信息，这个也可以从 path.hub.file 中拿。

```js
state {
    file
    opts
}
```

可以在遍历的过程中在 state 中存一些状态信息，用于后续的 AST 处理。

### AST 的别名

遍历的时候要指定 visitor 处理的 AST，有的时候需要对多个节点做同样的处理，babel 支持指定多个 AST 类型，也可以通过别名指定一系列类型。

```js
  // 单个 AST 类型
  FunctionDeclaration(path, state) {},
  // 多个 AST 类型
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
  // AST 类型别名
  Declaration(){}
```

可以在[文档中](https://babeljs.io/docs/en/babel-types/)查到某个 AST 类型的别名是啥，某个别名都包含哪些 AST 类型可以在[babel-types的类型定义](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2489-L2535/)处查。

可以把 @babel/types 源码下载下来看，类型定义在 src/ast-types/generated 目录下，这样可以利用 ide 的功能方便的查看每种 alias 的具体 AST 类型。

所有的 AST 相关的信息都可以在[babel-types](https://github.com/babel/babel/blob/main/packages/babel-types/src/definitions/core.ts)里查看，每一个 AST 节点怎么创建、怎么校验、怎么遍历，其实都与 AST 的结构有关系，这些都在 babel-types 里面定义。

比如 if 就定义了有哪些属性可以遍历、别名是什么，每一个属性怎么校验，然后会根据这些规则生成xxx，isXxx，assertXxx等api用于创建、判断AST节点。
