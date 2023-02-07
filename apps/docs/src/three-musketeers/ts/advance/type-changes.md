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

## 套路二：重新构造做变换

**TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造。**

### 数组类型的重新构造

#### Push

有这样一个元组类型：

```ts
type tuple = [1,2,3];
```

TypeScript 类型变量不支持修改，我们可以构造一个新的元组类型：

```ts
type Push<Arr extends  unknown[], Ele> = [...Arr, Ele];
```

类型参数 Arr 是要修改的数组/元组类型，元素的类型任意，也就是 unknown。

类型参数 Ele 是添加的元素的类型。

::: info 数组和元组的区别
数组类型是指任意多个同一类型的元素构成的，比如 `number[]、Array<number>`，而元组则是数量固定，类型可以不同的元素构成的，比如 `[1, true, 'guang']`。
:::

#### Unshift

```ts
type Unshift<Arr extends  unknown[], Ele> = [Ele, ...Arr];
```

#### Zip

```ts
type Zip<One extends unknown[], Other extends unknown[]> =
    One extends [infer OneFirst, ...infer OneRest]
        ? Other extends [infer OtherFirst, ...infer OtherRest]
            ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>]: []
                : [];
```

类型参数 One、Other 声明为 unknown[]，也就是元素个数任意，类型任意的数组。

每次提取 One 和 Other 的第一个元素 OneFirst、OtherFirst，剩余的放到 OneRest、OtherRest 里。

用 OneFirst、OtherFirst 构造成新的元组的一个元素，剩余元素继续递归处理 OneRest、OtherRest。

### 字符串类型的重新构造

#### CapitalizeStr

我们想把一个字符串字面量类型的 'guang' 转为首字母大写的 'Guang'。

需要用到字符串类型的提取和重新构造：

```ts
type CapitalizeStr<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? `${Uppercase<First>}${Rest}` : Str;
```

我们声明了类型参数 Str 是要处理的字符串类型，通过 extends 约束为 string。

通过 infer 提取出首个字符到局部变量 First，提取后面的字符到局部变量 Rest。

然后使用 TypeScript 提供的内置高级类型 Uppercase 把首字母转为大写，加上 Rest，构造成新的字符串类型返回。

这就是字符串类型的重新构造：**从已有的字符串类型中提取出一些部分字符串，经过一系列变换，构造成新的字符串类型。**

#### CamelCase

下划线到驼峰形式的转换

```ts
type CamelCase<Str extends string> =
    Str extends `${infer Left}_${infer Right}${infer Rest}`
        ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
        : Str;
```

类型参数 Str 是待处理的字符串类型，约束为 string。

提取 _ 之前和之后的两个字符到 infer 声明的局部变量 Left 和 Right，剩下的字符放到 Rest 里。

然后把右边的字符 Right 大写，和 Left 构造成新的字符串，剩余的字符 Rest 要继续递归的处理。

#### DropSubStr

可以修改自然也可以删除，我们再来做一个删除一段字符串的案例：删除字符串中的某个子串

```ts
type DropSubStr<Str extends string, SubStr extends string> =
    Str extends `${infer Prefix}${SubStr}${infer Suffix}`
        ? DropSubStr<`${Prefix}${Suffix}`, SubStr> : Str;
```

类型参数 Str 是待处理的字符串， SubStr 是要删除的字符串，都通过 extends 约束为 string 类型。

通过模式匹配提取 SubStr 之前和之后的字符串到 infer 声明的局部变量 Prefix、Suffix 中。

如果不匹配就直接返回 Str。

如果匹配，那就用 Prefix、Suffix 构造成新的字符串，然后继续递归删除 SubStr。直到不再匹配，也就是没有 SubStr 了。

### 函数类型的重新构造

#### AppendArgument

在已有的函数类型上添加一个参数

```ts
type AppendArgument<Func extends Function, Arg> =
    Func extends (...args: infer Args) => infer ReturnType
        ? (...args: [...Args, Arg]) => ReturnType : never;
```

类型参数 Func 是待处理的函数类型，通过 extends 约束为 Function，Arg 是要添加的参数类型。

通过模式匹配提取参数到 infer 声明的局部变量 Args 中，提取返回值到局部变量 ReturnType 中。

用 Args 数组添加 Arg 构造成新的参数类型，结合 ReturnType 构造成新的函数类型返回。

### 索引类型的重新构造

索引类型是聚合多个元素的类型，class、对象等都是索引类型

```ts
type obj = {
  name: string;
  age: number;
  gender: boolean;
}
```

索引类型可以添加修饰符 readonly（只读）、?（可选）:

```ts
type obj = {
  readonly name: string;
  age?: number;
  gender: boolean;
}
```

对它的修改和构造新类型涉及到了映射类型的语法：

```ts
type Mapping<Obj extends object> = {
    [Key in keyof Obj]: Obj[Key]
}
```

#### UppercaseKey

除了可以对 Value 做修改，也可以对 Key 做修改，使用 as，这叫做`重映射`：

```ts
type UppercaseKey<Obj extends object> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
```

类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object。

新的索引类型的索引为 Obj 中的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的。

通过 Uppercase 把索引 Key 转为大写，因为索引可能为 string、number、symbol 类型，而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分。

value 保持不变，也就是之前的索引 Key 对应的值的类型 Obj[Key]。

#### Record

TypeScript 提供了内置的高级类型 Record 来创建索引类型：

```ts
type Record<K extends string | number | symbol, T> = { [P in K]: T; }
```

指定索引和值的类型分别为 K 和 T，就可以创建一个对应的索引类型。

上面的索引类型的约束我们用的 object，其实更语义化一点我推荐用 `Record<string, any>`：

```ts
type UppercaseKey<Obj extends Record<string, any>> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
```

也就是约束类型参数 Obj 为 key 为 string，值为任意类型的索引类型。

#### ToReadonly

索引类型的索引可以添加 readonly 的修饰符，代表只读。

那我们就可以实现给索引类型添加 readonly 修饰的高级类型

```ts
type ToReadonly<T> =  {
    readonly [Key in keyof T]: T[Key];
}
```

通过映射类型构造了新的索引类型，给索引加上了 readonly 的修饰，其余的保持不变，索引依然为原来的索引 Key in keyof T，值依然为原来的值 T[Key]。

#### ToPartial

同理，索引类型还可以添加可选修饰符：

```ts
type ToPartial<T> = {
    [Key in keyof T]?: T[Key]
}
```

给索引类型 T 的索引添加了 ? 可选修饰符，其余保持不变。

#### ToMutable

可以添加 readonly 修饰，当然也可以去掉：

```ts
type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key]
}
```

给索引类型 T 的每个索引去掉 readonly 的修饰，其余保持不变。

#### ToRequired

同理，也可以去掉可选修饰符：

```ts
type ToRequired<T> = {
    [Key in keyof T]-?: T[Key]
}
```

给索引类型 T 的索引去掉 ? 的修饰 ，其余保持不变。

#### FilterByValueType

可以在构造新索引类型的时候根据值的类型做下过滤

```ts
type FilterByValueType<
    Obj extends Record<string, any>,
    ValueType
> = {
    [Key in keyof Obj
        as Obj[Key] extends ValueType ? Key : never]
        : Obj[Key]
}
```

类型参数 Obj 为要处理的索引类型，通过 extends 约束为索引为 string，值为任意类型的索引类型 Record<string, any>。

类型参数 ValueType 为要过滤出的值的类型。

构造新的索引类型，索引为 Obj 的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的部分。

如果原来索引的值 Obj[Key] 是 ValueType 类型，索引依然为之前的索引 Key，否则索引设置为 never，never 的索引会在生成新的索引类型时被去掉。

值保持不变，依然为原来索引的值，也就是 Obj[Key]。

## 套路三：递归复用做循环

### 递归复用

**递归是把问题分解为一系列相似的小问题，通过函数不断调用自身来解决这一个个小问题，直到满足结束条件，就完成了问题的求解。**

**TypeScript 类型系统不支持循环，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。**

### Promise 的递归复用

#### DeepPromiseValueType

实现一个提取不确定层数的 Promise 中的 value 类型的高级类型

```ts
type DeepPromiseValueType<T> =
    T extends Promise<infer ValueType>
        ? DeepPromiseValueType2<ValueType>
        : T;
```

类型参数 P 是待处理的 Promise，通过 extends 约束为 Promise 类型，value 类型不确定，设为 unknown。

每次只处理一个类型的提取，也就是通过模式匹配提取出 value 的类型到 infer 声明的局部变量 ValueType 中。

然后判断如果 ValueType 依然是 Promise类型，就递归处理。

结束条件就是 ValueType 不为 Promise 类型，那就处理完了所有的层数，返回这时的 ValueType。

### 数组类型的递归

#### ReverseArr

```ts
type ReverseArr<Arr extends unknown[]> =
    Arr extends [infer First, ...infer Rest]
        ? [...ReverseArr<Rest>, First]
        : Arr;
```

类型参数 Arr 为待处理的数组类型，元素类型不确定，也就是 unknown。

每次只处理一个元素的提取，放到 infer 声明的局部变量 First 里，剩下的放到 Rest 里。

用 First 作为最后一个元素构造新数组，其余元素递归的取。

#### Includes

```ts
type Includes<Arr extends unknown[], FindItem> =
    Arr extends [infer First, ...infer Rest]
        ? IsEqual<First, FindItem> extends true
            ? true
            : Includes<Rest, FindItem>
        : false;

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

类型参数 Arr 是待查找的数组类型，元素类型任意，也就是 unknown。FindItem 待查找的元素类型。

每次提取一个元素到 infer 声明的局部变量 First 中，剩余的放到局部变量 Rest。

判断 First 是否是要查找的元素，也就是和 FindItem 相等，是的话就返回 true，否则继续递归判断下一个元素。

直到结束条件也就是提取不出下一个元素，这时返回 false。

相等的判断就是 A 是 B 的子类型并且 B 也是 A 的子类型，。

这样就完成了不确定长度的数组中的元素查找，用递归实现了循环。

#### RemoveItem

```ts
type RemoveItem<
    Arr extends unknown[],
    Item,
    Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
        ? IsEqual<First, Item> extends true
            ? RemoveItem<Rest, Item, Result>
            : RemoveItem<Rest, Item, [...Result, First]>
        : Result;

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

类型参数 Arr 是待处理的数组，元素类型任意，也就是 unknown[]。类型参数 Item 为待查找的元素类型。类型参数 Result 是构造出的新数组，默认值是 []。

通过模式匹配提取数组中的一个元素的类型，如果是 Item 类型的话就删除，也就是不放入构造的新数组，直接返回之前的 Result。

否则放入构造的新数组，也就是再构造一个新的数组 [...Result, First]。

直到模式匹配不再满足，也就是处理完了所有的元素，返回这时候的 Result。

#### BuildArray

```ts
type BuildArray<
    Length extends number,
    Ele = unknown,
    Arr extends unknown[] = []
> = Arr['length'] extends Length
        ? Arr
        : BuildArray<Length, Ele, [...Arr, Ele]>;
```

类型参数 Length 为数组长度，约束为 number。类型参数 Ele 为元素类型，默认值为 unknown。类型参数 Arr 为构造出的数组，默认值是 []。

每次判断下 Arr 的长度是否到了 Length，是的话就返回 Arr，否则在 Arr 上加一个元素，然后递归构造。

### 字符串类型的递归

#### ReplaceAll

```ts
type ReplaceAll<
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Left}${From}${infer Right}`
        ? `${Left}${To}${ReplaceAll<Right, From, To>}`
        : Str;
```

类型参数 Str 是待处理的字符串类型，From 是待替换的字符，To 是替换到的字符。

通过模式匹配提取 From 左右的字符串到 infer 声明的局部变量 Left 和 Right 里。

用 Left 和 To 构造新的字符串，剩余的 Right 部分继续递归的替换。

结束条件是不再满足模式匹配，也就是没有要替换的元素，这时就直接返回字符串 Str。

#### StringToUnion

我们想把字符串字面量类型的每个字符都提取出来组成联合类型，也就是把 'dong' 转为 'd' | 'o' | 'n' | 'g'。

```ts
type StringToUnion<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? First | StringToUnion<Rest>
        : never;
```

类型参数 Str 为待处理的字符串类型，通过 extends 约束为 string。

通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余的字符放到局部变量 Rest。

用 First 构造联合类型，剩余的元素递归的取。

#### ReverseStr

```ts
type ReverseStr<
    Str extends string,
    Result extends string = ''
> = Str extends `${infer First}${infer Rest}`
    ? ReverseStr<Rest, `${First}${Result}`>
    : Result;
```

类型参数 Str 为待处理的字符串。类型参数 Result 为构造出的字符，默认值是空串。

通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余字符放到 Rest。

用 First 和之前的 Result 构造成新的字符串，把 First 放到前面，因为递归是从左到右处理，那么不断往前插就是把右边的放到了左边，完成了反转的效果。

直到模式匹配不满足，就处理完了所有的字符。

### 对象类型的递归

#### DeepReadonly

```ts
type DeepReadonly<Obj extends Record<string, any>> =
    Obj extends any
        ? {
            readonly [Key in keyof Obj]:
                Obj[Key] extends object
                    ? Obj[Key] extends Function
                        ? Obj[Key]
                        : DeepReadonly<Obj[Key]>
                    : Obj[Key]
        }
        : never;
```

类型参数 Obj 是待处理的索引类型，约束为 `Record<string, any>`，也就是索引为 string，值为任意类型的索引类型。

因为 ts 的类型只有被用到的时候才会做计算。

所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，从而触发计算

索引映射自之前的索引，也就是 Key in keyof Obj，只不过加上了 readonly 的修饰。

值要做下判断，如果是 object 类型并且还是 Function，那么就直接取之前的值 Obj[Key]。

如果是 object 类型但不是 Function，那就是说也是一个索引类型，就递归处理 `DeepReadonly<Obj[Key]>`。

否则，值不是 object 就直接返回之前的值 Obj[Key]。

## 套路四：数组长度做计数

**TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。**

### 数组长度做计数

#### Add

```ts
type Add<Num1 extends number, Num2 extends number> =
    [...BuildArray<Num1>,...BuildArray<Num2>]['length'];
```

构造两个数组，然后合并成一个，取 length。

比如 3 + 2，就是构造一个长度为 3 的数组类型，再构造一个长度为 2 的数组类型，然后合并成一个数组，取 length。

#### Subtract

```ts
type Subtract<Num1 extends number, Num2 extends number> =
    BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
        ? Rest['length']
        : never;
```

类型参数 Num1、Num2 分别是被减数和减数，通过 extends 约束为 number。

构造 Num1 长度的数组，通过模式匹配提取出 Num2 长度个元素，剩下的放到 infer 声明的局部变量 Rest 里。

取 Rest 的长度返回，就是减法的结果。

#### Multiply

```ts
type Mutiply<
    Num1 extends number,
    Num2 extends number,
    ResultArr extends unknown[] = []
> = Num2 extends 0 ? ResultArr['length']
        : Mutiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>;
```

类型参数 Num1 和 Num2 分别是被加数和加数。

因为乘法是多个加法结果的累加，我们加了一个类型参数 ResultArr 来保存中间结果，默认值是 []，相当于从 0 开始加。

每加一次就把 Num2 减一，直到 Num2 为 0，就代表加完了。

加的过程就是往 ResultArr 数组中放 Num1 个元素。

这样递归的进行累加，也就是递归的往 ResultArr 中放元素。

最后取 ResultArr 的 length 就是乘法的结果。

#### Divide

```ts
type Divide<
    Num1 extends number,
    Num2 extends number,
    CountArr extends unknown[] = []
> = Num1 extends 0 ? CountArr['length']
        : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>;
```

类型参数 Num1 和 Num2 分别是被减数和减数。

类型参数 CountArr 是用来记录减了几次的累加数组。

如果 Num1 减到了 0 ，那么这时候减了几次就是除法结果，也就是 CountArr['length']。

否则继续递归的减，让 Num1 减去 Num2，并且 CountArr 多加一个元素代表又减了一次。

### 数组长度实现计数

#### StrLen

数组长度可以取 length 来得到，但是字符串类型不能取 length，所以我们来实现一个求字符串长度的高级类型。

字符串长度不确定，明显要用递归。每次取一个并计数，直到取完，就是字符串长度。

```ts
type StrLen<
    Str extends string,
    CountArr extends unknown[] = []
> = Str extends `${string}${infer Rest}`
    ? StrLen<Rest, [...CountArr, unknown]>
    : CountArr['length']
```

类型参数 Str 是待处理的字符串。类型参数 CountArr 是做计数的数组，默认值 [] 代表从 0 开始。

每次通过模式匹配提取去掉一个字符之后的剩余字符串，并且往计数数组里多放入一个元素。递归进行取字符和计数。

如果模式匹配不满足，代表计数结束，返回计数数组的长度 CountArr['length']。

#### GreaterThan

我们往一个数组类型中不断放入元素取长度，如果先到了 A，那就是 B 大，否则是 A 大：

```ts
type GreaterThan<
    Num1 extends number,
    Num2 extends number,
    CountArr extends unknown[] = []
> = Num1 extends Num2 
    ? false
    : CountArr['length'] extends Num2
        ? true
        : CountArr['length'] extends Num1
            ? false
            : GreaterThan<Num1, Num2, [...CountArr, unknown]>;

```

类型参数 Num1 和 Num2 是待比较的两个数。

类型参数 CountArr 是计数用的，会不断累加，默认值是 [] 代表从 0 开始。

如果 Num1 extends Num2 成立，代表相等，直接返回 false。

否则判断计数数组的长度，如果先到了 Num2，那么就是 Num1 大，返回 true。

反之，如果先到了 Num1，那么就是 Num2 大，返回 false。

如果都没到就往计数数组 CountArr 中放入一个元素，继续递归。

这样就实现了数值比较。

#### Fibonacci

谈到了数值运算，就不得不提起经典的 Fibonacci 数列的计算。

Fibonacci 数列是 1、1、2、3、5、8、13、21、34、…… 这样的数列，有当前的数是前两个数的和的规律。

F(0) = 1，F(1) = 1, F(n) = F(n - 1) + F(n - 2)（n ≥ 2，n ∈ N*）

也就是递归的加法，在 TypeScript 类型编程里用构造数组来实现这种加法：

```ts
type FibonacciLoop<
    PrevArr extends unknown[],
    CurrentArr extends unknown[],
    IndexArr extends unknown[] = [],
    Num extends number = 1
> = IndexArr['length'] extends Num
    ? CurrentArr['length']
    : FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [...IndexArr, unknown], Num>

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;
```

类型参数 PrevArr 是代表之前的累加值的数组。类型参数 CurrentArr 是代表当前数值的数组。

类型参数 IndexArr 用于记录 index，每次递归加一，默认值是 []，代表从 0 开始。

类型参数 Num 代表求数列的第几个数。

判断当前 index 也就是 IndexArr['length'] 是否到了 Num，到了就返回当前的数值 CurrentArr['length']。

否则求出当前 index 对应的数值，用之前的数加上当前的数 [...PrevArr, ... CurrentArr]。

然后继续递归，index + 1，也就是 [...IndexArr, unknown]。

这就是递归计算 Fibinacci 数列的数的过程。

## 套路五：联合分散可化简

### 分布式条件类型

**当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。**

比如这样一个联合类型：

```ts
type Union = 'a' | 'b' | 'c';
```

我们想把其中的 a 大写，就可以这样写：

```ts
type UppercaseA<Item extends string> =
    Item extends 'a' ?  Uppercase<Item> : Item;
```

可以看到，我们类型参数 Item 约束为 string，条件类型的判断中也是判断是否是 a，但传入的是联合类型。

这就是 TypeScript 对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并。

这样确实是简化了类型编程逻辑的，不需要递归提取每个元素再处理。

TypeScript 之所以这样处理联合类型也很容易理解，因为联合类型的每个元素都是互不相关的，不像数组、索引、字符串那样元素之间是有关系的。所以设计成了每一个单独处理，最后合并。

#### CamelcaseUnion

Camelcase 我们实现过，就是提取字符串中的字符，首字母大写以后重新构造一个新的。

```ts
type Camelcase<Str extends string> = 
    Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : Str;
```

提取 _ 左右的字符，把右边字符大写之后构造成新的字符串，余下的字符串递归处理。

如果是对字符串数组做 Camelcase，那就要递归处理每一个元素：

```ts
type CamelcaseArr<
  Arr extends unknown[]
> = Arr extends [infer Item, ...infer RestArr]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : [];
```

类型参数 Arr 为待处理数组。

递归提取每一个元素做 Camelcase，因为 Camelcase 要求传入 string，这里要 & string 来变成 string 类型。

联合类型不需要递归提取每个元素，TypeScript 内部会把每一个元素传入单独做计算，之后把每个元素的计算结果合并成联合类型。

```ts
type CamelcaseUnion<Item extends string> = 
  Item extends `${infer Left}_${infer Right}${infer Rest}` 
    ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}` 
    : Item;
```

#### IsUnion

```ts
type IsUnion<A, B = A> =
    A extends A
        ? [B] extends [A]
            ? false
            : true
        : never
```

类型参数 A、B 是待判断的联合类型，B 默认值为 A，也就是同一个类型。

A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入。

[B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，那么 B 就是整个联合类型。

B 是联合类型整体，而 A 是单个类型，自然不成立，而其它类型没有这种特殊处理，A 和 B 都是同一个，怎么判断都成立。

利用这个特点就可以判断出是否是联合类型。

其中有两个点比较困惑，我们重点记一下：

**当 A 是联合类型时：**

- **A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。**

- **A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。**

理解了这两点，分布式条件类型就算掌握了。

#### BEM

bem 是 css 命名规范，用 block__element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式。

那么我们可以写这样一个高级类型，传入 block、element、modifier，返回构造出的 class 名：

```ts
type bemResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']>;
```

它的实现就是三部分的合并，但传入的是数组，要递归遍历取出每一个元素来和其他部分组合，这样太麻烦了。

而如果是联合类型就不用递归遍历了，因为联合类型遇到字符串也是会单独每个元素单独传入做处理。

数组转联合类型可以这样写：

```ts
type union = ['aaa','bbb'][number]
```

那么 BEM 就可以这样实现：

```ts
type BEM<
    Block extends string,
    Element extends string[],
    Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;
```

类型参数 Block、Element、Modifiers 分别是 bem 规范的三部分，其中 Element 和 Modifiers 都可能多个，约束为 string[]。

构造一个字符串类型，其中 Element 和 Modifiers 通过索引访问来变为联合类型。

#### AllCombinations

再来实现一个全组合的高级类型，也是联合类型相关的：

希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。

这种全组合问题的实现思路就是两两组合，组合出的字符串再和其他字符串两两组和：

比如 'A' | 'B' | 'c'，就是 A 和 B、C 组合，B 和 A、C 组合，C 和 A、B 组合。然后组合出来的字符串再和其他字符串组合。

任何两个类型的组合有四种：A、B、AB、BA

```ts
type Combination<A extends string, B extends string> =
    | A
    | B
    | `${A}${B}`
    | `${B}${A}`;
```

然后构造出来的字符串再和其他字符串组合。

所以全组合的高级类型就是这样：

```ts
type AllCombinations<A extends string, B extends string = A> = 
    A extends A
        ? Combination<A, AllCombinations<Exclude<B, A>>>
        : never;
```

类型参数 A、B 是待组合的两个联合类型，B 默认是 A 也就是同一个。

A extends A 的意义就是让联合类型每个类型单独传入做处理，上面我们刚学会。

A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 `Combination<A, B 去掉 A 以后的所有组合>`。

而 B 去掉 A 以后的所有组合就是 `AllCombinations<Exclude<B, A>>`，所以全组合就是 `Combination<A, AllCombinations<Exclude<B, A>>>`。

## 套路六：特殊特性要记清

### 特殊类型的特性

TypeScript 类型系统中有些类型比较特殊，比如 any、never、联合类型，比如 class 有 public、protected、private 的属性，比如索引类型有具体的索引和可索引签名，索引还有可选和非可选。。。

如果给我们一种类型让我们判断是什么类型，应该怎么做呢？

类型的判断要根据它的特性来，比如判断联合类型就要根据它的 distributive 的特性。

我们分别看一下这些特性：

#### IsAny

**any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any。**

```ts
type IsAny<T> = 'dong' extends ('guang' & T) ? true : false
```

#### IsEqual

```ts
type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true : false;
```

#### IsUnion

```ts
type IsUnion<A, B = A> =
    A extends A
        ? [B] extends [A]
            ? false
            : true
        : never
```

#### IsNever

**never 在条件类型中也比较特殊，如果条件类型左边是类型参数，并且传入的是 never，那么直接返回 never**

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

#### IsTuple

**元组类型的 length 是数字字面量，而数组的 length 是 number。**

```ts
type IsTuple<T> =
    T extends [...params: infer Eles] 
        ? NotEqual<Eles['length'], number> 
        : false
```

类型参数 T 是要判断的类型。

首先判断 T 是否是数组类型，如果不是则返回 false。如果是继续判断 length 属性是否是 number。

如果是数组并且 length 不是 number 类型，那就代表 T 是元组。

NotEqual 的实现是这样的：

```ts
type NotEqual<A, B> = 
    (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? false : true;
```

#### UnionToIntersection

类型之间是有父子关系的，更具体的那个是子类型，比如 A 和 B 的交叉类型 A & B 就是联合类型 A | B 的子类型，因为更具体。

如果允许父类型赋值给子类型，就叫做**逆变**。

如果允许子类型赋值给父类型，就叫做**协变**。

（关于逆变、协变等概念的详细解释可以看原理篇）

在 TypeScript 中有函数参数是有逆变的性质的，也就是如果参数可能是多个类型，参数类型会变成它们的交叉类型。

所以联合转交叉可以这样实现 ：

```ts
type UnionToIntersection<U> = 
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
        ? R
        : never
```

类型参数 U 是要转换的联合类型。

U extends U 是为了触发联合类型的 distributive 的性质，让每个类型单独传入做计算，最后合并。

利用 U 做为参数构造个函数，通过模式匹配取参数的类型。

#### GetOptional

**可选索引的值为 undefined 和值类型的联合类型。**

```ts
type GetOptional<Obj extends  Record<string, any>> = {
    [
        Key in keyof Obj 
            as {} extends Pick<Obj, Key> ? Key : never
    ] : Obj[Key];
}
```

类型参数 Obj 为待处理的索引类型，类型约束为索引为 string、值为任意类型的索引类型 Record<string, any>。

用映射类型的语法重新构造索引类型，索引是之前的索引也就是 Key in keyof Obj，但要做一些过滤，也就是 as 之后的部分。

过滤的方式就是单独取出该索引之后，判断空对象是否是其子类型。

可选的意思是这个索引可能没有，没有的时候，那 `Pick<Obj, Key>` 就是空的，所以 `{} extends Pick<Obj, Key>` 就能过滤出可选索引。

值的类型依然是之前的，也就是 Obj[Key]。

**可选的意思是指有没有这个索引，而不是索引值是不是可能 undefined。**

#### GetRequired

实现了 GetOptional，那反过来就是 GetRequired，也就是过滤所有非可选的索引构造成新的索引类型：

```ts
type isRequired<Key extends keyof Obj, Obj> =
    {} extends Pick<Obj, Key> ? never : Key;

type GetRequired<Obj extends Record<string, any>> = {
    [Key in keyof Obj as isRequired<Key, Obj>]: Obj[Key]
}
```

#### RemoveIndexSignature

索引类型可能有索引，也可能有可索引签名。

```ts
type Dong = {
  [key: string]: any;
  sleep(): void;
}
```

这里的 sleep 是具体的索引，[key: string]: any 就是可索引签名，代表可以添加任意个 string 类型的索引。

如果想删除索引类型中的可索引签名呢？

同样根据它的性质，索引签名不能构造成字符串字面量类型，因为它没有名字，而其他索引可以。

所以，就可以这样过滤：

```ts
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [
      Key in keyof Obj
          as Key extends `${infer Str}`? Str : never
  ]: Obj[Key]
}
```

类型参数 Obj 是待处理的索引类型，约束为 `Record<string, any>`。

通过映射类型语法构造新的索引类型，索引是之前的索引 Key in keyof Obj，但要做一些过滤，也就是 as 之后的部分。

如果索引是字符串字面量类型，那么就保留，否则返回 never，代表过滤掉。

值保持不变，也就是 Obj[Key]。

#### ClassPublicProps

**keyof 只能拿到 class 的 public 索引，private 和 protected 的索引会被忽略。**

```ts
class Dong {
  public name: string;
  protected age: number;
  private hobbies: string[];

  constructor() {
    this.name = 'dong';
    this.age = 20;
    this.hobbies = ['sleep', 'eat'];
  }
}
```

keyof 拿到的只有 name

所以，我们就可以根据这个特性实现 public 索引的过滤：

```ts
type ClassPublicProps<Obj extends Record<string, any>> = {
    [Key in keyof Obj]: Obj[Key]
}
```

类型参数 Obj 为带处理的索引类型，类和对象都是索引类型，约束为 `Record<string, any>`。

构造新的索引类型，索引是 keyof Obj 过滤出的索引，也就是 public 的索引。

值保持不变，依然是 Obj[Key]。

#### as const

TypeScript 默认推导出来的类型并不是字面量类型。

但是类型编程很多时候是需要推导出字面量类型的，这时候就需要用 as const

但是加上 as const 之后推导出来的类型是带有 readonly 修饰的，所以再通过模式匹配提取类型的时候也要加上 readonly 的修饰才行。

:::info
const 是常量的意思，也就是说这个变量首先是一个字面量值，而且还不可修改，有字面量和 readonly 两重含义。所以加上 as const 会推导出 readonly 的字面量类型。
:::

## 内置高级类型

### Parameters

Parameters 用于提取函数类型的参数类型。

```ts
type Parameters<T extends (...args: any) => any> 
    = T extends (...args: infer P) => any 
        ? P
        : never;
```

类型参数 T 为待处理的类型，通过 extends 约束为函数，参数和返回值任意。

通过 extends 匹配一个模式类型，提取参数的类型到 infer 声明的局部变量 P 中返回。

### ReturnType

ReturnType 用于提取函数类型的返回值类型。

```ts
type ReturnType<T extends (...args: any) => any> 
    = T extends (...args: any) => infer R
        ? R
        : any;
```

类型参数 T 为待处理的类型，通过 extends 约束为函数类型，参数和返回值任意。

用 T 匹配一个模式类型，提取返回值的类型到 infer 声明的局部变量 R 里返回。

### ConstructorParameters

构造器类型和函数类型的区别就是可以被 new。

Parameters 用于提取函数参数的类型，而 ConstructorParameters 用于提取构造器参数的类型。

```ts
type ConstructorParameters<
    T extends abstract new (...args: any) => any
> = T extends abstract new (...args: infer P) => any
    ? P
    : never;
```

类型参数 T 是待处理的类型，通过 extends 约束为构造器类型，加个 abstract 代表不能直接被实例化（其实不加也行）。

用 T 匹配一个模式类型，提取参数的部分到 infer 声明的局部变量 P 里，返回 P。

### InstanceType

提取了构造器参数的类型，自然也可以提取构造器返回值的类型，就是 InstanceType。

```ts
type InstanceType<
    T extends abstract new (...args: any) => any
> = T extends abstract new (...args: any) => infer R
    ? R
    : any;
```

整体和 ConstructorParameters 差不多，只不过提取的不再是参数了，而是返回值。

通过模式匹配提取返回值的类型到 infer 声明的局部变量 R 里返回。

### ThisParameterType

函数里可以调用 this，这个 this 的类型也可以约束

```ts
type ThisParameterType<T> = 
    T extends (this: infer U, ...args: any[]) => any 
        ? U 
        : unknown;
```

### OmitThisParameter

提取出 this 的类型之后，自然可以构造一个新的，比如删除 this 的类型可以用 OmitThisParameter。

```ts
type OmitThisParameter<T> = 
    unknown extends ThisParameterType<T> 
        ? T 
        : T extends (...args: infer A) => infer R 
            ? (...args: A) => R 
            : T;
```

类型参数 T 为待处理的类型。

用 ThisParameterType 提取 T 的 this 类型，如果提取出来的类型是 unknown 或者 any，那么 unknown extends ThisParameterType 就成立，也就是没有指定 this 的类型，所以直接返回 T。

否则，就通过模式匹配提取参数和返回值的类型到 infer 声明的局部变量 A 和 R 中，用它们构造新的函数类型返回。

### Partial

索引类型可以通过映射类型的语法做修改，比如把索引变为可选。

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

类型参数 T 为待处理的类型。

通过映射类型的语法构造一个新的索引类型返回，索引 P 是来源于之前的 T 类型的索引，也就是 P in keyof T，索引值的类型也是之前的，也就是 T[P]。

### Required

可以把索引变为可选，也同样可以去掉可选，也就是 Required 类型

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

类型参数 T 为待处理的类型。

通过映射类型的语法构造一个新的索引类型，索引取自之前的索引，也就是 P in keyof T，但是要去掉可选，也就是 -?，值的类型也是之前的，就是 T[P]。

### Readonly

同样的方式，也可以添加 readonly 的修饰：

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

类型参数 T 为待处理的类型。

通过映射类型的语法构造一个新的索引类型返回，索引和值的类型都是之前的，也就是 P in keyof T 和 T[P]，但是要加上 readonly 的修饰。

### Pick

映射类型的语法用于构造新的索引类型，在构造的过程中可以对索引和值做一些修改或过滤。

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

类型参数 T 为待处理的类型，类型参数 K 为要过滤出的索引，通过 extends 约束为只能是 T 的索引的子集。

构造新的索引类型返回，索引取自 K，也就是 P in K，值则是它对应的原来的值，也就是 T[P]。

### Record

Record 用于创建索引类型，传入 key 和值的类型：

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

这里很巧妙的用到了 keyof any，它的结果是 string | number | symbol

它用映射类型的语法创建了新的索引类型，索引来自 K，也就是 P in K，值是传入的 T。

### Exclude

当想从一个联合类型中去掉一部分类型时，可以用 Exclude 类型：

```ts
type Exclude<T, U> = T extends U ? never : T;
```

联合类型当作为类型参数出现在条件类型左边时，会被分散成单个类型传入，这叫做分布式条件类型。

所以写法上可以简化， T extends U 就是对每个类型的判断。

过滤掉 U 类型，剩下的类型组成联合类型。也就是取差集。

### Extract

可以过滤掉，自然也可以保留，Exclude 反过来就是 Extract，也就是取交集：

```ts
type Extract<T, U> = T extends U ? T : never;
```

### Omit

我们知道了 Pick 可以取出索引类型的一部分索引构造成新的索引类型，那反过来就是去掉这部分索引构造成新的索引类型。

可以结合 Exclude 来轻松实现：

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

类型参数 T 为待处理的类型，类型参数 K 为索引允许的类型（string | number | symbol 或者 string）。

通过 Pick 取出一部分索引构造成新的索引类型，这里用 Exclude 把 K 对应的索引去掉，把剩下的索引保留。

### Awaited

取 Promise 的 ValuType 的高级类型

```ts
type Awaited<T> =
    T extends null | undefined
        ? T 
        : T extends object & { then(onfulfilled: infer F): any }
            ? F extends ((value: infer V, ...args: any) => any)
                ? Awaited<V>
                : never 
            : T;
```

类型参数 T 是待处理的类型。

如果 T 是 null 或者 undefined，就返回 T。

如果 T 是对象并且有 then 方法，那就提取 then 的参数，也就是 onfulfilled 函数的类型到 infer 声明的局部变量 F。

继续提取 onfullfilled 函数类型的第一个参数的类型，也就是 Promise 返回的值的类型到 infer 声明的局部变量 V。

递归的处理提取出来的 V，直到不再满足上面的条件。

### NonNullable

NonNullable 就是用于判断是否为非空类型，也就是不是 null 或者 undefined 的类型的，实现比较简单：

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Uppercase、Lowercase、Capitalize、Uncapitalize

这四个类型是分别实现大写、小写、首字母大写、去掉首字母大写的。

```ts
type Uppercase<S extends string> = intrinsic;

type Lowercase<S extends string> = intrinsic;

type Capitalize<S extends string> = intrinsic;

type Uncapitalize<S extends string> = intrinsic;
```

这个 intrinsic 是固有的意思，就像 js 里面的有的方法打印会显示 [native code] 一样。这部分类型不是在 ts 里实现的，而是编译过程中由 js 实现的。

其实就是 ts 编译器处理到这几个类型时就直接用 js 给算出来了。

为啥要这样做呢？

因为快啊，解析类型是要处理 AST 的，性能比较差，用 js 直接给算出来那多快呀。

## 类型编程的意义

ts 基础是学习怎么给 js 代码声明各种类型，比如索引类型、函数类型、数组类型等，但是如果需要动态生成一些类型，或者对类型做一些变化呢？

这就是类型编程做的事情了，**类型编程可以动态生成类型，对已有类型做修改**。

类型编程是对类型参数做一系列运算之后产生新的类型。需要动态生成类型的场景必然会用到类型编程，比如返回值的类型和参数的类型有一定的关系，需要经过计算才能得到。

有的情况下不用类型编程也行，比如返回值可以是一个字符串类型 string，但用了类型编程的话，可能能更精确的提示出是什么 string，也就是具体的字符串字面量类型，那类型提示的精准度自然就提高了一个级别，体验也会更好。

这就是类型编程的意义：**需要动态生成类型的场景，必然要用类型编程做一些运算。有的场景下可以不用类型编程，但是用了能够有更精准的类型提示和检查**。

### ParseQueryString

```ts
function parseQueryString<Str extends string>(queryStr: Str): ParseQueryString<Str>;
function parseQueryString(queryStr: string) {
    if (!queryStr || !queryStr.length) {
        return {};
    }
    const queryObj:Record<string, any> = {};
    const items = queryStr.split('&');
    items.forEach(item => {
        const [key, value] = item.split('=');
        if (queryObj[key]) {
            if(Array.isArray(queryObj[key])) {
                queryObj[key].push(value);
            } else {
                queryObj[key] = [queryObj[key], value]
            }
        } else {
            queryObj[key] = value;
        }
    });
    return queryObj;
}


const test2 = parseQueryString('a&b=2&c=3&a=2');
```

声明一个类型参数 Str，约束为 string 类型，函数参数的类型指定是这个 Str，返回值的类型通过对 Str 做类型运算得到，也就是 `ParseQueryString<Str>`。

这个 ParseQueryString 的类型做的事情就是把传入的 Str 通过各种类型运算产生对应的索引类型。

### Promise.all

Promise 的 all 和 race 方法的类型声明是这样的：

```ts
interface PromiseConstructor {
    all<T extends readonly unknown[] | []>
        (values: T): Promise<{
            -readonly [P in keyof T]: Awaited<T[P]>
        }>;

    race<T extends readonly unknown[] | []>
        (values: T): Promise<Awaited<T[number]>>;
}
```

所以自然要用类型编程来提取出 Promise 的 value 的类型，构造成新的 Promise 类型。

具体来看下这两个类型定义：

```ts
interface PromiseConstructor {
    all<T extends readonly unknown[] | []>
        (values: T): Promise<{
            -readonly [P in keyof T]: Awaited<T[P]>
        }>;
}
```

类型参数 T 是待处理的 Promise 数组，约束为 unknown[] 或者空数组 []。

这个类型参数 T 就是传入的函数参数的类型。

返回一个新的数组类型，也可以用映射类型的语法构造个新的索引类型（class、对象、数组等聚合多个元素的类型都是索引类型）。

新的索引类型的索引来自之前的数组 T，也就是 P in keyof T，值的类型是之前的值的类型，但要做下 Promise 的 value 类型提取，用内置的高级类型 Awaited，也就是 Awaited<T[P]>。

同时要把 readonly 的修饰去掉，也就是 -readonly。

这就是 Promise.all 的类型定义。因为返回值的类型和参数的类型是有关联的，所以必然会用到类型编程。

Promise.race 的类型定义也是这样：

```ts
interface PromiseConstructor {
    race<T extends readonly unknown[] | []>
        (values: T): Promise<Awaited<T[number]>>;
}
```

类型参数 T 是待处理的参数的类型，约束为 unknown[] 或者空数组 []。

返回值的类型可能是传入的任何一个 Promise 的 value 类型，那就先取出所有的 Promise 的 value 类型，也就是 T[number]。

因为数组类型也是索引类型，所以可以用索引类型的各种语法。

用 Awaited 取出这个联合类型中的每一个类型的 value 类型，也就是 Awaited<T[number]>，这就是 race 方法的返回值的类型。

同样，因为返回值的类型是由参数的类型做一些类型运算得到的，也离不开类型编程。

### currying

有这样一个 curring 函数，接受一个函数，返回柯里化后的函数。

```ts
type CurriedFunc<Params, Return> = 
    Params extends [infer Arg, ...infer Rest]
        ? (arg: Arg) => CurriedFunc<Rest, Return>
        : never;

declare function currying<Func>(fn: Func): 
    Func extends (...args: infer Params) => infer Result ? CurriedFunc<Params, Result> : never;
```

curring 函数有一个类型参数 Func，由函数参数的类型指定。

返回值的类型要对 Func 做一些类型运算，通过模式匹配提取参数和返回值的类型，传入 CurriedFunc 来构造新的函数类型。

构造的函数的层数不确定，所以要用递归，每次提取一个参数到 infer 声明的局部变量 Arg，其余参数到 infer 声明的局部变量 Rest。

用 Arg 作为构造的新的函数函数的参数，返回值的类型继续递归构造。

这样就递归提取出了 Params 中的所有的元素，递归构造出了柯里化后的函数类型。

## 综合实战一

### KebabCaseToCamelCase

常用的变量命名规范有两种，一种是 KebabCase，也就是 aaa-bbb-ccc 这种中划线分割的风格，另一种是 CamelCase， 也就是 aaaBbbCcc 这种除第一个单词外首字母大写的风格。

```ts
type KebabCaseToCamelCase<Str extends string> =
    Str extends `${infer Item}-${infer Rest}`
        ? `${Item}${KebabCaseToCamelCase<Capitalize<Rest>>}`
        : Str;
```

类型参数 Str 是待处理的字符串类型，约束为 string。

通过模式匹配提取 Str 中 - 分隔的两部分，前面的部分放到 infer 声明的局部变量 Item 里，后面的放到 infer 声明的局部变量 Rest 里。

提取的第一个单词不大写，后面的字符串首字母大写，然后递归的这样处理，然后也就是 `${Item}${KebabCaseToCamelCase<Capitalize>`。

如果模式匹配不满足，就返回 Str。

### CamelCaseToKebabCase

同样是对字符串字面量类型的提取和构造，也需要递归处理，但是 CamelCase 没有 - 这种分割符，那怎么分割呢？

可以判断字母的大小写，用大写字母分割。

```ts
type CamelCaseToKebabCase<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? First extends Lowercase<First>
            ? `${First}${CamelCaseToKebabCase<Rest>}`
            : `-${Lowercase<First>}${CamelCaseToKebabCase<Rest>}`
        : Str;
```

类型参数 Str 为待处理的字符串类型。

通过模式匹配提取首个字符到 infer 声明的局部变量 First，剩下的放到 Rest。

判断下当前字符是否是小写，如果是的话就不需要转换，递归处理后续字符，也就是 `${First}${CamelCaseToKebabCase}`。

如果是大写，那就找到了要分割的地方，转为 - 分割的形式，然后把 First 小写，后面的字符串递归的处理，也就是 `-${Lowercase}${CamelCaseToKebabCase}`。

如果模式匹配不满足，就返回 Str。

### Chunk

对数组做分组，比如 1、2、3、4、5 的数组，每两个为 1 组，那就可以分为 1、2 和 3、4 以及 5 这三个 Chunk。

这明显是对数组类型的提取和构造，元素数量不确定，需要递归的处理，并且还需要通过构造出的数组的 length 来作为 chunk 拆分的标志。

```ts
type Chunk<
    T extends unknown[],
    L extends number,
    C extends unknown[] = [],
    R extends unknown[] = []
> = T extends [infer F, ...infer Rest] ?
          C['length'] extends L ?
            Chunk<Rest, L, [F], [...R, C]> :
            Chunk<Rest, L, [...C, F], R>
    : C['length'] extends 0 ? [...R] : [...R, C]
```

类型参数 T 为待处理的数组类型，约束为 unknown。类型参数 L 是每个分组的长度。

后两个类型参数是用于保存中间结果的：类型参数 C 是当前的分组，默认值 []，类型参数 R 是结果数组，默认值 []。

通过模式匹配提取 T 中的首个元素到 infer 声明的局部变量 F 里，剩下的放到 Rest 里。

通过 C 的 length 判断是否到了每个分组要求的长度 L

如果到了，就把 C 加到当前结果 R 里，也就是 [...R, C]，然后开启一个新分组，也就是 [F]。

如果没到，那就继续构造当前分组，也就是 [...C, F]，当前结果不变，也就是 R

这样递归的处理，直到不满足模式匹配，那就把当前 C 也放到结果里返回，也就是 [...R, C]。

### TupleToNestedObject

根据数组类型，比如 [‘a’, ‘b’, ‘c’] 的元组类型，再加上值的类型 'xxx'，构造出这样的索引类型：

```json
{
    "a": {
        "b": {
            "c": "xxx"
        }
    }
}
```

```ts
type TupleToNestedObject<Tuple extends unknown[], Value> = 
    Tuple extends [infer First, ...infer Rest]
      ? {
          [Key in First as Key extends keyof any ? Key : never]: 
              Rest extends unknown[]
                  ? TupleToNestedObject<Rest, Value>
                  : Value
      }
      : Value;
```

类型参数 Tuple 为待处理的元组类型，元素类型任意，约束为 unknown[]。类型参数 Value 为值的类型。

通过模式匹配提取首个元素到 infer 声明的局部变量 First，剩下的放到 infer 声明的局部变量 Rest。

用提取出来的 First 作为 Key 构造新的索引类型，也就是 Key in First，值的类型为 Value，如果 Rest 还有元素的话就递归的构造下一层。

为什么后面还有个 as Key extends keyof any ? Key : never 的重映射呢？

因为比如 null、undefined 等类型是不能作为索引类型的 key 的，就需要做下过滤，如果是这些类型，就返回 never，否则返回当前 Key。

### PartialObjectPropByKeys

把一个索引类型的某些 Key 转为 可选的，其余的 Key 不变，

内置的高级类型里有很多处理映射类型的，比如 Pick 可以根据某些 Key 构造一个新的索引类型，Omit 可以删除某些 Key 构造一个新的索引类型，Partial 可以把索引类型的所有 Key 转为可选。

把第一个索引类型转为 Partial，第二个索引类型不变，然后取交叉类型。

交叉类型会把同类型做合并，不同类型舍弃，所以结果就是我们需要的索引类型。

```ts
type PartialObjectPropByKeys<
    Obj extends Record<string, any>,
    Key extends keyof any
> = Partial<Pick<Obj,Extract<keyof Obj, Key>>> & Omit<Obj,Key>;
```

类型参数 Obj 为待处理的索引类型，约束为 Record<string, any>。

类型参数 Key 为要转为可选的索引，那么类型自然是 string、number、symbol 中的类型，通过 keyof any 来约束更好一些。默认值是 Obj 的索引。

:::info
keyof any 是动态返回索引支持的类型，如果开启了 keyOfStringsOnly 的编译选项，那么返回的就是 string，否则就是 string | number | symbol 的联合类型，这样动态取的方式比写死更好。
:::

Extract 是用于从 Obj 的所有索引 keyof Obj 里取出 Key 对应的索引的，这样能过滤掉一些 Obj 没有的索引。

从 Obj 中 Pick 出 Key 对应的索引构造成新的索引类型并转为 Partial 的，也就是 `Partial<Pick<Obj,Extract<keyof Obj, Key>>>`，其余的 Key 构造一个新的索引类型，也就是 `Omit<Obj,Key>`。然后两者取交叉就是我们需要的索引类型

## 综合实战二

### 函数重载的三种写法

ts 支持函数重载，也就是同名的函数可以有多种类型定义。

#### 函数重载一

```ts
declare function func(name: string): string;
declare function func(name: number): number;
```

这种大家比较常用，声明两个同名函数，就能达到重载的目的

当然，如果有函数的实现，那就不用带 declare 了

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any) {
    return a + b;
}
```

#### 函数重载二

函数可以用 interface 的方式声明，同样，也可以用 interface 的方式声明函数重载：

```ts
interface Func {
    (name: string): string;
    (name: number): number;
}

declare const func2: Func;

funcs()
```

#### 函数重载三

函数类型可以取交叉类型，也就是多种类型都可以，其实也是函数重载的意思：

```ts
type Func2 = ((name: string) => string) & ((name: number) => number);

declare const func3: Func2;

func3()
```

声明多个同名函数类型、interface 声明多个函数签名、交叉类型，一共这三种函数重载的方式。

### UnionToTuple

要求把联合类型转成元组类型，大家有思路没？

也就是 'a' | 'b' | 'c' 转成 ['a', 'b', 'c']。

我们知道 ReturnType 是 ts 内置的一个高级类型，它可以取到函数返回值的类型。但如果这个函数有多个重载呢？

**取重载函数的 ReturnType 返回的是最后一个重载的返回值类型。**

重载函数不是能通过函数交叉的方式写么，而我们又能实现联合转交叉。

所以就能拿到联合类型的最后一个类型

```ts
type UnionToIntersection<U> = 
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
        ? R
        : never

type UnionToFuncIntersection<T> = UnionToIntersection<T extends any ? () => T : never>;
```

这里简单讲一下：U extends U 是触发分布式条件类型，构造一个函数类型，通过模式匹配提取参数的类型，利用函数参数的逆变的性质，就能实现联合转交叉。

因为函数参数的类型要能接收多个类型，那肯定要定义成这些类型的交集，所以会发生逆变，转成交叉类型。

然后是 UnionToFuncIntersection 的类型：

我们对联合类型 T 做下处理，用 T extends any 触发分布式条件类型的特性，它会把联合类型的每个类型单独传入做计算，最后把计算结果合并成联合类型。把每个类型构造成一个函数类型传入。

这样，返回的交叉类型也就达到了函数重载的目的：

然后再通过 ReturnType 取返回值的类型，就取到了联合类型的最后一个类型：

取到最后一个类型后，再用 Exclude 从联合类型中把它去掉，然后再同样的方式取最后一个类型，构造成元组类型返回，这样就达到了联合转元组的目的：

```ts
type UnionToTuple<T> = 
    UnionToIntersection<
        T extends any ? () => T : never
    > extends () => infer ReturnType
        ? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
        : [];
```

类型参数 T 为待处理的联合类型。

T extends any 触发了分布式条件类型，会把每个类型单独传入做计算，把它构造成函数类型，然后转成交叉类型，达到函数重载的效果。

通过模式匹配提取出重载函数的返回值类型，也就是联合类型的最后一个类型，放到数组里。

通过 Exclude 从联合类型中去掉这个类型，然后递归的提取剩下的。

### join

```ts
const res = join('-')('guang', 'and', 'dong');
```

有这样一个 join 函数，它是一个高阶函数，第一次调用传入分隔符，第二次传入多个字符串，然后返回它们 join 之后的结果。

比如上面的 res 是 guang-and-dong。

如果要给这样一个 join 函数加上类型定义应该怎么加呢？要求精准的提示函数返回值的类型。

```ts
declare function join<
    Delimiter extends string
>(delimiter: Delimiter):
    <Items extends string[]>
        (...parts: Items) => JoinType<Items, Delimiter>;
```

类型参数 Delimiter 是第一次调用的参数的类型，约束为 string。

join 的返回值是一个函数，也有类型参数。类型参数 Items 是返回的函数的参数类型。

返回的函数类型的返回值是 JoinType 的计算结果，传入两次函数的参数 Delimiter 和 Items。

这里的 JoinType 的实现就是根据字符串元组构造字符串，用到提取和构造，因为数量不确定，还需要递归。

所以 JoinType 高级类型的实现就是这样的：

```ts
type JoinType<
    Items extends any[],
    Delimiter extends string,
    Result extends string = ''
> = Items extends [infer Cur, ...infer Rest]
        ? JoinType<Rest, Delimiter, `${Result}${Delimiter}${Cur & string}`>
        : RemoveFirstDelimiter<Result>;
```

类型参数 Items 和 Delimiter 分别是字符串元组和分割符的类型。Result 是用于在递归中保存中间结果的。

通过模式匹配提取 Items 中的第一个元素的类型到 infer 声明的局部变量 Cur，后面的元素的类型到 Rest。

构造字符串就是在之前构造出的 Result 的基础上，加上新的一部分 Delimiter 和 Cur，然后递归的构造。这里提取出的 Cur 是 unknown 类型，要 & string 转成字符串类型。

如果不满足模式匹配，也就是构造完了，那就返回 Result，但是因为多加了一个 Delimiter，要去一下。

```ts
type RemoveFirstDelimiter<
    Str extends string
> = Str extends `${infer _}${infer Rest}`
        ? Rest
        : Str;
```

### DeepCamelize

Camelize 是 guang-and-dong 转 guangAndDong，这个我们上节实现过。现在要求递归的把索引类型的 key 转成 CamelCase 的。

```ts
type DeepCamelize<Obj extends Record<string, any>> =
    Obj extends unknown[]
        ? CamelizeArr<Obj>
        : {
            [Key in keyof Obj
                as Key extends `${infer First}_${infer Rest}`
                    ? `${First}${Capitalize<Rest>}`
                    : Key
            ] : DeepCamelize<Obj[Key]>
        };
```

类型参数 Obj 为待处理的索引类型，约束为 Record<string, any>。

判断下是否是数组类型，如果是的话，用 CamelizeArr 处理。

否则就是索引类型，用映射类型的语法来构造新的索引类型，Key 为之前的 Key，也就是 Key in keyof Obj，但要做一些变化，也就是 as 重映射之后的部分。

这里的 KebabCase 转 CamelCase 就是提取 _ 之前的部分到 First，之后的部分到 Rest，然后构造新的字符串字面量类型，对 Rest 部分做首字母大写，也就是 Capitialize。

值的类型 Obj[Key] 要递归的处理，也就是 `DeepCamelize<Obj[Key]>`。

其中的 CamelizeArr 的实现就是递归处理每一个元素：

```ts
type CamelizeArr<Arr> = Arr extends [infer First, ...infer Rest]
    ? [DeepCamelize<First>, ...CamelizeArr<Rest>]
    : []
```

通过模式匹配提取 Arr 的第一个元素的类型到 First，剩余元素的类型到 Rest。

处理 First 放到数组中，剩余的递归处理。

### AllKeyPath

拿到一个索引类型的所有 key 的路径。

这里需要遍历 Key，用映射类型的语法，然后要递归构造 path，最后取所有 key 的遍历结果。

```ts
type AllKeyPath<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: 
    Key extends string
      ? Obj[Key] extends Record<string, any>
        ? Key | `${Key}.${AllKeyPath<Obj[Key]>}`
        : Key
      : never
}[keyof Obj];
```

参数 Obj 是待处理的索引类型，通过 Record<string, any> 约束。

用映射类型的语法，遍历 Key，并在 value 部分根据每个 Key 去构造以它为开头的 path。

因为推导出来的 Key 默认是 unknown，而其实明显是个 string，所以 Key extends string 判断一下，后面的分支里 Key 就都是 string 了。

如果 Obj[Key] 依然是个索引类型的话，就递归构造，否则，返回当前的 Key。

我们最终需要的是 value 部分，所以取 [keyof Obj] 的值。keyof Obj 是 key 的联合类型，那么传入之后得到的就是所有 key 对应的 value 的联合类型。

### Defaultize

实现这样一个高级类型，对 A、B 两个索引类型做合并，如果是只有 A 中有的不变，如果是 A、B 都有的就变为可选，只有 B 中有的也变为可选。

**索引类型处理可以 Pick 出每一部分单独处理，最后取交叉类型来把处理后的索引类型合并到一起。**

```ts
type Defaultize<A, B> = 
    & Pick<A, Exclude<keyof A, keyof B>>
    & Partial<Pick<A, Extract<keyof A, keyof B>>>
    & Partial<Pick<B, Exclude<keyof B, keyof A>>>
```

Pick 出 A、B 中只有 A 有的部分，也就是去 A 中去掉了 B 的 key： Exclude<keyof A, keyof B>。

然后 Pick 出 A、B 都有的部分，也就是 Extract<keyof A, keyof B>。用 Partial 转为可选。

之后 Pick 出只有 B 有的部分，也就是 Exclude<keyof B, keyof A>。用 Partial 转为可选。

最后取交叉类型来把每部分的处理结果合并到一起。

## 逆变、协变、双向协变、不变

### 类型安全和型变

TypeScript 给 JavaScript 添加了一套静态类型系统，是为了保证类型安全的，也就是保证变量只能赋同类型的值，对象只能访问它有的属性、方法。

比如 number 类型的值不能赋值给 boolean 类型的变量，Date 类型的对象就不能调用 exec 方法。

这是类型检查做的事情，遇到类型安全问题会在编译时报错。

但是这种类型安全的限制也不能太死板，有的时候需要一些变通，比如子类型是可以赋值给父类型的变量的，可以完全当成父类型来使用，也就是“型变（variant）”（类型改变）。

这种“型变”分为两种，一种是子类型可以赋值给父类型，叫做协变（covariant），一种是父类型可以赋值给子类型，叫做逆变（contravariant）。

#### 协变（covariant）

其中协变是很好理解的，比如我们有两个 interface：

```ts
interface Person {
    name: string;
    age: number;
}

interface Guang {
    name: string;
    age: number;
    hobbies: string[]
}
```

这里 Guang 是 Person 的子类型，更具体，那么 Guang 类型的变量就可以赋值给 Person 类型：

```ts
let person: Person = {
    name: '',
    age: 20
}

let guang: Guang = {
    name: 'guang',
    age: 20,
    hobbies: ['play game','writing']
}

person = guang
```

这并不会报错，虽然这俩类型不一样，但是依然是类型安全的。

这种子类型可以赋值给父类型的情况就叫做协变。

#### 逆变（contravariant）

我们有这样两个函数：

```ts
let printHobbies: (guang: Guang) => void;

printHobbies = (guang) => {
    console.log(guang.hobbies);
}

let printName: (person: Person) => void;

printName = (person) => {
    console.log(person.name);
}
```

printHobbies 的参数 Guang 是 printName 参数 Person 的子类型。

那么问题来了，printName 能赋值给 printHobbies 么？printHobbies 能赋值给 printName 么？

```ts
printHobbies = printName
printName = printHobbies // [!code error]
```

printName 的参数 Person 不是 printHobbies 的参数 Guang 的父类型么，为啥能赋值给子类型？

因为这个函数调用的时候是按照 Guang 来约束的类型，但实际上函数只用到了父类型 Person 的属性和方法，当然不会有问题，依然是类型安全的。

这就是逆变，函数的参数有逆变的性质（而返回值是协变的，也就是子类型可以赋值给父类型）。

那反过来呢，如果 printHoobies 赋值给 printName 会发生什么？

因为函数声明的时候是按照 Person 来约束类型，但是调用的时候是按照 Guang 的类型来访问的属性和方法，那自然类型不安全了，所以就会报错。

但是在 ts2.x 之前支持这种赋值，也就是父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”。

但是这明显是有问题的，不能保证类型安全，所以之后 ts 加了一个编译选项 strictFunctionTypes，设置为 true 就只支持函数参数的逆变，设置为 false 则是双向协变。

#### 不变（invariant）

非父子类型之间不会发生型变，只要类型不一样就会报错：

```ts
interface Dong {
    name: string;
    sex: boolean
}

let dong: Dong = {
    name: 'dong',
    sex: true
}

guang = dong // [!code error]
```

#### 类型父子关系的判断

像 java 里面的类型都是通过 extends 继承的，如果 A extends B，那 A 就是 B 的子类型。这种叫做名义类型系统（nominal type）。

而 ts 里不看这个，只要结构上是一致的，那么就可以确定父子关系，这种叫做结构类型系统（structual type）。
