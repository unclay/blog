---
title: 
date: 2018.09.03
tags:
 - javascript
categories:
 - 前端
---

<!--more-->

# Typeof

[思考来源](https://yuchengkai.cn/docs/zh/frontend/#typeof)

## undefined 非保留关键字

有时候会拿 undefined 来判断，
但 undefined 非保留关键字，是可能被定义的。
```js
function hello() {
  var a;
  console.log(a === undefined); // true
  var undefined = 'hello world';
  console.log(a === undefined); // false
}
hello();
```
所以拿 `undefined` 来判断是不严谨的，一般都用 `void 0` 来判断，例如：

```js
var a;
console.log(a === void 0);
```

## void 是个什么东西

在了解 `void` 前，先简单测试下
```js
typeof void 0 // undefined
console.log(void 0) // undefined
Object.prototype.toString.call(void 0) // [object Undefined]
```

看起来没毛病，再试试这些呢？

```js
void 100
void hello()
void 'abc'
void true
```

以上全是 `undefined`，这样似乎也可以，但为啥就用了 `void 0`，`void` 到底是个什么东西？

### 看下规范怎么说
> [引用](http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.2)：void 操作符
>
> void UnaryExpression，流程如下:
+ 执行 UnaryExpression.
+ 回调 getValue.
+ 返回 undefined.
>
> PS: 必须调用GetValue，即使它的值未被使用，因为它可能具有可观察到的副作用。

无论如何，最后结果都返回 `undefined`，所以适合 `void 0 === undefined`

### 其他作用

执行函数
执行 UnaryExpression

https://segmentfault.com/a/1190000000474941
