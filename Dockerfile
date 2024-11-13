# 使用官方Node.js镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . /usr/src/app

# 暴露端口
EXPOSE 5000

# 启动应用
#CMD node /usr/src/app/main.js
CMD ["node", "/usr/src/app/src/main.js"]
