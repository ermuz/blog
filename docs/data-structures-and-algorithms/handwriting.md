# 手动实现

## Operation(操作符)

### new

使用构造函数创建实例对象

#### 调用示例

```js
new Array(1);
new Date();
```

#### 分析

 `new` 调用的过程：

1. 首先创建一个空对象
2. 设置原型，将对象的原型设置为函数的 `prototype` 对象
3. 让函数的 `this` 指向这个对象，执行构造函数的代码
4. 判断函数返回值的类型，如果是值类型，返回创建的对象；如果是引用类型，就返回这个引用类型的对象

#### 实现

```js
function _new (){
    // 获取首个参数，即 new Array() => constructor === Array
    const constructor = Array.prototype.shift.call(arguments);
    // 类型判断，非函数类型，无法使用 new
    if(typeof constructor !== 'function'){
        throw TypeError(`${constructor} is not a constructor`);
    }
    // 1.2 以 constructor.prototype 为原型新建一个空对象
    const newObj = Object.create(constructor.prototype);
    // 3 执行构造函数
    const res = constructor.apply(newObj,arguments);
    // 4 如果函数返回值为引用类型，则返回这个函数返回值(res)；否则，返回 newObj
    return ['function','object'].includes(typeof res) ? res : newObj;
}
```

### instanceof

判断左边的原型是否存在于右边的原型链中

#### 调用示例

```js
Array instanceof Function;

const o = {};
o instanceof Object
```

#### 分析

1. 获取左侧的原型
2. 获取右侧的原型
3. 一直循环判断左侧的原型是否等于右侧的原型，直到左侧为 `null`，即达到原型链尽头

#### 实现

```js
function _instanceof(left,right){
    // 1
    let proto = left.__proto__;
    // 2
    let protoType = right.prototype;

    // 3
    while(proto !== protoType){
        proto = proto.__proto__;
        if(!proto) return false;
    }

    return true
}

```

## Array

## Function

## Object
