1、 安装依赖

- vue-loader 解析 .vue 
- vue-template-compiler 解析 .vue 中的 template

- vue-style-loader， css-loader 解析css

- @babel/core, @babel/preset-env, babel-loader  解析 js

- webpack, webpack-cli, webpack-dev-server 打包工具

- html-webpack-plugin 提供 html 模版，将打包的js 、css  插入到模版中

- webpack-merge 合并webpack 配置


2、配置 client, server 打包配置
- client 入口
- server 入口

**客户端激活**: 将 server 打包的 html 字符串拼接 client 打包的 js 拼接一起返回 client 

3、如何将客户端 js 自动注入到 server 返回的 html 中

 在 client、server 打包配置中 引入 vue-server-render 插件
 ```js
 const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

 const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
 ```
 在 server.js 中自动注入前端js 文件
 ```js
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const serverTemplate = fs.readFileSync(resolve('./dist/index.ssr.html'), 'utf8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const render = VueServerRender.createBundleRenderer(serverBundle, {
  template: serverTemplate,
  clientManifest, // 注入前端打包好的 js 文件
})
 ```

4、路由切换
- 首屏通过服务端渲染，后面切换路由使用前端路由
- history 默认刷新抱 404

```js
// create-router.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = () => import('./components/Foo.vue')
const Bar = () => import('./components/Bar.vue')

export default () => {
  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/', component: Foo
      },
      {
        path: '/bar', component: Bar
      }
    ]
  })
  return router
}
```

server.js 服务端需要根据首屏访问路径，在服务端直接渲染好该路径对应的页面(页面可能是异步组件)，返回给浏览器
而后，页面上的切换走的都是前端的路由

router.push / router.onReady()

```js
export default (context) => {

  return new Promise((resolve, reject) => {
    const { app, router } = createApp();
    router.push(context.url) // 跳转到匹配的路径，该路径对应的组件可能是异步组件

    // 该回调会在异步组件解析完成之后执行
    router.onReady(() => {
      resolve(app) // 当异步组件渲染完成，返回实例 app
    }, reject)
  })
}
```

5、数据获取 axios, 可在 `Vuex` 中获取数据

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    state: {
      username: 'Bob'
    },
    mutations: {
      changeName (state, payload) {
        state.username = payload
      }
    },
    actions: {
      asyncChangeName ({commit}, payload) {
        return new Promise((resolve,reject)=>{
          setTimeout(() => {
            commit('changeName', payload)
            resolve();
          }, 3000);
        })
      }
    }
  })
  return store
}
```

当使用vuex 中，前端可通过 dispath 或 commit 等方法改变 vuex state 中的数据

如何在服务端执行更新数据的操作？

- 可以在页面级组件中定义 asyncData 方法，在该方法中修改数据，并返回 promise

在 router.onReady 回调中，可通过
  `const matchedComponents = router.getMatchedComponents() ` 获取当前路由匹配的组件数组

当匹配的数组长度 > 0 ，执行数组中每个组件对应的 asyncData 方法， 更新 store
长度 = 0, 返回 404
```js
router.onReady(() => {
  const matchedComponents = router.getMatchedComponents() //获取当前路由匹配的组件数组 
  if (matchedComponents.length) {
    // 调用对应组件的 asyncData
    Promise.all(matchedComponents.map(component => {
      if (component.asyncData) {
        return component.asyncData(store)
      }
    })).then(() => {
      resolve(app)
    }, reject)
  } else {
    reject({code: 404})
  }
}, reject)
```

但服务端虽然修改了数据，但 页面获取的还是 前端创建的 store 实例中的 state 数据
所以，需要将服务端修改的 state  同步到 前端 store 中

所有 asyncData 执行后，在 context 上挂载 state 属性

```context.state = store.state```

此时，返回的 html 中存在 ```window.__INITIAL_STATE__={"username":"Tom"}```

所以，我们在浏览器创建 store 时，可用服务端修改好的数据替换之前的默认数据

```js
if(typeof window !=='undefined' && window.__INITIAL_STATE__){
    store.replaceState(window.__INITIAL_STATE__)
}
```






