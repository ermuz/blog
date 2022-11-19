# 浏览器缓存

## 什么是浏览器缓存

**浏览器缓存**（Browser Caching）是为了加速浏览，浏览器在用户磁盘上对请求过的文档进行存储，当访问者再次请求这个页面时，浏览器就可以从本地磁盘显示文档，这样就可以加速页面的阅览。

浏览器缓存有以下优点

1. 减少了冗余的数据传输、节省了网费
2. 减少服务器的负担、大大提升网站的性能
3. 加快了客户端加载网页的速度

## 浏览器缓存的分类

主要分为两类：**协商缓存** 和 **强缓存**，也被称为 **缓存协商** 和 **彻底缓存**。

浏览器在第一次请求发生后，再次请求时：

1. 浏览器会先获取该资源缓存的 `header` 信息，根据其中的 `Expires` 和 `Cache-Control` 判断是否命中 **强缓存** ，若命中则直接从缓存中获取资源，包括缓存的 `header` 信息，本次请求不会与服务器进行通信
2. 若没有命中 **强缓存**，浏览器会发送请求到服务器，该请求会携带首次请求返回的有关缓存的 `header` 字段信息(`Last-Modified`/`IF-Modified-Since`、`Etag`/`IF-None-Match`)，由服务器根据请求中的相关 `header` 信息来对比结果是否命中 **协商缓存** ，若命中，则服务器返回新的 `response header` 信息更新缓存中的对应 `header` 信息，但是不返回资源内容，它会告知浏览器可以直接从缓存获取；否则返回最新的资源内容

### 强缓存

**强缓存**是利用 `http` 的 `response header` 中的 `Expires` 或者 `Cache-Control` 两个字段来控制，用来表示资源的缓存时间。

#### Expires

该字段是 `http1.0` 时的规范，它的值为一个绝对时间的 `GMT` 的时间字符串，比如 `Expires: Mon,18 Oct 2066 23:59:59` 。这个时间代表这个资源的失效时间，在此时间之前，即命中缓存。这种方式有一个明显的缺点，由于时间时间是一个绝对时间，所以当服务器与客户端时间偏差较大，就会导致缓存混乱。

#### Cache-Control

`Cache-Control` 是 `http1.1` 是出现的 `header` 信息，主要利用该字段的 `max-age` 值进行判断，它是一个相对时间，例如 `Cache-Control:max-age=3600` ，代表着资源的有效期是 `3600` 秒。

除了 `max-age` 还有下面几个比较常用的设置值

- `public`: 客户端和服务器都可以缓存
- `privite`: 只有客户端可以缓存
- `no-cache`: 客户端缓存资源，但是是否缓存需要经过 **协商缓存** 来验证
- `no-store`: 不使用缓存

`Cache-Control` 与 `Expires` 可以在服务端配置同时启用，同时启用的时候 `Cache-Control` 优先级高。

### 协商缓存

**协商缓存** 就是交由服务器来确定缓存是否可用，所以客户端和服务端要通过某种标识来进行通信，从而让服务器判断资源是否可以缓存访问，这主要设计到下面两组 `header` 字段，这两组搭档都是 **成对** 出现的，即第一次请求的response头带上某个字段（`Last-Modified` 或 `Etag`），则后需要请求都会带上对应的请求字段（`If-Modified-Since` 或 `If-None-Match`），若response头没有 `Last-Modified` 或 `Etag` 字段，则请求头也不会有对应字段。

#### Last-Modify/If-Modify-Since

浏览器第一次请求一个资源的时候，服务器返回的 `header` 中会加上 `Last-Modify` ，`Last-modify` 是一个时间标识该资源的最后修改时间，例如 `Last-Modify: Thu,31 Dec 2037 23:59:59 GMT`。

当浏览器再次请求该资源时，请求头中会包含 `If-Modify-Since` ，该值为缓存之前返回的 `Last-Modify`。服务器收到 `If-Modify-Since` 后，根据资源的最后修改时间判断是否命中缓存。

**如果命中缓存，则返回 `304` ，并且不会返回资源内容，并且不会返回 `Last-Modify`**。

#### ETag/If-None-Match

与 `Last-Modify` `If-Modify-Since` 不同的是，`Etag` `If-None-Match` 返回的是一个校验码。`ETag` 可以保证每一个资源是唯一的，资源变化都会导致`ETag`变化。服务器根据浏览器上送的`If-None-Match`值来判断是否命中缓存。

与 `Last-Modified` 不一样的是，当服务器返回 `304 Not Modified` 的response时，由于 `ETag` response `header` 中还会把这个 `ETag` 返回，即使这个 `ETag` 跟之前的没有变化。

#### 为什么要有Etag

`HTTP1.1` 中 `Etag` 的出现主要是为了解决几个 `Last-Modified` 比较难解决的问题：

- 一些文件也许会周期性的更改，但是他的内容并不改变(**仅仅改变的修改时间**)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET；
- 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说1s内修改了N次)，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断(或者说UNIX记录MTIME只能精确到秒)；
- 某些服务器不能精确的得到文件的最后修改时间。

**`Last-Modified` 与 `ETag` 是可以一起使用的，服务器会优先验证 `ETag` ，一致的情况下，才会继续比对`Last-Modified`，最后才决定是否返回`304`**。

强缓存与协商缓存的区别可以用下表来表示：

缓存类型|获取资源形式|状态码|发送请求到服务器
:--:|:--:|:--:|:--:
强缓存|从缓存取|200（from cache）|否，直接从缓存取
协商缓存|从缓存取|304（Not Modified）|否，通过服务器来告知缓存是否可用

## 用户行为对缓存的影响

用户操作|Expires/Cache-Control|Last-Modied/Etag
:--:|:--:|:--:
地址栏回车|:white_check_mark:|:white_check_mark:
页面链接跳转|:white_check_mark:|:white_check_mark:
新开窗口|:white_check_mark:|:white_check_mark:
前进回退|:white_check_mark:|:white_check_mark:
F5刷新|:negative_squared_cross_mark:|:white_check_mark:
Ctrl+F5强制刷新|:negative_squared_cross_mark:|:negative_squared_cross_mark:
