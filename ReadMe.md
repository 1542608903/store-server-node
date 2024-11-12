# 一、项目安装

```sh
npm i or npm install

#启动项目
npm run dev or npm start

```

# 二、项目介绍

本项目是一个基于Node.js的商城后台管理系统，使用Koa框架进行开发，实现了商品管理、订单管理、用户管理等功能。项目采用前后端分离的开发模式，前端使用Vue.js框架进行开发，后端使用Node.js和Koa框架进行开发。

## 功能介绍

- 商品管理：包括商品列表、商品添加、商品编辑、商品删除等功能。
- 订单管理：包括订单列表、订单详情、订单发货等功能。
- 用户管理：包括用户列表、用户详情、用户编辑等功能。
- 文件上传：支持图片、视频等文件的上传和下载。

## 技术栈

- 后端：Node.js、Koa、MySQL Redis、JWT等等
- 前端：
- 其他：Nginx、Git、Docker

## 项目结构

```
store-server-node
├── src
│   ├── config
│   ├── constant
│   ├── db
│   ├── public
│   ├── controller
│   ├── middleware
│   ├── model
│   ├── router
│   ├── service
│   ├── utils
│   └── main.js
├── .env
├── package.json
└── README.md
```

## 项目截图
![项目图片](https://github.com/1542608903/store-server-node/blob/main/Snipaste_2024-09-16_22-02-21.png)


# 三、项目配置.env
在项目根目录下创建一个.env文件，用于配置项目的环境变量。例如：

```env
#数据库配置
#服务器配置
#等等配置
```

# 文件存储
需要在src/public下创建一个upload文件夹，用于存储上传的文件

# 四、GITHUB提交
```git
git add .

git commit -m "你的提交信息"

git push origin main

git push origin master

```

### git pull
1. 将自己新写的代码备份到其他地方。
2. 删除本地项目里自己新写的代码。
3. git pull 下拉代码，使本地代码与远端代码一致。
4. 重新上传代码 
git add .
git commit -m "fix bug"
git push

