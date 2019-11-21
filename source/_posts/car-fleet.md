---
title: 算法 - 853. 车队
date: 2019.11.21
tags:
 - algorithm
categories:
 - 前端
---

## 题目
`N` 辆车沿着一条车道驶向位于 `target` 英里之外的共同目的地。
每辆车 `i` 以恒定的速度 `speed[i]` （英里/小时），从初始位置 `position[i]` （英里） 沿车道驶向目的地。
一辆车永远不会超过前面的另一辆车，但它可以追上去，并与前车以相同的速度紧接着行驶。
此时，我们会忽略这两辆车之间的距离，也就是说，它们被假定处于相同的位置。
车队 是一些由行驶在相同位置、具有相同速度的车组成的非空集合。注意，一辆车也可以是一个车队。
即便一辆车在目的地才赶上了一个车队，它们仍然会被视作是同一个车队。
会有多少车队到达目的地?

示例：

>输入：target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
输出：3
解释：
从 10 和 8 开始的车会组成一个车队，它们在 12 处相遇。
从 0 处开始的车无法追上其它车，所以它自己就是一个车队。
从 5 和 3 开始的车会组成一个车队，它们在 6 处相遇。
请注意，在到达目的地之前没有其它车会遇到这些车队，所以答案是 3。

提示：

>0 <= N <= 10 ^ 4
0 < target <= 10 ^ 6
0 < speed[i] <= 10 ^ 6
0 <= position[i] < target
所有车的初始位置各不相同。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/car-fleet
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 解题

### 思路

- 数据零散
`位置`和`速度`过于分散，不利于操作和后期扩展，需要合并数据。
解决方法是，自定义两个数据结构：`车`和`车队`
- 是否同个车队
另外题中一个核心点是：如何判断两车是否属于同一个车队？
解析为：两车会车位置是否在目标位置范围内？
- 复习排序算法
排序算法题，不用自带的sort，顺便复习下插入排序

#### 车
```js
/**
 * Define Data Type
 * @name Car 车
 * @type {Object}
 * @property {Number} position 初始位置（英里）
 * @property {Number} speed 速度（英里/小时）
 */
const car = {
  position: 10,
  speed: 1,
};
```
#### 车队
```js
/**
 * Define Data Type
 * @name Fleet 车队
 * @type {Car[]}
 */
const fleet = [
  {
    position: 10,
    speed: 1,
  },
];
```

#### 是否同个车队
提供一个函数，获取两车会车时的位置
```js
/**
 * 获取两车会车时的位置（后车追赶前车）
 * 前提条件：前车位置 > 后车位置
 * @param {Car} car1 前车
 * @param {Car} car2 后车
 * @return {Number} 会车位置，-1为会车失败
 */
const getMeetPosition = (car1, car2) => {
  // 会车失败
  if (car1.speed >= car2.speed) return -1;
  const diffPosition = car1.position - car2.position;
  const diffSpeed = car2.speed - car1.speed;
  // 会车需要时间
  const meetHour = diffPosition / diffSpeed;
  // 返回会车时的位置
  return car1.speed * meetHour + car1.position;
};
```

### 答题

不考虑耗内存情况下，最大程度还原开发思路
```js
/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
const carFleet = (target, position, speed) => {
  const getMeetPosition = (car1, car2) => {
    if (car1.speed >= car2.speed) return -1;
    const diffPosition = car1.position - car2.position;
    const diffSpeed = car2.speed - car1.speed;
    const meetHour = diffPosition / diffSpeed;
    return car1.speed * meetHour + car1.position;
  };
  // 车列表：[Car, Car]
  const cars = position.map((item, index) => ({
    position: item,
    speed: speed[index],
  }));
  const carsLength = cars.length;
  // 车列表：position降序排序：插入排序
  for (let i = 1; i < carsLength; i += 1) {
    for (let j = i; j > 0; j -= 1) {
      if (cars[j - 1].position < cars[j].position) {
        const temp = cars[j];
        cars[j] = cars[j - 1];
        cars[j - 1] = temp;
      }
    }
  }
  // 车队列表：[Fleet, Fleet]
  const fleets = [];
  for (const item of cars) {
    // 最近的车队
    const lastFleet = fleets[fleets.length - 1];
    if (!lastFleet) {
      fleets.push([item]);
      continue;
    }
    // 最近的车队里面最远的车
    const lastCar = lastFleet[0];
    const meetPosition = getMeetPosition(lastCar, item);
    // 终点前追上前车：并入车队
    if (meetPosition > 0 && meetPosition <= target) {
      lastFleet.push(item);
      continue;
    }
    // 终点前追不上前车：新的车队
    fleets.push([item]);
  }
  return fleets.length;
};
```

## 总结

- 通过定制数据结构，可以更好实现算法流程
- 复习插入排序，更了解熟悉其规律