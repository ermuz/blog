# 真题

## leetcode

### 77 组合

#### 暴力搜索

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

#### 剪枝优化

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

### 216 组合总和 III

#### 暴力搜索

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

#### 剪枝优化

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

### 17 电话号码的字母组合

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

### 39 组合总和

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

### 40 组合总和 II

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

### 131 分割回文串

```js
var partition = function (s) {
    const res = [];
    if (s.length === 1) return [[s[0]]];
    const path = [];
    // 回文
    function isPalindrome (s, l, r) {
        for (let i = l, j = r; i < j; i++, j--) {
            if (s[i] !== s[j]) return false;
        }
        return true;
    }
    function backTracking (startIndex = 0) {
        if (startIndex === s.length) {
            res.push([...path])
        }
        for (let i = startIndex; i < s.length; i++) {
            if (!isPalindrome(s, startIndex, i)) continue;
            path.push(s.slice(startIndex, i + 1));
            backTracking(i + 1);
            path.pop()
        }
    }
    backTracking();
    return res;
};
```

### 93 复原IP地址

```js
var restoreIpAddresses = function (s) {
    // 剪枝 4*1<网段长度<4*3
    if (s.length <= 3 || s.length > 12) return [];
    // 只有四个，那就直接四个占位
    if (s.length === 4) return [s.split('').join('.')];
    const res = [], path = [];
    function backTracking (startIndex = 0) {
        if (startIndex === s.length) {
            res.push(path.join('.'));
            return;
        }
        // startIndex + 3 切割的长度大于3就就截止
        for (let i = startIndex; i < s.length && i < startIndex + 3; i++) {
            const cur = s.slice(startIndex, i + 1);
            // 剪枝操作
            if (
                // 字符串剩余的长度大于剩余网段的最大长度
                s.slice(i).length > (4 - path.length) * 3
                // 字符串剩余的长度小于剩余网段的最小长度
                || s.slice(i).length < 4 - path.length
                // 截取的网段大于255
                || cur > 255
                // 截取的网段以0开始
                || (cur.length > 1 && cur.startsWith('0'))
            ) {
                break;
            };
            path.push(s.slice(startIndex, i + 1));
            backTracking(i + 1);
            path.pop()
        }
    }
    backTracking();
    return res;
};
```

### 78 子集

```js
var subsets = function (nums) {
    const res = [], path = [];
    function backTracking (startIndex = 0) {
        res.push([...path])
        for (let i = startIndex; i < nums.length; i++) {
            path.push(nums[i]);
            backTracking(i + 1);
            path.pop();
        }
    }
    backTracking()
    return res;
};
```

### 90 子集 II

```js
var subsetsWithDup = function (nums) {
    nums.sort((a, b) => a - b);
    const res = [], path = [];
    function backTracking (startIndex = 0) {
        res.push([...path])
        for (let i = startIndex; i < nums.length; i++) {
            if (i > startIndex && nums[i] === nums[i - 1]) continue; // 只是增加去重，跟组合2类似 // [!code focus]
            path.push(nums[i]);
            backTracking(i + 1);
            path.pop();
        }
    }
    backTracking()
    return res;
};
```

### 491 递增子序列

```js
var findSubsequences = function (nums) {
    if (nums.length <= 1) return [];
    if (nums.length === 2 ) {
        if(nums[0] <= nums[1]) return [nums]
        return []
    };
    const res = [], path = [];
    function backTracking (startIndex = 0) {
        if (path.length > 1) {
            res.push([...path])
        }
        const s = new Set();
        for (let i = startIndex; i < nums.length; i++) {
            if (path[path.length - 1] > nums[i] || s.has(nums[i])) continue;
            s.add(nums[i])
            path.push(nums[i]);
            backTracking(i + 1);
            path.pop();
        }
    }
    backTracking()
    return res;
};
```

### 46 全排列

```js
var permute = function (nums) {
    if (nums.length === 1) return [nums]
    let res = [], path = [], used = [];

    function backTracking () {
        if (path.length === nums.length) {
            res.push([...path])
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used.includes(i)) continue;
            used.push(i);
            path.push(nums[i]);
            backTracking();
            path.pop();
            used.pop();
        }
    }
    backTracking();
    return res;
};
```

### 47 全排列 II

```js
var permuteUnique = function (nums) {
    if (nums.length === 1) return [nums]
    let res = [], path = [], used = [];

    function backTracking () {
        if (path.length === nums.length) {
            res.push([...path])
            return;
        }
        let set = new Set();
        for (let i = 0; i < nums.length; i++) {
            if (used.includes(i) || set.has(nums[i])) continue;
            set.add(nums[i]);
            used.push(i);
            path.push(nums[i]);
            backTracking();
            path.pop();
            used.pop();
        }
    }
    backTracking();
    return res;
};
```

### 51 N皇后 :star2::star2::star2:

```js
var solveNQueens = function (n) {
    const res = [], board = Array.from({ length: n }, () => Array.from({ length: n }, _ => '.'));

    function isValid (row, col) {
        // 列比较，只比较上边
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        // 左斜线
        for (let c = col - 1, r = row - 1; c >= 0 && r >= 0; r--, c--) {
            if (board[r][c] === 'Q') return false;
        }
        // 左斜线
        for (let c = col + 1, r = row - 1; c < n && r >= 0; c++, r--) {
            if (board[r][c] === 'Q') return false;
        }
        return true;
    }

    function backTracking (row = 0) {
        if (row === n) {
            let arr = [];
            board.forEach(item => {
                let s = '';
                item.forEach(sub => {
                    s += sub
                })
                arr.push(s);
            })
            res.push(arr);
            return;
        }
        for (let c = 0; c < n; c++) {
            if (isValid(row, c)) {
                board[row][c] = 'Q';
                backTracking(row + 1);
                board[row][c] = '.';
            }
        }
    }
    backTracking();
    return res;
};
```

### 52 N皇后 II :star2::star2::star2:

```js
var totalNQueens = function (n) {
    let res = 0, board = Array.from({ length: n }, _ => Array.from({ length: n }));

    function isValid (col, row) {
        for (let r = 0; r < row; r++) {
            if (board[r][col] === 'Q') return false;
        }
        for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
            if (board[r][c] === 'Q') return false;
        }
        for (let r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
            if (board[r][c] === 'Q') return false;
        }
        return true;
    }

    function backTracking (row = 0) {
        if (row === n) {
            res++;
            return;
        }
        for (let c = 0; c < n; c++) {
            if (!isValid(c, row)) continue;
            board[row][c] = 'Q';
            backTracking(row + 1);
            board[row][c] = '.';
        }
    }

    backTracking()

    return res;
};
```

### 60 排列序列  :star2::star2::star2:

```js
var getPermutation = function (n, k) {
    let res = '', path = [], c = 0;
    function backTracking (startIndex = 1) {
        if (startIndex === n + 1 && ++c === k) {
            res = path.join('');
            return;
        }
        for (let i = 1; i <= n && !res; i++) {
            if (path.includes(i)) continue;
            path.push(i);
            backTracking(startIndex + 1);
            path.pop();
        }
    }
    backTracking();
    return res;
};
```
