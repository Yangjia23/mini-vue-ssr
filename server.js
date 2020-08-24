const Vue = require("vue");
const VueServerRender = require("vue-server-renderer");
const Koa = require("koa");
const Router = require("@koa/router");
const static = require("koa-static");
const fs = require("fs");
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);

const app = new Koa();
const router = new Router();
// const serverBundle = fs.readFileSync(resolve('./dist/server.bundle.js'), 'utf8')
// const serverTemplate = fs.readFileSync(resolve('./dist/index.ssr.html'), 'utf8')
// const render = VueServerRender.createBundleRenderer(serverBundle, {
//   template: serverTemplate
// })

// 通过 VueSSRServerPlugin 插件直接打包出 serverBundle 文件
const serverBundle = require("./dist/vue-ssr-server-bundle.json");
const serverTemplate = fs.readFileSync(
  resolve("./dist/index.ssr.html"),
  "utf8"
);
const clientManifest = require("./dist/vue-ssr-client-manifest.json");
const render = VueServerRender.createBundleRenderer(serverBundle, {
  template: serverTemplate,
  clientManifest, // 注入前端打包好的 js 文件
});

router.get("/(.*)", async (ctx) => {
  // 在 src/entry-server.js 导出的函数中可获取传递的 ctx.url
  try {
    ctx.body = await render.renderToString({ url: ctx.url });
  } catch (e) {
    if (e.code == 404) {
      ctx.body = "page not found";
    }
  }
});

app.use(static(resolve("./dist/")));
app.use(router.routes());
app.listen(4000);
