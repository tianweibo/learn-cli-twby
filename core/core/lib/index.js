'use strict';

module.exports = core;
const pkg=require('../package.json')
const constant = require('./const');
const log =require('@learn-cli-twb/log')
const semver=require('semver')
const path = require('path');
const colors=require('colors/safe');
const userHome=require('user-home');
const pathExists =require('path-exists').sync;
let argv=null;

const LOWEST_NODE_VERSION=require('./const').LOWEST_NODE_VERSION
async function core() {
    try{
        checkPkgVersion()
        checkNodeVersion()
        //checkRoot()
        checkUserHome()
        checkInputArgs()
        //log.verbose('debug','test debug log')
       //checkEnv()
        await checkGlobalUpdate()
    }catch(e){
        log.error(e.message)
    } 
}
async function checkGlobalUpdate(){
    //1、获取当前版本号和模块名
    const currentVersion=pkg.version;
    const npmName=pkg.name;
    console.log(currentVersion,'1111currentVersion')
    //2、调用npm api,获取所有的版本号
    const {getNpmSemverVersion}=require("@learn-cli-twb/get-npm-info")
    const lastVersion=await getNpmSemverVersion(currentVersion,npmName)
    if(lastVersion && semver.gt(lastVersion,currentVersion)){
        log.warning('更新提示',colors.yellow(`请手动更新${npmName},当前版本${currentVersion}，最新版本${lastVersion}
                更新命令： npm install -g ${npmName}`))
    }
    //3、提取所有的版本号，比对那些版本号是大于当前版本号的

    //4、给出最新的版本号，提示用户更新到该版本
}
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
      dotenv.config({
        path: dotenvPath,
      });
    }
    createDefaultConfig();
  }
  
  function createDefaultConfig() {
    const cliConfig = {
      home: userHome,
    };
    if (process.env.CLI_HOME) {
      cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
      cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
  }
function checkInputArgs(){ //检查入参也就是--debug 使用minimist
    argv = require('minimist')(process.argv.slice(2));
    console.log(argv);
    checkArgs();
}
function checkArgs(){
    if(argv.debug){
        process.env.LOG_LEVEL='verbose';
    }else{
        process.env.LOG_LEVEL='info';
    }
    log.level=process.env.LOG_LEVEL
}
function checkUserHome(){
    console.log(userHome,pathExists(userHome))
    if(!userHome || !pathExists(userHome)){
        throw new Error(colors.red('当前登录用户主目录不存在'))
    } 
}
function checkRoot(){
    console.log(process.geteuid())
    const rootCheck=require('root-check')
    //root-check 检查是不是root用户是的话就自动降级
    rootCheck()
}
function checkPkgVersion(){
    log.notice('cli',pkg.version)
}
function checkNodeVersion(){
    //获取当前node版本号
    console.log(process.version)
    const currentVersion=process.version
    //比对最低版本号-LOWEST_NODE_VERSION
    //比对-semver
    if(!semver.gte(currentVersion,LOWEST_NODE_VERSION)){
        throw new Error(colors.red(`learn-cli-twb 需要安装${LOWEST_NODE_VERSION}以上版本的node.js`))
    }
}