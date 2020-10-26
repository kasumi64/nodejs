ctrl + shift +/- （ctrl +/-）终端字体放大缩小
tab——>自动补全
ctrl + c  退出当前命令
查阅命令帮助信息
command --help；
man command；man---manual
1. 空格 显示下一屏；2. Enter 一次滚动一行；3. b 回滚一屏；4. f 前滚一屏；5. q退出；

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

01、ls---list 【-a, -l显示详细信息, -h要和-l一起用,显示size】  当前文件夹下的内容 / dos里的dir
02、pwd---print work directory  查看当前所在文件夹
03、cd---change directory  切换文件夹
04、touch---touch  如果文件不存在，新建文件
05、mkdir---mak directory 【-p a/b/c多级目录】  创建目录
06、rm---remove 【-r删目录, -f强制删除 】  删除指定的文件名
07、clear---clear  清屏

08、tree---tree 【-d只显示目录, [目录名]】  目录的树状结构
09、cp---copy 源文件 -> 目标文件 【-i覆盖前提示, -r复制文件夹】   复制文件
10、mv--- 源文件 -> 目标路径 【-i覆盖前提示】  移动文件
11、cat---concatenate 【-b对非空输出行编号, -n对输出所有行编号】   查看文件的所有内容，创建、合并、追加文件内容
12、more---more   查看文件的内容，分屏显示，1. 空格 显示下一屏；2. Enter 一次滚动一行；3. b 回滚一屏；4. f 前滚一屏；5. q退出；
13、grep---grep 搜索内容(可以正则) + 文件名 【-n显示行号, -v显示不包含匹配文本的所有行, -i忽略大小写】   搜索文本文件内容
14、echo---log 输出 
15、【>重定向，可生成文件, >>追加内容】
16、|---管道，左端塞，右端取

17、shutdown 【-r重启, -c取消命令】now立刻，可以指定时间 +10为10分钟后

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

SSH
01、sudo apt install openssh-server   安装
02、sudo apt autoremove openssh-client   卸御
03、sudo apt-get install openssh-client
04、sudo apt-get install openssh-server

链接服务器
05、ssh 【-p port端口22】 user@remote {user: 远程机器上的用户名, remote: 远程机器上的地址，IP/域名，别名}
06、ssh-keygen   生成SSH钥匙,一路回车即可
07、ssh-copy-id user@ip   免密码

远程拷贝文件
08、scp--- FileZilla(文件传输) 【-P大写 port22, -r为目录】 file.x user@remote:Desktop/   以user的家目录为相对路径

09、scp file user@ip:Desktop   复制文件

10、服务器别名 在~/.ssh/confing里面追加以下内容：
Host saswetName
	HostName 192.168.3.129
	User leigy
	Port 22
	
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

sudo 管理权限

01、chmod +/-rwx 文件名   增加或减少权限，r可读，w可写，x执行
02、x执行文件   ./文件名
03、chmod 【-Ru递归, 755（三个数字对应，拥有者｜组｜其他用户）】 文件名｜目录名
{r:4, w:2, x:1} => rwx(可读+可写+执行) => 7
{rwx:7, rw-:6, r-x:5, r--:4, -wx:3, -w-: 2, --x:1, ---:0}

04、sudo groupadd 组名，   增加组，保存在/etc/group
05、sudo groupdel 组名，   删除组，查询组 cat /etc/group
06、sudo chgrp 【-R递归文件】 组名 文件名或目录名   改所属组

07、sudo useradd -m -g 组名 新用户名   增加新用户
08、sudo passwd 新用户名 ***    ，查询密码 cat -n /etc/passwd | grep 用户名
09、sudo userdel -r 用户名   删除用户名   

10、usermod 【-g主组, -G附加组】 用户名   增加附加组的权限
11、usermod -s /bin/bash user   有颜色的shell

12、sudo chown 用户名 文件名｜目录名   修改所有者

13、id 用户名   查看用户的 UID 和 GID 信息
14、who 查看当前所有登录的用户列表，   whoami 当前登录的账号名
15、which command    查看命令的位置
16、su - 用户名    切换用户 (不接用户名直接到root) 
17、eixt 退出，切换用户后，会回到上一个用户

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

系统信息命令
01、data   当前系统时间
02、cal---calendar 【-y查看一年】  当前月日历
03、df---disk free 【-h以MB｜GB显示】   磁盘剩余空间
04、du---disk usage 【-h目录下的文件大小】【目录名】   当前目录下的文件大小
进程信息
05、ps 【aux所有详细进程】   查看进程的详细状况
06、top   进程排序，q退出top
07、kill 【-9】 进程代号   结束进程，-9强制杀死

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

其它命令
01、find 【路径 -name】 “*.py”   搜索文件
02、ln 【-s软链接，不用就是硬链接】 源文件 链接文件名   软链接，快捷方式
03、gzip 压缩 .tar 文件   *.tar.gz
打包{c:创建文件, x:解开文件, v:显示进度, f:指定文件名，f要放到最后接新的文件名}
04、tar -cvf 打包文件名.tar 被打包的文件｜路径(多个文件用空格分开) 
	tar -xvf 打包文件.tar   解包
	tar -zcvf    可以调用gzip命令打包压缩；
	tar -zxvf    解压文件；
解压到指定目录
	tar -zxvf 打包文件.tar.gz -C 目标路径

05、bzip2 
	tar -jcvf....; tar -jxvf *.tar.bz2

05、apt-get(Advanced Packaging Tool) 安装包管理工具
安装软件 sudo apt install 软件名
卸载软件 sudo apt remove 软件名
更新软件 sudo apt upgrade 软件名




－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
