#!/bin/bash

# 变量
PROJECTNAME="Go-Blog"
PROJECTBASE="."
PROJECTBIN="$PROJECTBASE/bin"
PROJECTLOGS="$PROJECTBASE/log"
prog=$PROJECTNAME

CURDIR=$(cd $(dirname $0); pwd)
cd $CURDIR

# 确保目标目录存在
mkdir -p $PROJECTBIN
mkdir -p $PROJECTLOGS

# 定义PID文件路径
PIDFILE="$PROJECTBIN/$prog.pid"

# 运行服务
start() {
    if [ -f "$PIDFILE" ]; then
        pid=$(cat $PIDFILE)
        if ps -p $pid > /dev/null; then
            echo "$prog is already running with pid $pid"
            exit 1
        fi
    fi

    echo -e "Begin to compile the project ---$PROJECTNAME..."
    # 编译go项目到指定的 bin 目录
    go build -o $PROJECTBIN/$PROJECTNAME main.go
    if [ $? -ne 0 ]; then
        echo "Go build failed!"
        exit 1
    fi

    echo "Compilation completed."
    echo "Starting $prog, please waiting..."

    # 后台运行项目
    nohup $PROJECTBIN/$PROJECTNAME > $PROJECTLOGS/run.log 2>&1 &
    # 将新进程的PID写入文件
    echo $! > $PIDFILE

    sleep 2
    # 检查是否启动成功
    if ps -p $(cat $PIDFILE) > /dev/null; then
        echo "Service started successfully with PID: $(cat $PIDFILE)"
    else
        echo "Service failed to start."
        rm -f $PIDFILE
    fi
}

# 停止服务
stop(){
    echo -e $"Stopping the project ---$prog: "
    if [ ! -f "$PIDFILE" ]; then
        echo "No pid file found, service may not be running."
        exit 1
    fi

    pid=$(cat $PIDFILE)
    if ! ps -p $pid > /dev/null; then
        echo "Process with pid $pid not found, maybe already stopped."
        rm -f $PIDFILE
        exit 0
    fi

    # 1. SIGTERM
    echo -n $"Sending SIGTERM to process $pid ... "
    kill -15 $pid

    # 等待最多 10 秒让其自行退出
    for ((i=1;i<=10;i++)); do
        sleep 1
        if ! ps -p $pid > /dev/null ; then
            echo "stopped gracefully. OK"
            rm -f $PIDFILE
            return 0
        fi
    done

    # 2. SIGKILL
    echo ""
    echo -n $"Process did not respond to SIGTERM, sending SIGKILL to $pid ... "
    kill -9 $pid
    sleep 1
    echo "stopped forcibly. OK"
    rm -f $PIDFILE
}

# 重启服务
restart(){
    echo "Restarting $prog ..."
    stop
    sleep 2
    start
}

# 判断命令
case "$1" in
start)
    start
    ;;
stop)
    stop
    ;;
restart)
    restart
    ;;
*)
    echo $"Usage: $0 {start|stop|restart}"
    exit 2
    ;;
esac