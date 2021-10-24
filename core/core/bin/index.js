#! /usr/bin/env node
const importLocal=require('import-local');
//如果传入了文件路径，说明使用的是本地加载的脚手架文件
if(importLocal(__filename)){ 
    require('npmlog').info('cli','正在使用learn-cli-twb 本地版本')
}else{
    require('../lib')(process.argv.slice(2))
}