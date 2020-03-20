import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path:'*',
    redirect: 'home'
  }
];

//自动加载 router 目录下的 .js 结尾文件
const routerContext = require.context(
    // 组件目录的相对路径
    './',
    // 是否查询其子目录
    true,
    // 匹配文件名
    /\.js$/
);

routerContext.keys().forEach(route => {
    if(route.startsWith('./index')){
      return;
    }
    const routerModule = routerContext(route);
    // 兼容import export 和 require module.exports 两种规范
    routes = [...routes, ...(routerModule.default || routerModule)];
});

export default new Router({
  mode:'hash',
  routes:routes
})
