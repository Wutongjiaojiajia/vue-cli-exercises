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
    let filePathArr = inputArr.splice(0,inputArr.length - 1);
    let filePath = filePathArr.join('/');
    return [filePath,fileName];
}

log('请输入要生成的页面组件名称，会生成在 views/目录下');

process.stdin.on('data', async chunk => {
    const inputName = String(chunk).trim().toString();
    const fileInfo = splitFileNameAndPath(inputName);
    let fileName = "";
    if(!fileInfo[1].endsWith('.vue')){
        fileName = `${fileInfo[1]}.vue`;
    }
    /**
     * 组件目录路径
     */
    const viewDirectory = resolve('../src/views', fileInfo[0]);

    /**
     * vue组件路径
     */
    const viewVueName = resolve(viewDirectory, fileName);
    log(`正在生成目录 ${viewDirectory}`);
    await dotExistDirectoryCreate(viewDirectory);
    try {
        log(`正在生成 vue 文件 ${viewVueName}`);
        await generateFile(viewVueName, vueTemplate(fileInfo[1]));
        successLog('生成成功');
    } catch (e) {
        errorLog(e);
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
        resolve(true);
      })
    })
}

// 递归创建目录
function mkdirs (directory, callback) {
    let exists = fs.existsSync(directory);
    if (exists) {
        callback();
    } else {
        mkdirs(path.dirname(directory),()=>{
            fs.mkdirSync(directory);
            callback();
        })
    }
}