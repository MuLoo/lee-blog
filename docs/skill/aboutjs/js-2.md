## 遇到的一些emmoji相关的问题

在项目里遇到一个问题，用户名里包含了emoji表情，但是个名字的展示长度是有限制的，超出部分用省略号代替

### 如果只是汉字、字母、数字

先不考虑emoji的情况，那么一行 `测试test1234`的宽度该怎么算？
汉字占2个宽度，数字和字母占一个宽度，那么假设要求超过5个汉字的宽度就省略号展示，则：
```js
function shortLongName (str, width = 5) {
  if (str.length < width * 2) return str
  let len = 0
  let cutBegin = 0
  // let cutEnd = 0;
  for (let i = 0; i < str.length; i++) {
    if (len > width * 2 && cutBegin === 0) {
      cutBegin = i
    }
    let c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  if (len > width * 2) {
    return str.slice(0, cutBegin) + '...'
  }
  return str
}

```
这里主要是`str.charCodeAt(i)`,得到这个汉字、数字、字母的unicode码，然后判断是在哪个区间，再加1个还是2个宽度就好了。

### 包含了emoji表情有什么不同

`😀 😁 😂 🤣 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾👪 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👨‍👩‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👩‍👦 👩‍👧 👩‍👧‍👦 👩‍👦‍👦 👩‍👧‍👧 👨‍👦 👨‍👧 👨‍👧‍👦 👨‍👦‍👦 `

`"😀".length` 是 2  
`"👨‍👩‍👧".length` 是 8  
`"👩‍👩‍👦‍👦".length` 是 11  

一个emoji表情应该也是属于一个字符，占据着Unicode的一个码点，但是为什么他们长度却不同
> Unicode 包含一个系统，可以合并多个编码点，动态组合字符。此系统用各种方式增加灵活性，而不引起编码点的巨大组合膨胀。即组合字符
[参考这里](https://juejin.im/post/5c00b31a5188251d9e0c4a59)

总之，各个不同表情的length是不同的，想通过length来判断字符宽度是行不通了。
而且`👩‍👩‍👦‍👦`这个表情长度有11，如果随意切割了几位，页面上这个表情就无法正常显示，是个乱码符号。
那么就需要把`😀 😁 😂 👨‍👧‍👦 👨‍👦‍👦`都当做长度1（或2）的普通字符来计算真正的宽度

[这里](https://github.com/YingshanDeng/EmojiCharString)是个判断emoji长度的工具，主要处理方式如下：
```js
// 处理包含emoji的字符串
const astralRange = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
class EmojiCharString {
  constructor (string) {
    if (typeof string !== 'string') {
      throw new Error('Input must be a string')
    }
    this._string = string
    this._match = string.match(astralRange) || []
  }
  get length () {
    return this._match.length
  }

  toString () {
    return this._string
  }

  /**
   * Reverse the string in place
   * @return {[String]} [The reversed string]
   */
  reverse () {
    return this._match.reverse().join('')
  }

  /**
   * The substring() method returns a subset of a string between begin index and end index
   * @param  {Number} begin [begin index]
   * @param  {Number} end   [end index]
   * @return {[String]}     [A new string containing the extracted section of the given string.]
   */
  substring (begin = 0, end) {
    let strLen = this.length
    let indexStart = (parseInt(begin, 10) || 0) < 0 ? 0 : (parseInt(begin, 10) || 0)
    let indexEnd
    if (typeof end === 'undefined') {
      indexEnd = strLen
    } else {
      indexEnd = (parseInt(end, 10) || 0) < 0 ? 0 : (parseInt(end, 10) || 0)
    }

    if (indexStart > strLen) { indexStart = strLen }
    if (indexEnd > strLen) { indexEnd = strLen }

    if (indexStart > indexEnd) {
      [indexStart, indexEnd] = [indexEnd, indexStart]
    }
    return this._match.slice(indexStart, indexEnd).join('')
  }

  /**
   * The substr() method return the characters in a string beginning at the specified location through the specified number of characters.
   * @param  {Number} begin [Location at which to begin extracting characters]
   * @param  {Number} len   [The number of characters to extract]
   * @return {[String]}     [A new string containing the extracted section of the given string]
   */
  substr (begin = 0, len) {
    let strLen = this.length
    let indexStart = parseInt(begin, 10) || 0
    let indexEnd
    if (indexStart >= strLen || len <= 0) {
      return ''
    } else if (indexStart < 0) {
      indexStart = Math.max(0, indexStart + strLen)
    }

    if (typeof len === 'undefined') {
      indexEnd = strLen
    } else {
      indexEnd = indexStart + (parseInt(len, 10) || 0)
    }

    return this._match.slice(indexStart, indexEnd).join('')
  }
}

```
也是根据正则判断是否处于emoji的unicode范围
现在可以把每个emoji表情当做一个单位的字符来处理了，剩下的判断长度，超出截断就好做了。
大概步骤：
1. const str1 = new EmojiCharString(str) 处理一下
2. 如果str.length < str1.length 说明有emoji表情
3. 对str1进行遍历,然后处理每个字符/汉字/emoji
```js
// 包含emoji
  for (let i = 0; i < emojiStr.length; i++) {
    if (len > 12 && cutBegin === 0) {
      cutBegin = i
    }
    let char = emojiStr.substring(i, i + 1) // 获取到具体的某个表情或者字符
    const isEmoji = char.length > 1 // emoji的length都是大于1的，而单个字母、汉字length为1
    if (isEmoji) {
      len += char.length
    } else {
      const c = char.charCodeAt(0)
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++
      } else {
        len += 2
      }
    }
  }
  ```
  4. 剩下的就是判断len，超过限定的话，在cutBegin这里截断。注意这里的cutBegin是把emoji当一个长度处理后的起始位置。