## 一些第三次内训中提到的语法点的代码示例
*主要以 token 手上有的一些项目里的代码作为示例*
*想让大家康康实际上这些东西用起来大概是怎样的*
*如果想看比较纯净的语法点示例，可以看看 JavaScript.info 里对应语法点的demo*
*另外这节课听完很懵逼某种意义上是很正常的*
*非常鼓励大家多多提问题/看文档*
<del>以及有些东西吧，用到再查也可以</del>
### Promise

暂时没有找到手头上工程中比较好的裸 Promise 用例，写一个凑凑数（

```JavaScript
const myPromise = new Promise((resolve,reject)=>{
    // Promise 参数的回调函数固定接受 resolve 和 reject 作为参数
    setTimeout(()=>{
        resolve("this promise is fullfilled."),
        3000
    })
    //延迟3s后 resolve
})
```

### Promise API(Promise.all) & async/await

#### 例一

此函数是从 ROP-Front-NEO 中摘录出来的，一个向后端发送请求，删除短信模板的函数
还没测过，可能有问题（

```JavaScript
import { uniFetch } from "../../utils/apiUtil";
//... 中间省略一大堆别的函数
async function deleteModels() {
    // chosenModel 是当前被选中的模板，是一个对象数组
    // uniFetch 见下文，它是一个被封装好的函数，返回一个Promise
    // 所以以下相当于对 chosenModel 中的每个元素制造一个 Promise
    // 调用 Promise.all 一次发送多个请求
    await Promise.all(// 这里有一个 await
      chosenModel.map((model) => {
        return uniFetch("/message/template?mid=" + model.id, { method: "DELETE" });
      })
    );
    setVisibility(false);// 忽略它
  }
```

#### 例二

此函数从新 BBS 前端里摘录
`asyncData` 是框架 API 之一（参数和作用时机不用理解）
`$axios` 是一个用来发请求的东西（其实就是 axios ，不附链接，深入了解不是必须的）

```JavaScript
async asyncData({ $axios, params, store }) {
    const nodeId = parseInt(params.nodeId) // 不用管
    store.commit('env/setCurrentNodeId', nodeId) // 不用管
    // 上面两行不重要，重点看下面
    const [node, topicsPage] = await Promise.all([
      $axios.get('/api/topic/node?nodeId=' + nodeId),
      $axios.get('/api/topic/topics?nodeId=' + nodeId),
    ])
    // 上面3行做的事情：发2个请求，在两个请求都 resolve （收到响应且无异常）后
    // 把请求获取的东西解构赋值（对，[node, topicsPage] 是一个解构赋值）给两个变量后返回
    return {
      node,
      topicsPage,
    }
  }
```

#### fetch & export

以下是在 ROP-Front-NEO 中 apiUtil.js 文件中的所有代码
这个文件做的事情：封装了一个 `uniFetch` 函数，之后工程内大部分的 `fetch` 操作都可利用这个函数进行
核心的请求部分在第 6 行，剩余部分可看可不看（
（据说）贡献者：gg

```JavaScript

const apiBaseUrl = "/api"; // for production environment
async function uniFetch(url, options) {
  options = options || {};
  const method = options.method || 'GET';
  const body = JSON.stringify(options.body) || undefined;
  // let it throw network (and CORS etc.) errors
  const response = await fetch(apiBaseUrl + url, {
    method,// 这里对象属性的键等于值的变量名，可以简写
    body,// 相当于 method:method,body:body
    headers: {
      'Content-Type': 'application/json'
    },
  });
  // request completed but response code not 200
  if (!response.ok) {
    // 补充： response 有可能不 OK（响应的HTTP状态码异常）
    // 也可以选择直接用catch处理（？）
    // unauthorized, jump to login page
    if (response.status === 401) {
      window.location.href = `https://passport.zjuqsc.com/login?redirect=${encodeURIComponent(window.location.href)}`;
    }
    let errMsg = null;
    if (response.status >= 400 && response.status < 500) {
      // if starting with 4, try to parse error message
      try {
        // try to get error data
        const { data } = await response.json();
        errMsg = { errMsg: data };
      } catch (e) {
        // on error, do thing and fallback to normal route
      }
    }
    if (errMsg) throw errMsg;
  }
  const json = await response.json();
  return json["data"];
}

export { apiBaseUrl, uniFetch };//在文件的末尾暴露函数

```

[使用例](####例一)

#### 附录
一个可能能在本次作业中派上用场的 `fetch`（（（

```JavaScript
fetch("http://localhost:9999/login", {
      method: "POST",
      body: JSON.stringify({
        id,
        name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
```
给不部署，手写裸 html 的同学：若是直接通过 file 协议打开 html 文件，那么把 `site` 的值改为 `"null"`是可行的。
