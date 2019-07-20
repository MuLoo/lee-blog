---
  sidebarDepth: 2
  pageClass: custom-page-class
---

## Daily-Interview-Question（节选）

### 1. React/Vue 项目里为什么要在列表组件中写key ？

简要解析：

key的作用是更新组件时判断两个节点是否相同。相同就复用，不同则进行 销毁/创建 操作。
正是因为带唯一key时每次更新都不能找到可复用的节点，不但要销毁和创建vnode，在DOM里添加移除节点对性能的影响更大。所以在简单无状态组件的时候，不带key的组件能够复用，省去了销毁/创建组件的开销，同时只需要修改DOM文本内容而不是移除/添加节点，这就是如文档所说：
> 刻意依赖默认行为以获取性能上的提升

在实际应用中，带key虽然可以增加一些开销，但对用户来说几乎无法感知，而且能减少一些就地复用的副作用（没有过渡效果，状态错位等）  
> **详细讨论参考[这里](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)**

---

### 2. ['1', '2', '3'].map(parseInt) what & why ?

简要解析：

map函数的第一个参数是个callback
```
var new_array = arr.map(function callback(currentValue[, index[, array]]) { // Return element for new_array }[, thisArg])
```
这个callback接受三个参数，第一个表示当前被处理的元素，第二个是该元素的索引。
而parseInt用来解析字符串为指定`基数`的整数。`parseInt(string, radix)`

所以，运行情况如下：
- 1. parseInt('1', 0) // radix为0且string参数不以‘0x’或‘0’开头，则按照10进制为基数处理，返回 1
- 2. parseInt('2', 1) // 基数为1（1进制）表示的数中,最大值还不到2，无法解析，返回 nan
- 3. parseInt('3', 2) // 基数为2（2进制）表示的数中，最大值小于3，所以无法解析，返回NaN

故返回 [1, NaN, NaN]

> **详细讨论参考[这里](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4)**

---


