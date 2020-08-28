---
  sidebarDepth: 2
  pageClass: custom-page-class
---

## google浏览器插件

### 简单介绍
[中文文档](https://crxdoc-zh.appspot.com/extensions/getstarted)

> 扩展程序由一些文件（包括 HTML、CSS、JavaScript、图片以及其他任何您需要的文件）经过 zip 打包得到，为 Google Chrome 浏览器增加功能。  
> 扩展程序本质上是网页，它们可以利用浏览器为网页提供的所有 API，例如 XMLHttpRequest、JSON、HTML 5 等等。  
> 扩展程序可以通过内容脚本或跨站 XMLHttpRequest 与网页或者服务器交互，扩展程序也可以以编程方式与浏览器功能（例如书签和标签页交互）。  

### 前置知识

每一个拓展程序包含以下文件：
- 一个清单文件
- 一个或多个html文件
- 可选: 一个或多个js文件
- 可选: 拓展程序所需要的任何其他文件（图片等） 
* * *
* * * 

- [清单文件](https://crxdoc-zh.appspot.com/extensions/manifest)   
manifest.json，提供有关扩展程序的各种信息，例如最重要的文件和扩展程序可能具有的能力。
```json
{
  "name": "我的扩展程序",
  "version": "2.1",
  "description": "从 Google 获取信息。",
  "icons": { "128": "icon_128.png" },
  "background": {
    "persistent": false,
    "scripts": ["bg.js"]
  },
  "permissions": ["http://*.google.com/", "https://*.google.com/"],
  "browser_action": {
    "default_title": "",
    "default_icon": "icon_19.png",
    "default_popup": "popup.html"
  }
}
```
- [后台网页](https://crxdoc-zh.appspot.com/extensions/background_pages)   
background.html 它是一个包含着拓展程序主要逻辑的不可见页面，当你在manifest.json中指定了background，就会有一个后台页面存在着。
```json
"background": {
  "scripts": ["background.js"], // 与page二选一
  "page": "background.html", // 可以不指定
  "persistet": "true"
}
```
scripts 和 page只需要指定一个。如果不指定page,只要有 background.js , 拓展也会自动生成一个background.html，引用这这个js。后台网页或者说background.js，可以看做整个拓展的幕后boss，他可以最先入场，最后退场，作为整个拓展的信息中心，跟拓展中各个页面或者脚本进行消息传递。

- **用户界面**  
扩展程序可以包含普通的 HTML 网页，用来显示扩展程序的用户界面。  
常见的页面有，点击拓展弹出来的那个小弹窗，包含一些菜单或者设置，这就是一个html页面。  
另外的特殊页面是[替代页面](https://crxdoc-zh.appspot.com/extensions/override)，使用来自扩展程序中的 HTML 文件替换 Google Chrome 默认提供页面的方式。 
最后，你可以使用 tabs.create 或 window.open() 来显示扩展程序中的任何其他 HTML 文件。 
当然，你也可以使用 tabs.create 或 window.open() 来打开其他网站。

- [内容脚本](https://crxdoc-zh.appspot.com/extensions/content_scripts)  
content script可能是整个拓展里跟background.js同等重要的东西。所谓内容脚本，就是在网页的上下文中运行的js。
比如说某些拓展，它的功能是获取页面中的图片或者改变文字大小，那么这个拓展的内容脚本就需要注入到目标网站中，并在目标网站的上下文中运行。content script它可以通过标准的DOM来获取目标网页详情甚至改变网页DOM(这就提供了很多可能)。
如果说目标网页是你自己开发的话，content script甚至可以跟网页js通信，以达到更强大的效果。   
当然内容脚本不是万能的，它也由着一些使用上的限制。只可以调用部分api,不能使用所属扩展程序页面中定义的变量或函数，也不能使用网页或其他内容脚本中定义的变量或函数。  
总的来说，可以这么总结content script:
  1.  content script 应当视作网页的一部分，但contentScript与网页又是相互隔离的。即可以理解为content script是在一个特殊环境中运行的，这个环境成为isolated world（隔离环境）。 
  2.  content script 可以访问所注入页面的 DOM ,但是不能访问里面的任何 javascript 变量和函数。 
  3.  对每个 content script 来说，就像除了它自己之外再没有其它脚本在运行。 反过来也是成立的： 页面里的 javascript 也不能访问 content script 中的任何变量和函数。即使将参数直接赋值到 DOM 对象的属性上，只要不是 html 标准中定义的属性，就不能被另一个环境获取。

  
### 开发一个拓展

#### 需求
1.  假设这个拓展的主要作用是替代自己网站的登录、注册、忘记密码等功能。也就说，用户打开浏览器后自动弹出插件里的登录页面（或者注册、重置密码等），登录后关闭拓展页面跳到网站的登录后页面。
2.  如果用户从前登录过并信息没有失效，则直接跳转至网站登录后页面。
3.  用户从网站退出时，关闭网站页面，打开拓展里的登录页面。
4.  网站在遇到接口401的情况下，关闭网站页面，打开拓展里的登录页面。

*这个需求可以很好的将background.js - contentScript - 网页之间的通信联系起来，完成后对拓展的工作方式有了较好的理解。*

**首先去繁就简来分析需求：**  
1. 这个拓展要替代网站的登录页面，那么拓展的默认popup.html就满足不了需求了，拓展得有自己的用户页面。在这个页面里进行操作交互，接口请求，然后成功后可以打开网站的某个页面。
2. 登录过就直接跳转，则需要使用拓展的存储功能。并且拓展需要将存储的登录凭证(token)传递给网页js，好让网页js能使用token进行接口校验。
3. 退出则关闭网站页面并打开拓展页面，则说明网站js和拓展之间要通信。注意这里是网站主动发起通信，而需求2是拓展主动发起的，这两者不一样。

**然后提炼实现这些需求里的技术要点：**  
> 1. 拓展拥有一个登录的html， 至于是用纯html+js+css，还是使用框架然后打包成一个html都无所谓。拓展会默认加载popup.html,但是这个popup其实对用户来说是不存在的，只是作为跳板，打开我们真正需要的页面（login.html）。
> 2. 拓展要存储信息。拓展的存储有两种，一种是存储后随着chrome登录账户同步，一种是存储在浏览器本地（其他网页/拓展拿不到）。可以根据需求来使用哪种，本拓展使用本地存储就行了。
> 3. 除了存储，拓展还要把信息传递给网站的js。这里就需要拓展与网页的通信，background无法直接和网站js通信，但是可以和contentScript通信，而contentScript注入到网页页面，具备操作DOM的能力，这似乎就有了一条信息通路。
> 4. 网站还要可以主动传递信息给拓展。网站传递消息给拓展，有两种方式：如果你在manifest.json中指定了希望与之通信的网站域名，则本来不存在的chrome.runtime对象会被挂在网页的window上，可以使用这个对象里的消息传递API来传递。然后在拓展里使用对应的监听来接受消息。（注意只能网页主动发给拓展，拓展无法直接发给网页）。另外的方式就是通过contentScript作为桥梁沟通网页和background.js.

上面的分析几乎没有API和代码，主要是为了厘清思路，知道了路的方向，怎么走就容易了。

那么，开始上代码：  

### 实现部分

#### 首先是manifest.json
```json
{
    "manifest_version": 2,
    "name": "xxx",
    "description": "chrome extension",
    "version": "0.0.1",
    "icons": {
        "16": "icon.png",
        "48": "icon.png",
        "128": "icon.png"
    },
    "background": {
        "scripts": ["background.js"],
        "persistet": "true"
    },
    // 允许直接发送消息给拓展的页面
    "externally_connectable": {
        "matches": ["http://www.xxxx.com/*"]
    },
    // 允许加载外部资源的地址
    "web_accessible_resources": [
        "https://xxx.alicdn.com"
    ],
    "content_scripts": [
        {
          "matches": ["http://www.xxxx.com/*"], // 内容脚本注入的目标网页
          "js": [
            "contentScript.js" // 内容脚本
        ],
        "run_at": "document_start" // 注入时机 document_start document_end document_idle(默认)
        }
      ],
    "options_page": "login.html",  // 供openOptionsPage方法使用
    // 拓展所拥有的权限
    "permissions": [
        "tabs",
        "storage",
        "webRequest",
        "http://*/*",
		    "https://*/*"
    ],
    // 浏览器行为（工具栏拓展的图标，默认弹窗等）
    "browser_action": {
        "default_popup": "popup.html",
        "default_icon": "icon.png",
        "default_title": "xxx"
    },
    // 引用外部资源的地址，否则无法通过scp。拓展的html同样有scp限制。
    "content_security_policy": "script-src 'self' https://xxx.alicdn.com 'unsafe-eval';  object-src 'self'"
}
```

这份清单指定了background.js、contentScript、 目标页面，有了这三者，信息就可以传动起来了。 

那么接下来先看 background.js：

#### background.js

```js
let at = undefined // access token
let rt = undefined // refresh token
let first = false
/**
* 当background.js 开始执行的时候，也就是浏览器打开的时候。如果没有登录信息，则直接打开登录页面
*/
function chromeStart () {
  first = true
  const at = window.localStorage.getItem('Access-Token') // 是否存储了登录信息，即判断是否曾经成功登录过
  if (at) {
     window.chrome.tabs.update({ url: 'https://www.xxxx.com/abc' }) // 登录信息在，则直接跳去目标页面
  } else {
    // 否则打开登录页面。注意：这里的openOptionsPage方法需要先在manifest.json里指定 options_page
    window.chrome.runtime.openOptionsPage(function () {
      console.log('启动浏览器时打开新标签，新标签是拓展里的login.html')
    })
  }
}
// 只在浏览器启动时执行一次
!first && chromeStart()

/**
* background 接受由content script传递的信息
* @param function
* @returns {*}
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('background 收到:', request, sender)
    const {
      accessToken,
      refreshToken,
      injected, // 表示content script已经注入网页
      clear // 表示 网页401/退出登录，需要清除插件存储里的token
    } = request
    if (accessToken && refreshToken) {
      at = accessToken
      rt = refreshToken
    }
    if (injected) {
      // 内容脚本已经注入，发送消息给内容脚本
      sendToContentScript({ accessToken: at, refreshToken: rt })
      sendResponse({ msg: '得知注入' })
    }
    if (clear) {
      window.localStorage.removeItem('Refresh-Token')
      window.localStorage.removeItem('Access-Token')
      at = null
      rt = null
      sendResponse({ msg: '已经删除token' })
      // chrome.tabs.update({ url: `chrome-extension://${chrome.runtime.id}/login.html` })
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length) {
          // 需要被关闭的标签页id
          const tabIds = tabs.reduce((acc, cur) => {
            if (cur.url.length && (cur.url.includes('www.xxxx.com'))) {
              acc.push(cur.id)
            }
            return acc
          }, [])
          console.log('tabIds ---', tabIds)
          // 关闭当前活动的并且url是目标页面的标签页
          chrome.tabs.remove(tabIds)
        }
      })
      // 打开拓展里的登录页
      chrome.runtime.openOptionsPage(function () {
        console.log('打开新标签')
      })
    }
    sendResponse({ greeting: '从background返回给你' })
  }
)

/**
* 将拓展登录页获取到的accessToken, refreshToken 传递给已注入网页的content script
* @param  { accessToken, refreshToken}
* @returns { * }
*/
function sendToContentScript ({
  accessToken,
  refreshToken
}) {
  console.log('background在得知contentscript注入后执行')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 获取当前的活动标签页，然后利用 chrome.tabs.sendMessage 将存储的登录信息传递给contentScript
      console.log('活动的tabs:', tabs)
      if (tabs[0] && tabs[0].id && accessToken && refreshToken) {
        chrome.tabs.sendMessage((tabs[0] && tabs[0].id) || null, { accessToken, refreshToken }, function(response) {
          console.log('background 收到：', response)
        })
      } else {
        console.log('不符合条件：', tabs[0], accessToken, refreshToken)
      }
    })
}

// // background 接收由网页端发送来的消息，只能被动接收，然后回应，不能主动发送消息给网页端
// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//     alert('收到了')
//     sendResponse('还给你')
//   }
// )
```

从background.js 中可以看到，它监听了来自contentScript的信息，根据contentScript里传递不同参数，来执行不同操作。同时它也发送了消息给contentScript，将登录信息告知。  
从前面可以知道，contentScript是要被注入到目标页面的，background -- contentScript -- 目标页面，可见contentScript作为桥梁的重要性。那么接下来看contentScript:

#### content script

```js
// content script 无法使用目标页面的变量、方法、window、 storage。 content script 与页面是相互独立的
// 注入目标页面即开始执行
// 通知background.js 已经注入页面
chrome.runtime.sendMessage({injected: true}, function(response) {
  // background 得知注入，并返回信息
  console.log(response)
})

// 接收由background 发送过来的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const {
    accessToken,
    refreshToken
  } = request
  // background传来了需要的信息，那么要想办法塞给目标页面
  if (accessToken && refreshToken) {
    const theScript = document.createElement('script') // 利用script标签，存进目标页面的localStorage
    theScript.type = 'text/javascript'
    const stamp = Date.now()
    theScript.innerHTML = `
        console.log('执行了')
        window.localStorage && window.localStorage.setItem('Access-Token', '${accessToken}');
        window.localStorage && window.localStorage.setItem('Refresh-Token', '${refreshToken}');
    `
    document.documentElement.appendChild(theScript)
    console.log('theScript ----', theScript)
    sendResponse('ok')
  }
})

// 监听来自网页端的消息 （401/logout）
window.addEventListener('message', function(event) {
  if (event.source == window && event.data.code) {
    if (event.data.code == '401') {
      chrome.runtime.sendMessage({clear: true}, function(response) {
        // background 得知需要删除token后，并返回信息
        console.log(response)
      })
    } else if ( event.data.code == 'logout' ) {
      // 退出登录了，拓展里的token也该清掉
      chrome.runtime.sendMessage({ clear: true }, function(response) {
        // background 得知需要删除token后，并返回信息
        console.log(response)
      })
    }
  }
})
```
重要的三部分已经完成了，background 和 contentScript 已经可以互相通信。  
整个流程是：  
**拓展登录页 -> 成功登录 -> 告知background -> background通知内容脚本并打开目标页面 -> 内容脚本将信息嵌入目标页面 -> 目标页面拿到信息成功登录**  
现在大部分的流程中间的流程已经通了，剩下的是头尾部分，头即在拓展的login.html里通知background.
```js
// 前面是登录接口验证等，在接口成功后
// 通知background
chrome.runtime.sendMessage({accessToken, refreshToken}, function(response) {
  // background返回信息后
  window.localStorage.setItem('Access-Token', accessToken) // 登录信息存储在拓展的localStorage
  window.localStorage.setItem('Refresh-Token', refreshToken)
  window.chrome.tabs.update({ url: 'https://www.xxxx.com/abc' }) // 打开目标页面
})
```

尾即在目标页面的某些时刻通知contentScript, 用的是postMessage  

```js
window.postMessage({
  code: 'logout',
  message: 'logout'
}, '*')
...
window.postMessage({
  code: '401',
  message: 'clearToken'
}, '*')
```

至此，全部流程基本走完，其实看下来，关键点还是background和contentScript间的通信。
最后用一张流程图结尾吧：

![流程图](https://pic.yupoo.com/leisurenana/1af36ec4/9d15d68f.png)