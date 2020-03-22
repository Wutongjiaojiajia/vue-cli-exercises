const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(chalk.green(`${message}`));
const successLog = message => console.log(chalk.blue(`${message}`));
const errorLog = error => console.log(chalk.red(`${error}`));
const { vueTemplate } = require('./template');

// 生成文件
const generateFile = (path,data) => {
  return new Promise((resolve,reject)=>{
        if(fs.existsSync(path)){
            reject(`${path}文件已经存在`);
        }
        fs.writeFile(path,data,'utf8',err=>{
            if(err){
                reject(err.message);
            }else{
                resolve(true);
            }
        })
    })
}

// 拆分文件名以及路径
const splitFileNameAndPath = (name) => {
    let inputArr = name.split('/');
    let fileName = inputArr[inputArr.length - 1];
    if(!fileName.endsWith('.vue')){
      fileName += '.vue';
    }
    let filePathArr = inputArr.splice(0,inputArr.length - 1);
    let filePath = filePathArr.join('/');
    return [filePath,fileName];
}

log('请输入要生成的组件名称、如需生成全局组件，请加 global/ 前缀');

process.stdin.on('data', async chunk => {
    const inputName = String(chunk).trim().toString()
    const fileInfo = splitFileNameAndPath(inputName);
    /**
     * 组件目录路径
     */
    const componentDirectory = resolve('../src/components', fileInfo[0])

    /**
     * vue组件路径
     */
    const componentVueName = resolve(componentDirectory, `${fileInfo[1]}`)
    log(`正在生成 component 目录 ${componentDirectory}`)
    await dotExistDirectoryCreate(componentDirectory)
    try {
        log(`正在生成 vue 文件 ${componentVueName}`)
        await generateFile(componentVueName, vueTemplate(fileInfo[1]))
        successLog('生成成功')
    } catch (e) {
        errorLog(e)
    }

    process.stdin.emit('end')
})
process.stdin.on('end', () => {
    log('exit')
    process.exit()
})
function dotExistDirectoryCreate (directory) {
    return new Promise((resolve) => {
      mkdirs(directory,()=>{
        resolve(true)
      })
    })
}

// 递归创建目录
function mkdirs (directory, callback) {
    let exists = fs.existsSync(directory);
    if (exists) {
        callback()
    } else {
        mkdirs(path.dirname(directory),()=>{
            fs.mkdirSync(directory)
            callback()
        })
    }
}