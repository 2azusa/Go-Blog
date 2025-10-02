#!/bin/bash

# 设置颜色变量，让输出更易读
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[0;33m'
COLOR_RED='\033[0;31m'
COLOR_NC='\033[0m'

# 脚本失败时立即退出
set -e

# 获取脚本所在的目录，并切换到项目根目录
BASE_DIR=$(cd $(dirname $0); pwd)
cd $BASE_DIR

echo -e "${COLOR_YELLOW}Starting frontend build process...${COLOR_NC}"

# 1. 构建后台管理应用
echo ""
echo -e "${COLOR_YELLOW}Building Admin application...${COLOR_NC}"

# 定义后台应用的目录
ADMIN_DIR="web/admin"

if [ -d "$ADMIN_DIR" ]; then
    # 进入后台应用目录
    cd $ADMIN_DIR

    echo "Changed directory to $(pwd)"

    # 检查是否存在 yarn.lock 来决定使用 yarn 还是 npm
    if [ -f "yarn.lock" ]; then
        echo "yarn.lock found. Installing dependencies with yarn..."
        yarn install
        echo "Running yarn build..."
        yarn build
    elif [ -f "package-lock.json" ]; then
        echo "package-lock.json found. Installing dependencies with npm..."
        npm install
        echo "Running npm run build..."
        npm run build
    else
        echo "${COLOR_RED}Error: Neither yarn.lock nor package-lock.json found in $ADMIN_DIR. Cannot determine package manager.${COLOR_NC}"
        exit 1
    fi

    echo -e "${COLOR_GREEN}Admin application built successfully!${COLOR_NC}"
    # 返回项目根目录
    cd $BASE_DIR
else
    echo -e "${COLOR_RED}Error: Admin directory '$ADMIN_DIR' not found.${COLOR_NC}"
    exit 1
fi


# 2. 构建前台应用
echo ""
echo -e "${COLOR_YELLOW}Building Front application...${COLOR_NC}"

# 定义前台应用的目录
FRONT_DIR="web/front"

if [ -d "$FRONT_DIR" ]; then
    # 进入前台应用目录
    cd $FRONT_DIR

    echo "Changed directory to $(pwd)"
    
    # 再次检查包管理器
    if [ -f "yarn.lock" ]; then
        echo "yarn.lock found. Installing dependencies with yarn..."
        yarn install
        echo "Running yarn build..."
        yarn build
    elif [ -f "package-lock.json" ]; then
        echo "package-lock.json found. Installing dependencies with npm..."
        npm install
        echo "Running npm run build..."
        npm run build
    else
        echo "${COLOR_RED}Error: Neither yarn.lock nor package-lock.json found in $FRONT_DIR. Cannot determine package manager.${COLOR_NC}"
        exit 1
    fi

    echo -e "${COLOR_GREEN}Front application built successfully!${COLOR_NC}"
    # 返回项目根目录
    cd $BASE_DIR
else
    echo -e "${COLOR_RED}Error: Front directory '$FRONT_DIR' not found.${COLOR_NC}"
    exit 1
fi


# 3. 移动构建产物到 Go 的静态文件目录
echo ""
echo -e "${COLOR_YELLOW}Copying build artifacts to Go static directories...${COLOR_NC}"

# 定义 Go 后端期望的静态文件目录
GO_STATIC_ADMIN_DIR="static/admin"
GO_STATIC_FRONT_DIR="static/front"

# 清理旧的构建产物并复制新的
# 后台
rm -rf $GO_STATIC_ADMIN_DIR
mkdir -p $GO_STATIC_ADMIN_DIR
cp -r $ADMIN_DIR/dist/* $GO_STATIC_ADMIN_DIR/

# 前台
rm -rf $GO_STATIC_FRONT_DIR
mkdir -p $GO_STATIC_FRONT_DIR
cp -r $FRONT_DIR/dist/* $GO_STATIC_FRONT_DIR/

echo -e "${COLOR_GREEN}All build artifacts copied successfully.${COLOR_NC}"
echo ""
echo -e "${COLOR_GREEN}Frontend build process completed!${COLOR_NC}"