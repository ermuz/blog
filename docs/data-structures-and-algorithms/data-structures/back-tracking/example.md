# 真题

## leetcode 77 组合

### 暴力搜索

```js
function combine(n, k) {
    const res = [], path = [];
    function backTracking (n, k, startIndex) {
        if (path.length === k) {
            res.push([...path]);
            return;
        }
        for (let i = startIndex; i <= n ; i++) {
            path.push(i);
            backTracking(n, k, i + 1);
            path.pop()
        }
    }
    backTracking(n, k, 1);
    return res;
};
```

### 剪枝优化

来举一个例子，n = 4，k = 4的话，那么第一层for循环的时候，从元素2开始的遍历都没有意义了。 在第二层for循环，从元素3开始的遍历都没有意义了。

如图所示
![lc77-1](/data-structures-and-algorithms/data-structures/back-tracking/lc77-1.png)

图中每一个节点（图中为矩形），就代表本层的一个for循环，那么每一层的for循环从第二个数开始遍历的话，都没有意义，都是无效遍历。

所以，可以剪枝的地方就在递归中每一层的for循环所选择的起始位置。

如果for循环选择的起始位置之后的元素个数 已经不足 我们需要的元素个数了，那么就没有必要搜索了。

注意代码中i，就是for循环里选择的起始位置。

```js
for (int i = startIndex; i <= n; i++) {
```

接下来看一下优化过程如下：

1. 已经选择的元素个数：path.size();

2. 所需需要的元素个数为: k - path.size();

3. 列表中剩余元素（n-i） >= 所需需要的元素个数（k - path.size()）

4. 在集合n中至多要从该起始位置 : i <= n - (k - path.size()) + 1，开始遍历

为什么有个+1呢，因为包括起始位置，我们要是一个左闭的集合。

举个例子，n = 4，k = 3， 目前已经选取的元素为0（path.size为0），n - (k - 0) + 1 即 4 - ( 3 - 0) + 1 = 2。

从2开始搜索都是合理的，可以是组合[2, 3, 4]。

所以优化之后的for循环是：

```js
for (int i = startIndex; i <= n - (k - path.length) + 1; i++) // i为本次搜索的起始位置
```

优化后整体代码如下：

```js
function combine(n, k) {
    const res = [], path = [];
    function backTracking (n, k, startIndex) {
        if (path.length === k) {
            res.push([...path]);
            return;
        }
        for (let i = startIndex; i <= n - (k - path.length) + 1 ; i++) { // [!code focus]
            path.push(i);
            backTracking(n, k, i + 1);
            path.pop()
        }
    }
    backTracking(n, k, 1);
    return res;
};
```

## leetcode 216 组合总和 III

### 暴力搜索

```js
function combinationSum3(k, n) {
    const res = [], path = [];
    let sum = 0;
    function backTracking (startIndex = 1) {
        if (path.length === k ) {
            if (sum === n) res.push([...path])
            return;
        }
        for (let i = startIndex; i <= 9; i++) {
            sum += i;
            path.push(i);
            backTracking(i + 1);
            sum -= i;
            path.pop();
        }
    }
    backTracking();
    return res
};
```

### 剪枝优化

1. 知道k后我们就可以组装最大的等差数列，[xxx,7,8,9], 可以得到能得到的最大值，如果最大值小于n，没必要算，提前终结

    ```js
    // 等差数列 求数列和
    const max = ((9 - k) + 1 + 9) * k / 2;
    // 如果等差数列的最大值小于n，没必要往下了
    if (max < n) return res;
    ```

2. 如果 i > n - sum ，后面的一定比i大，提前终结
3. 列表中的数量少于需要的提前终结

    ```js
    for (let i = startIndex; i <= 9 - (k - path.length) + 1 && (n - sum); i++)
    ```

优化后整体代码如下：

```js
var combinationSum3 = function (k, n) {
    const res = [], path = [];
    // 等差数列 求数列和
    const max = ((9 - k) + 1 + 9) * k / 2; // [!code focus]
    // 如果等差数列的最大值小于n，没必要往下了
    if (max < n) return res; // [!code focus]
    let sum = 0;
    function backTracking (startIndex = 1) {
        // 如果
        if (path.length === k) {
            if (sum === n) res.push([...path])
            return;
        }
        for (let i = startIndex; i <= 9 - (k - path.length) + 1 && (n - sum); i++) { // [!code focus]
            sum += i;
            path.push(i);
            backTracking(i + 1);
            sum -= i;
            path.pop();
        }
    }

    backTracking();
    return res
};
```

```
18/18 cases passed (40 ms)
Your runtime beats 100 % of javascript submissions
Your memory usage beats 92.46 % of javascript submissions (40.8 MB)
```

## 17 电话号码的字母组合

```js
function letterCombinations (digits) {
    if (!digits) return [];
    const map = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    }
    if (digits.length === 1) return map[digits[0]].split('');
    const k = digits.length;
    const path = [], res = [];
    function backTracking (startIndex = 0) {
        if (path.length === k) {
            res.push(path.join(''))
            return;
        }
        const letters = map[digits[startIndex]];
        for (let i = 0; i < letters.length; i++) {
            path.push(letters[i]);
            backTracking(startIndex + 1);
            path.pop();
        }
    }

    backTracking();
    return res;
};
```

## 39 组合总和

```js
function combinationSum (candidates, target) {
    candidates.sort((a, b) => a - b);
    if (Math.min(candidates) > target) return [];
    const res = [], path = [];
    function backTracking (startIndex = 0, sum = 0) {
        if (sum === target) {
            res.push([...path]);
            return;
        }
        for (let i = startIndex; i < candidates.length; i++) {
            const cur = candidates[i];
            if (cur > (target - sum)) {
                break;
            }
            path.push(cur);
            sum += cur;
            backTracking(i, sum)
            path.pop();
            sum -= cur;
        }
    }
    backTracking()
    return res;
};
```

## 40 组合总和 II

```js
var combinationSum2 = function (candidates, target) {
    candidates.sort((a, b) => a - b);
    if (Math.min(candidates) > target) return [];
    const res = [], path = [];
    function backTracking (startIndex = 0, sum = 0) {
        if (sum === target) {
            res.push([...path]);
            return;
        }
        for (let i = startIndex; i < candidates.length; i++) {
            const cur = candidates[i];
            if (cur > (target - sum)) {
                break;
            }
            // 防止重复项 // [!code focus]
            if (i > startIndex && cur === candidates[i - 1]) { // [!code focus]
                continue; // [!code focus]
            } // [!code focus]
            path.push(cur);
            sum += cur;
            // 不相同 // [!code focus]
            backTracking(i + 1, sum); // [!code focus]
            path.pop();
            sum -= cur;
        }
    }
    backTracking()
    return res;
};
```
