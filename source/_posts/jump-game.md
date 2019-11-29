---
title: 算法 - 55. 跳跃游戏
date: 2019.11.28
tags:
 - algorithm
categories:
 - 前端
---

## 题目
给定一个非负整数数组，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个位置。

示例 1:
>输入: [2,3,1,1,4]
输出: true
解释: 我们可以先跳 1 步，从位置 0 到达 位置 1, 然后再从位置 1 跳 3 步到达最后一个位置。

示例 2:
>输入: [3,2,1,0,4]
输出: false
解释: 无论怎样，你总会到达索引为 3 的位置。但该位置的最大跳跃长度是 0 ， 所以你永远不可能到达最后一个位置。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/jump-game
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 解题

### 思路

题目是判断是否能够到达最后一个位置？
最后一个位置取决于上一个位置能否到达，上一个位置又取决于上上个位置能否到达，以此类推，可以先求出每一个位置能否到达？

#### 例子思路

原数据：`[1,2,1,1,0]`
初始化到达元素：`[true]`
第`0`个元素：`1`,`到达`,`[true, true]`
第`1`个元素：`2`,`到达`,`[true, true, true, true]`
第`2`个元素：`1`,`到达`,`[true, true, true, true]`
第`3`个元素：`1`,`到达`,`[true, true, true, true, true]`
第`4`个元素：`1`,`到达`,`[true, true, true, true, true]`, 结束，返回最后一个元素状态为 `true`

### 答题

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
const canJump = (nums) => {
  if (nums.length <= 1) return true;
  const length = nums.length;
  // 每个位置是否到达目的地
  const enabled = [true];
  for (let i = 0; i < length; i += 1) {
    if (!enabled[i]) return false;
    const num = nums[i];
    // 按照最大长度求出后续可达到的位置
    for (let j = 1; j <= num; j += 1) {
      enabled[i + j] = true;
    }
  }
  return true;
};
```

### 优化

上述思路借用了数组实现，但是在大数组下，过于消耗内存。
优化：去除数组，考虑范围判断，使用新变量最大可达到位置来作为判断依据（贪心算法）

### 答题

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
const canJump = (nums) => {
  if (nums.length <= 1) return true;
  const length = nums.length;
  // 最大可到达位置
  let maxPosition = 0;
  for (let i = 0; i < length; i += 1) {
    // 当前位置超过最大可到达位置，返回 false
    if (i > maxPosition) return false;
    const newPosition = i + nums[i];
    // 新可到达位置超过数组长度，返回 true
    if (newPosition >= length - 1) return true;
    // 更新最大可达到位置
    if (newPosition > maxPosition) maxPosition = newPosition;
  }
};
```

## 总结

- 利用基本思路完成算法，再优化其中耗时耗内存的地方
- 贪心算法：尽可能找到最短路径