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

### Add

```ts
type Add<Num1 extends number, Num2 extends number> =
    [...BuildArray<Num1>,...BuildArray<Num2>]['length'];
```

构造两个数组，然后合并成一个，取 length。

比如 3 + 2，就是构造一个长度为 3 的数组类型，再构造一个长度为 2 的数组类型，然后合并成一个数组，取 length。

### Subtract

```ts
type Subtract<Num1 extends number, Num2 extends number> =
    BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
        ? Rest['length']
        : never;
```

类型参数 Num1、Num2 分别是被减数和减数，通过 extends 约束为 number。

构造 Num1 长度的数组，通过模式匹配提取出 Num2 长度个元素，剩下的放到 infer 声明的局部变量 Rest 里。

取 Rest 的长度返回，就是减法的结果。
