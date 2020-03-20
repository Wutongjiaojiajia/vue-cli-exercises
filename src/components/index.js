/*
*   自动注册global文件夹下的 .vue/.js 文件
*/

import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

//自动加载 global 目录下的 .vue/.js 结尾文件
const componentsContext = require.context(
    // 组件目录的相对路径
    './global',
    //是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /\.(vue|js)$/
);

componentsContext.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = componentsContext(fileName);
    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
        camelCase(
            // 剥去文件名开头的 `./` 和结尾的扩展名
            fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
        )
    )
    // 全局注册组件
    Vue.component(
        // 首字母大写
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
});