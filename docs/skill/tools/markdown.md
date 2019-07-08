---
sidebarDepth: 2
---

# markdown所常用的一些语法

## 1.块级元素

### 段落和换行

>段落就是连续行上的文本, 一个或多个空行划分不同的段落. (空行的含义就只要是看起来是空行就行了 -- 即使包含了 spaces 
>或者 等空白符也是空行.) 普通段落不应该使用缩进.  
>段落是由一行或多行连续文本组成的, 这条规则使得 Markdown 支持 "硬换行". 这个其他的文本到HTML转换器有很大不同 (包括 Movable Type 的 "Convert Line Breaks" 选项) , 通常这些转换器会将段落中的每个换行都转换为一个 `<br />` 标签.
>当你 确实需要 在 Markdown 中输入 `<br />` 标签, 只需要在行尾加上两个及以上的空格, 然后换行.  
>确实, 这样输入 `<br />` 麻烦了一点, 但是 "换行即 `<br />`" 的规则并不适用于 Markdown. 这时, 用硬换行来格式化 >Markdown 中 email 式的 blockquoting 以及多段落 list items 或许是更好的选择.

### 标题

>Markdown 支持两种形式的标题, [Setext] [1] 和 [atx] [2].
>Setext 样式的标题使用的等号来表示一级标题, 使用连字符表示二级标题. Setext 形式只支持 h1 和 h2 两种标题.例如:
```
This is an H1
=============

This is an H2
-------------
```
效果： 

>This is an H1
>=============

Atx 样式的标题每行开头使用 1-6 井号, 对应 1-6 级标题. 例如:
```
# This is an H1
#### This is an H4
###### This is an H6
```
效果：
># This is an H1
>#### This is an H4
>###### This is an H6

### 块引用

>Markdown 使用 email 样式的 > 字符作为块引用. 如果你熟悉 email 消息中的引用段落, 那么你同样可以在 Markdown 中创建块引用. 最好对引用文本采取强制换行并在每一行行首放一个 > :
>块引用可以嵌套 (例如, 块引用中包含块引用) , 只需添加额外层级的 > 即可:

```
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.
```
效果：

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

块引用可以包含 Markdown 元素, 包括标题, 列表和代码块:
```
> #### This is a header.
>
> 1.   This is the first list item.
> 2.   This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");
```
效果：
> #### This is a header.
>
> 1.   This is the first list item.
> 2.   This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

### 列表
>Markdown 支持有序列表和无序列表.
>无序列表使用星号, 加号, 和连字符 -- 这些符号是可互换的 -- 最为列表标记:
```
*   Red
*   Green
*   Blue
```
等价于：
```
+   Red
+   Green
+   Blue
```
以及：
```
-   Red
-   Green
-   Blue
```
效果：
>+   Red
>+   Green
>+   Blue

有序列表使用数字加句号:
```
1.  Bird
2.  McHale
3.  Parish
```
效果：
>1.  Bird
>2.  McHale
>3.  Parish

需要注意的是这里的数字序号对于最终生成 HTML 是没有影响的. 这里 Markdown 输出的 HTML 列表是:
```html
<ol>
<li>Bird</li>
<li>McHale</li>
<li>Parish</li>
</ol>
```

### 代码块

#### 三点式
> 与原来使用缩进来添加代码块的语法不同，这里使用 ` ``` ``` ` 来包含多行代码

```
<p>code here</p>
```

#### 空格式
>预格式化的代码块用于输出编程语言和标记语言. 不同于普通段落, 代码块中的行会被原样呈现. Markdown 会用 `<pre>` 和 `<code>` 标签包围代码块.
>要在 Markdown 中插入代码块, 只需要将每一行都缩进 4 个空格或者 1 个水平制表符. 例如, 下面的输入:

```
This is a normal paragraph:

   This is a code block.
```
Markdown 会生成:
```html
<p>This is a normal paragraph:</p>
<pre>
<code>This is a code block.</code>
</pre>
```
效果：
>This is a normal paragraph:
>
>     This is a code block.

#### 行内代码
> 可以通过 ``，插入行内代码
```
`<title>Markdown</title>`
```
效果：
> `<title>Markdown</title>`

### 水平线

>如果一行中只有三个以上的连字符, 星号, 或者下划线则会在该位置生成一个 <hr /> 标签. 星号和连字符之间的空格也是允许的. 下面的例子都会生成一条水平线:
```
* * *

***

*****

- - -

---------------------------------------
```
效果：
> ***

## 2.内联元素

### 链接
>Markdown 支持两种链接形式: 内联（行内式） 和 引用（参考式）.
>这两种形式下链接文本的定界符都是 [中括号].
>要创建内联链接, 只需在链接文本的右括号后面紧接一对圆括号. 圆括号里面放所需的 URL 链接, 还可以放一个 可选 的链接标题, 标题要用引号包围. 例如:

#### 行内式
```js
This is [an example](http://example.com/ "Title") inline link.
[This link](http://example.net/) has no title attribute.
```

将会生成：

```html
<p>This is <a href="http://example.com/" title="Title">
an example</a> inline link.</p>

<p><a href="http://example.net/">This link</a> has no
title attribute.</p>
```
效果：
>This is [an example](http://example.com/ "Title") inline link.
>[This link](http://example.net/) has no title attribute.

如果引用相同服务器下的本地资源, 还可以用相对路径:
```
See my [About](/about/) page for details.
```
#### 引用式
看这个[链接](http://xianbai.me/learn-md/article/syntax/links.html)吧


### 强调

> Markdown 将星号 (*) 和下划线 (_) 作为强调标记. 用 * 或者 _ 包裹的文本将会用 HTML `<em>` 标签包裹; 双 * 或
>者 _ 将会用 HTML `<strong>` 标签包裹. 例如, 下面的输入:

```
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
```
效果：
>*single asterisks*  
>_single underscores_  
>**double asterisks**  
>__double underscores__  

### 图片
> 插入图片的语法和插入超链接的语法基本一致，只是在最前面多一个 !。也分为行内式和参考式两种。
#### 行内式
```
![GitHub](https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding")
```
> ![GitHub](https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding")
#### 参考式
```
![GitHub][github]
(要空一行滴~)
[github]: https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding"
```
![GitHub][github]

[github]: https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding"

#### 指定图片的显示大小
>Markdown 不支持指定图片的显示大小，不过可以通过直接插入<img />标签来指定相关属性：
```html
<img src="https://avatars2.githubusercontent.com/u/3265208?v=3&s=100" alt="GitHub" title="GitHub,Social Coding" width="50" height="50" />
```

## 3.其他
### 自动链接

> 使用 `<>` 包括的 URL 或邮箱地址会被自动转换为超链接：
```
<http://www.google.com/>  
<123@email.com>
```

><http://www.google.com/>  
><123@email.com>

该方式适合行内较短的链接，会使用 URL 作为链接文字。邮箱地址会自动编码，以逃避抓取机器人。