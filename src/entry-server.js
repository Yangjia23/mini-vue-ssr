import createApp from './app'
export default (context) => {

  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url)
    // 
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents() //获取当前路由匹配的组件数组 
      if (matchedComponents.length) {
        // 调用对应组件的 asyncData
        Promise.all(matchedComponents.map(component => {
          if (component.asyncData) {
            return component.asyncData(store)
          }
        })).then(() => {
          // 同步后端修改后的 state
          context.state = store.state

          resolve(app)
        }, reject)
      } else {
        reject({code: 404})
      }
    }, reject)
  })
  // console.log('context', context);
  
  // const { app } = createApp();
  // return app; // 将渲染实例导出即可
}
