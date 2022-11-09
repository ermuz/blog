# 函数

## bind

用于改变函数 `this` 的指向，并返回一个函数

### 调用示例

``` js
let obj = {
  msg: 'JoJo'
}
function foo(msg){
  console.log(msg + '' + this.msg)
}
let f = foo.bind(obj)
f('hello') // hello JoJo

```

### 分析

1. 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 保存当前函数的引用，获取其余传入参数值。
3. 创建一个函数返回
4. 函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用, 其余情况都传入指定的上下文对象。

### 实现

```js
Function.prototype._bind = function(){
    // 1
    if(typeof this !== "function") {
        throw TypeError(`${this}.bind is not a function`)
    }
    // 2
    const that = this;
    const [obj, ...otherArg] = [...arguments];

    // 3
    return function Fn(){
        const arg = [...arguments];
        // 4
        return that.apply(
            // 首次调用使用传入的 obj，首次的 this 不是 Fn，首次返回的是Fn
            // 二次调用时由于首次返回的是Fn，因此this继续沿用首次的对象
            this instanceof Fn ? this: obj,
            otherArg.concat(arg)
        )
    }
}
```

## call

用于改变函数 `this` 指向，并执行函数

### 分析

1. 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
3. 处理传入的参数，截取第一个参数后的所有参数。
4. 将函数作为上下文对象的一个属性。
5. 使用上下文对象来调用这个方法，并保存返回结果。
6. 删除刚才新增的属性。
7. 返回结果。

### 实现

```js
Function.prototype._call = function(){
    // 1
    if(typeof this !== "function") {
        throw TypeError(`${this}.call is not a function`)
    }
    // 2,3
    const [context = window, ...otherArg] = [...arguments];
    // 4
    context.fn = this;
    // 5
    const res = context.fn(...otherArg);
    // 6
    delete context.fn;
    // 7
    return res
}
```

## apply

用于改变函数 `this` 指向，并执行函数

### 分析

1. 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
3. 处理传入的参数，截取第一个参数后的所有参数。
4. 将函数作为上下文对象的一个属性。
5. 使用上下文对象来调用这个方法，并保存返回结果。
6. 删除刚才新增的属性。
7. 返回结果。

### 实现

```js
Function.prototype._apply = function(){
    // 1
    if(typeof this !== "function") {
        throw TypeError(`${this}.apply is not a function`)
    }
    // 2,3
    const [context = window, otherArg = []] = [...arguments];
    // 4
    context.fn = this;
    // 5
    const res = context.fn(...otherArg);
    // 6
    delete context.fn;
    // 7
    return res
}
```
