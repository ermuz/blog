# 类型体操

## TypeScript 类型系统中的类型

静态类型系统的目的是把类型检查从运行时提前到编译时，那 TS 类型系统中肯定要把 JS 的运行时类型拿过来，也就是 number、boolean、string、object、bigint、symbol、undefined、null 这些类型，还有就是它们的包装类型 Number、Boolean、String、Object、Symbol。

复合类型方面，JS 有 class、Array，这些 TypeScript 类型系统也都支持，但是又多加了三种类型：元组（Tuple）、接口（Interface）、枚举（Enum）。

### 元组

`元组（Tuple）`就是元素个数和类型固定的数组类型：

```ts
type Tuple = [number, string];
```

### 接口

接口（Interface）可以描述函数、对象、构造器的结构：

#### 对象

```ts
interface IPerson {
    name: string;
    age: number;
}

class Person implements IPerson {
    name: string;
    age: number;
}

const obj: IPerson = {
    name: 'guang',
    age: 18
}
```

#### 函数

```ts
interface SayHello {
    (name: string): string;
}

const func: SayHello = (name: string) => {
    return 'hello,' + name
}
```

#### 构造器

```ts
interface PersonConstructor {
    new (name: string, age: number): IPerson;
}

function createPerson(ctor: PersonConstructor):IPerson {
    return new ctor('guang', 18);
}
```

对象类型、class 类型在 TypeScript 里也叫做索引类型，也就是索引了多个元素的类型的意思。对象可以动态添加属性，如果不知道会有什么属性，可以用可索引签名：

```ts
interface IPerson {
    [prop: string]: string | number;
}
const obj:IPerson = {};
obj.name = 'guang';
obj.age = 18;
```

总之，**接口可以用来描述函数、构造器、索引类型（对象、class、数组）等复合类型**。

### 枚举

`枚举（Enum）`是一系列值的复合：

```ts
enum Transpiler {
    Babel = 'babel',
    Postcss = 'postcss',
    Terser = 'terser',
    Prettier = 'prettier',
    TypeScriptCompiler = 'tsc'
}

const transpiler = Transpiler.TypeScriptCompiler;
```

此外，TypeScript 还支持字面量类型，也就是类似 1111、'aaaa'、{ a: 1} 这种值也可以做为类型。

其中，字符串的字面量类型有两种，一种是普通的字符串字面量，比如 'aaa'，另一种是模版字面量，比如 aaa${string}，它的意思是以 aaa 开头，后面是任意 string 的字符串字面量类型。

所以想要约束以某个字符串开头的字符串字面量类型时可以这样写：

```ts
function func(`#${string}`){

}

func('aaa'); // [!code error]

func('#aaa')
```

还有四种特殊的类型：void、never、any、unknown：

- never 代表不可达，比如函数抛异常的时候，返回值就是 never。
- void 代表空，可以是 undefined 或 never。
- any 是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了 never）。
- unknown 是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。

这些就是 TypeScript 类型系统中的全部类型了，大部分是从 JS 中迁移过来的，比如基础类型、Array、class 等，也添加了一些类型，比如 枚举（enum）、接口（interface）、元组等，还支持了字面量类型和 void、never、any、unknown 的特殊类型。

### 类型的装饰

除了描述类型的结构外，TypeScript 的类型系统还支持描述类型的属性，比如是否可选，是否只读等：

```ts
interface IPerson {
    readonly name: string;
    age?: number;
}

type tuple = [string, number?];
```

## TypeScript 类型系统中的类型运算

### 条件：`extends ? :`

TypeScript 里的条件判断是 `extends ? :`，叫做条件类型（Conditional Type）比如：

```ts
type res = 1 extends 2 ? true : false;
```

这就是 TypeScript 类型系统里的 if else。

但是，上面这样的逻辑没啥意义，静态的值自己就能算出结果来，为什么要用代码去判断呢？

所以，类型运算逻辑都是用来做一些动态的类型的运算的，也就是对类型参数的运算。

```ts
type isTwo<T> = T extends 2 ? true: false;

type res = isTwo<1>; // type res = false;
type res2 = isTwo<2>; // type res = true;
```

这种类型也叫做**高级类型**。

**高级类型的特点是传入类型参数，经过一系列类型运算逻辑后，返回新的类型**。

### 推导：infer

如何提取类型的一部分呢？答案是 infer。

比如提取元组类型的第一个元素：

```ts
type First<Tuple extends unknown[]> = Tuple extends [infer T,...infer R] ? T : never;

type res = First<[1,2,3]>; // type res = 1
```

注意，第一个 extends 不是条件，条件类型是 extends ? :，这里的 extends 是约束的意思，也就是约束类型参数只能是数组类型。

因为不知道数组元素的具体类型，所以用 unknown。

### 联合：｜

联合类型（Union）类似 js 里的或运算符 |，但是作用于类型，代表类型可以是几个类型之一。

```ts
type Union = 1 | 2 | 3;
```

### 交叉：&

交叉类型（Intersection）类似 js 中的与运算符 &，但是作用于类型，代表对类型做合并。

```ts
type ObjType = {a: number } & {c: boolean};

type res2 = {a: number, c: boolean} extends ObjType ? true : false
```

注意，同一类型可以合并，不同的类型没法合并，会被舍弃：

```ts
type res = 'aaa' & '111'
```

### 映射类型

对象、class 在 TypeScript 对应的类型是索引类型（Index Type），那么如何对索引类型作修改呢？

答案是`映射类型`。

```ts
type MapType<T> = {
  [Key in keyof T]?: T[Key]
}
```

keyof T 是查询索引类型中所有的索引，叫做`索引查询`。

T[Key] 是取索引类型某个索引的值，叫做`索引访问`。

in 是用于遍历联合类型的运算符。

比如我们把一个索引类型的值变成 3 个元素的数组：

```ts
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a: 1, b: 2}>;
```

**映射类型就相当于把一个集合映射到另一个集合，这是它名字的由来。**

除了值可以变化，索引也可以做变化，用 as 运算符，叫做`重映射`。

```ts
type MapType<T> = {
    [
        Key in keyof T 
            as `${Key & string}${Key & string}${Key & string}`
    ]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a:1,b:2}}> // type res = {aaa:[1,1,1],bbb:[2,2,2]}
```

这里的 `& string` 可能大家会迷惑，解释一下：

因为索引类型（对象、class 等）可以用 `string、number` 和 `symbol` 作为 key，这里 `keyof T` 取出的索引就是 `string | number | symbol` 的联合类型，和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃。

## 套路一：模式匹配做提取

比如这样一个 Promise 类型：

```ts
type p = Promise<'guang'>;
```

我们想提取 value 的类型，可以这样做：

```ts
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

通过 extends 对传入的类型参数 P 做模式匹配，其中值的类型是需要提取的，通过 infer 声明一个局部变量 Value 来保存，如果匹配，就返回匹配到的 Value，否则就返回 never 代表没匹配到。

```ts
type GetValueResult = GetValueType<Promise<'infer'>> // infer
```

**Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型。**

这个模式匹配的套路有多有用呢？我们来看下在数组、字符串、函数、构造器等类型里的应用。

### 数组类型

#### First

数组类型想提取第一个元素的类型怎么做呢？

```ts
type arr = [1,2,3]
```

用它来匹配一个模式类型，提取第一个元素的类型到通过 infer 声明的局部变量里返回。

```ts
type GetFirst<Arr extends unknown[]> =
    Arr extends [infer First, ...unknown[]] ? First : never;
```

类型参数 Arr 通过 extends 约束为只能是数组类型，数组元素是 unkown 也就是可以是任何值。

::: info any 和 unknown 的区别
any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量。
:::

对 Arr 做模式匹配，把我们要提取的第一个元素的类型放到通过 infer 声明的 First 局部变量里，后面的元素可以是任何类型，用 unknown 接收，然后把局部变量 First 返回。

#### Last

可以提取第一个元素，当然也可以提取最后一个元素，修改下模式类型就行：

```ts
type GetLast<Arr extends unknown[]> =
    Arr extends [...unknown[], infer Last] ? Last : never;
```

#### PopArr

我们分别取了首尾元素，当然也可以取剩余的数组，比如取去掉了最后一个元素的数组：

```ts
type PopArr<Arr extends unknown[]> = 
    Arr extends [] ? [] 
        : Arr extends [...infer Rest, unknown] ? Rest : never;
```

如果是空数组，就直接返回，否则匹配剩余的元素，放到 infer 声明的局部变量 Rest 里，返回 Rest。

#### ShiftArr

```ts
type ShiftArr<Arr extends unknown[]> =
    Arr extends [] ? []
        : Arr extends [unknown, ...infer Rest] ? Rest : never;

```

### 字符串类型

字符串类型也同样可以做模式匹配，匹配一个模式字符串，把需要提取的部分放到 infer 声明的局部变量里。

#### StartsWith

判断字符串是否以某个前缀开头，也是通过模式匹配

```ts
type StartsWith<Str extends string, Prefix extends string> =
    Str extends `${Prefix}${string}` ? true : false;
```

需要声明字符串 Str、匹配的前缀 Prefix 两个类型参数，它们都是 string。

用 Str 去匹配一个模式类型，模式类型的前缀是 Prefix，后面是任意的 string，如果匹配返回 true，否则返回 false。

#### Replace

字符串可以匹配一个模式类型，提取想要的部分，自然也可以用这些再构成一个新的类型。

```ts
type ReplaceStr<
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${Suffix}` : Str;
```

声明要替换的字符串 Str、待替换的字符串 From、替换成的字符串 3 个类型参数，通过 extends 约束为都是 string 类型。

用 Str 去匹配模式串，模式串由 From 和之前之后的字符串构成，把之前之后的字符串放到通过 infer 声明的局部变量 Prefix、Suffix 里。

用 Prefix、Suffix 加上替换到的字符串 To 构造成新的字符串类型返回。

#### Trim

能够匹配和替换字符串，那也就能实现去掉空白字符的 Trim：

不过因为我们不知道有多少个空白字符，所以只能一个个匹配和去掉，需要递归。

先实现 TrimRight:

```ts
type TrimStrRight<Str extends string> = 
    Str extends `${infer Rest}${' ' | '\n' | '\t'}` 
        ? TrimStrRight<Rest> : Str;
```

类型参数 Str 是要 Trim 的字符串。

如果 Str 匹配字符串 + 空白字符 (空格、换行、制表符)，那就把字符串放到 infer 声明的局部变量 Rest 里。

把 Rest 作为类型参数递归 TrimRight，直到不匹配，这时的类型参数 Str 就是处理结果。

同理可得 TrimLeft：

```ts
type TrimStrLeft<Str extends string> = 
    Str extends `${' ' | '\n' | '\t'}${infer Rest}` 
        ? TrimStrLeft<Rest> : Str;
```

TrimRight 和 TrimLeft 结合就是 Trim：

```ts
type TrimStr<Str extends string> =TrimStrRight<TrimStrLeft<Str>>;
```

### 函数

函数同样也可以做类型匹配，比如提取参数、返回值的类型。

#### GetParameters

函数类型可以通过模式匹配来提取参数的类型：

```ts
type GetParameters<Func extends Function> =
    Func extends (...args: infer Args) => unknown ? Args : never;
```

类型参数 Func 是要匹配的函数类型，通过 extends 约束为 Function。

Func 和模式类型做匹配，参数类型放到用 infer 声明的局部变量 Args 里，返回值可以是任何类型，用 unknown。

返回提取到的参数类型 Args。

#### GetReturnType

能提取参数类型，同样也可以提取返回值类型：

```ts
type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType 
        ? ReturnType : never;
```

Func 和模式类型做匹配，提取返回值到通过 infer 声明的局部变量 ReturnType 里返回。

参数类型可以是任意类型，也就是 any[]（注意，这里不能用 unknown，这里的解释涉及到参数的逆变性质，具体原因逆变那一节会解释）。

### 构造器

构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。

同样，我们也可以通过模式匹配提取构造器的参数和返回值的类型：

#### GetInstanceType

构造器类型可以用 interface 声明，使用 new(): xx 的语法。

比如：

```ts
interface Person {
    name: string;
}

interface PersonConstructor {
    new(name: string): Person;
}
```

这里的 PersonConstructor 返回的是 Person 类型的实例对象，这个也可以通过模式匹配取出来。

```ts
type GetInstanceType<
    ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: any) => infer InstanceType 
        ? InstanceType
        : any;
```

类型参数 ConstructorType 是待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType。

#### GetConstructorParameters

GetInstanceType 是提取构造器返回值类型，那同样也可以提取构造器的参数类型：

```ts
type GetConstructorParameters<
    ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: infer ParametersType) => any
    ? ParametersType
    : never;
```

类型参数 ConstructorType 为待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取参数的部分到 infer 声明的局部变量 ParametersType 里，返回 ParametersType。

### 索引类型

索引类型也同样可以用模式匹配提取某个索引的值的类型，这个用的也挺多的，比如 React 的 index.d.ts 里的 PropsWithRef 的高级类型，就是通过模式匹配提取了 ref 的值的类型：

```ts
type PropsWithRef<P> =
    'ref' extends keyof P
        ? P extends {ref?: infer R | undefined}
            ? string extends R
                ? PropsWithoutRef<R> & {ref?: Exclude<R,string> | undefined}
                : P
            : P
        : P
```

我们简化一下那个高级类型，提取 Props 里 ref 的类型：

#### GetRefProps

```ts
type GetRefProps<Props> = 
    'ref' extends keyof Props
        ? Props extends { ref?: infer Value | undefined}
            ? Value
            : never
        : never;
```

类型参数 Props 为待处理的类型。

通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。

为什么要做这个判断，上面注释里写了，在 ts3.0 里面如果没有对应的索引，Obj[Key] 返回的是 {} 而不是 never，所以这样做下兼容处理。

如果有 ref 这个索引的话，就通过 infer 提取 Value 的类型返回，否则返回 never。
