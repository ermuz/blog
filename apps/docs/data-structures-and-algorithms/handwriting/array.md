# 数组

## 静态方法

### from

对一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。

```js
Array._from = function(arrayLike, mapFn, thisArg){

}
```

### isArray

用于确定传递的值是否是一个 Array

```js
Array._isArray = function(value){
    return value instanceof Array
}
```

## 原型方法

### at

```js
Array.prototype._at = function (index){
    if(index <= - 1) return this[this.length + index]
    return this[index]
}
```

### concat

```js
Array.prototype._concat = function (){
    const arr = [];
    for(let i = 0;i<this.length;i++){
        arr[i] = this[i]
    }
    let argumentsArr = [...arguments]
    let arr1 = argumentsArr.shift();
    let i = arr.length;
    while(arr1){
        if(Array.isArray(arr1) || arr1[Symbol.isConcatSpreadable]){
            for(let key in arr1){
                key !== 'length' && (arr[i++] = arr1[key])
            }
        }else{
            arr[i++] = arr1
        }
        arr1 = argumentsArr.shift()
    }
    return arr
}
```

### copyWithin

```js
Array.prototype._copyWithin = function (){
    const arr = [];
    for(let i = 0;i<this.length;i++){
        arr[i] = this[i]
    }
    let argumentsArr = [...arguments]
    let arr1 = argumentsArr.shift();
    let i = arr.length;
    while(arr1){
        if(Array.isArray(arr1) || arr1[Symbol.isConcatSpreadable]){
            for(let key in arr1){
                key !== 'length' && (arr[i++] = arr1[key])
            }
        }else{
            arr[i++] = arr1
        }
        arr1 = argumentsArr.shift()
    }
    return arr
}
```

### entries

返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对

### every

方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值

::: warning 备注
    若收到一个空数组，此方法在任何情况下都会返回 true。
:::

```js
Array.prototype._every = function (fn, thisArg) {
    // 空数组返回true
    let res = true, i = 0;
    // 长度以及结果判断
    while (i < this.length && res) {
        res = fn.call(thisArg, this[i], i, this)
        i++
    }
    return res
}
```

### filter

创建给定数组一部分的浅拷贝，其包含通过所提供函数实现的测试的所有元素。

```js
Array.prototype._filter = function (fn,thisArg) {
    const res = [];
    for(let i = 0;i<this.length;i++){
        if(fn.call(thisArg,this[i],i,this)){
            res.push(this[i])
        }
    }
    return res
};
```

### find

方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined

```js
Array.prototype._find = function (fn, thisArg) {
    let res = undefined;
    for (let i = 0; i < this.length; i++) {
        if (fn.call(thisArg, this[i], i, this)) {
            res = this[i];
            break;
        }
    }
    return res
};
```

### findIndex

返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

```js
Array.prototype._findIndex = function (fn, thisArg) {
    let res = -1;
    for (let i = 0; i < this.length; i++) {
        if (fn.call(thisArg, this[i], i, this)) {
            res = i;
            break
        }
    }
    return res
};
```

### findLast

返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

```js
Array.prototype._findLast = function (fn, thisArg) {
    let res = -1;
    for (let i = this.length - 1; i > -1; i--) {
        if (fn.call(thisArg, this[i], i, this)) {
            res = this[i];
            break;
        }
    }
    return res
};
```

### findLastIndex

返回数组中满足提供的测试函数条件的最后一个元素的索引。若没有找到对应元素，则返回 -1。

```js
Array.prototype._findIndex = function (fn, thisArg) {
    let res = -1;
    for (let i = this.length - 1; i > -1; i--) {
        if (fn.call(thisArg, this[i], i, this)) {
            res = i;
            break
        }
    }
    return res
};
```

### flat

按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
Array.prototype._flat = function (depth = 1) {
    if (depth <= 0) return this;
    let res = []
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i])) {
            res = res.concat(...this[i]._flat(depth - 1))
        } else {
            res.push(this[i])
        }
    }
    return res
};
```

```js
Array.prototype._flat = function (depth = 1) {
    if (depth <= 0) return this;
    return this.reduce((pre, next) => {
        return pre.concat(Array.isArray(next) ? next._flat(depth - 1) : next)
    }, [])
};
```

### flatMap

首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 连着深度值为 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。

### forEach

对数组的每个元素执行一次给定的函数。

```js
Array.prototype._forEach = function (fn, thisArg) {
    for(let i = 0; i < this.length; i++){
        fn.call(thisArg, this[i], i, this)
    }
};
```

### group

### groupToMap

### includes

用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。

```js
Array.prototype._includes = function (searchElement,fromIndex = 0){
    if(fromIndex < 0 ) fromIndex = this.length + fromIndex;
    while(fromIndex < this.length){
        if(this[fromIndex++] === searchElement) return true;
    }
    return false
}
```

### indexOf

返回在数组中可以找到给定元素的第一个索引，如果不存在，则返回 -1

```js
Array.prototype._indexOf = function (item){
    for(let i = 0;i<this.length;i++){
        if(this[i] === item) return i;
    }
    return -1
}
```

### join

方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串，用逗号或指定的分隔符字符串分隔。如果数组只有一个元素，那么将返回该元素而不使用分隔符。

```js
Array.prototype._join = function (separator = ','){
    if(this.length <= 1) return this.toString();
    let res= this[0] || '';
    for(let i = 1 ;i<this.length ;i++){
        res += separator + this[i] || '';
    }
    return res
}
```
