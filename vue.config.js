module.exports = {
    //选项
    // publicPath:'./',    //基本路径
    publicPath:process.env.NODE_ENV == 'production'?'./':'/',
}