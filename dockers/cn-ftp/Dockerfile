FROM amazonlinux:2

# Install vsftpd and required packages including Chinese locale support
RUN yum update -y && yum install -y vsftpd glibc-common glibc-locale-source glibc-langpack-zh shadow-utils

# Set locale to Chinese GBK - this makes the system use GBK encoding
# When UTF8 client connects, it will show garbled text
# When GBK client connects, it will display correctly
RUN localedef -c -f GBK -i zh_CN zh_CN.GBK && \
    echo 'LANG=zh_CN.GBK' > /etc/locale.conf && \
    echo 'LC_ALL=zh_CN.GBK' >> /etc/locale.conf

ENV LANG=zh_CN.GBK
ENV LC_ALL=zh_CN.GBK

# Create FTP user with password
RUN useradd -m -s /bin/bash ftpuser && \
    echo "ftpuser:ftppass" | chpasswd

# Create test files with Chinese names (GBK encoded)
# FIX: Use iconv to convert Chinese filenames from UTF-8 to GBK encoding
# The Dockerfile is UTF-8, so Chinese chars are UTF-8 bytes by default.
# We must explicitly convert them to GBK bytes for the filesystem.
RUN mkdir -p /home/ftpuser/test_files && \
    GBK_DIR=$(printf '文件夹' | iconv -f UTF-8 -t GBK) && \
    mkdir -p "/home/ftpuser/test_files/${GBK_DIR}" && \
    GBK_F1=$(printf '测试文件1.txt' | iconv -f UTF-8 -t GBK) && \
    echo "test content 1 - 测试内容" > "/home/ftpuser/test_files/${GBK_F1}" && \
    GBK_F2=$(printf '中文文件名2.txt' | iconv -f UTF-8 -t GBK) && \
    echo "test content 2 - 中文内容" > "/home/ftpuser/test_files/${GBK_F2}" && \
    GBK_F3=$(printf '子文件.txt' | iconv -f UTF-8 -t GBK) && \
    echo "test content 3 - 子文件内容" > "/home/ftpuser/test_files/${GBK_DIR}/${GBK_F3}" && \
    GBK_F4=$(printf '另一个文件夹' | iconv -f UTF-8 -t GBK) && \
    mkdir -p "/home/ftpuser/test_files/${GBK_F4}" && \
    GBK_F5=$(printf '嵌套文件.txt' | iconv -f UTF-8 -t GBK) && \
    echo "nested file content - 嵌套文件内容" > "/home/ftpuser/test_files/${GBK_F4}/${GBK_F5}" && \
    chown -R ftpuser:ftpuser /home/ftpuser

# Configure vsftpd - create a clean config file
RUN echo "anonymous_enable=NO" > /etc/vsftpd/vsftpd.conf && \
    echo "local_enable=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "write_enable=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "local_umask=022" >> /etc/vsftpd/vsftpd.conf && \
    echo "dirmessage_enable=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "xferlog_enable=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "connect_from_port_20=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "xferlog_std_format=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "listen=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "listen_ipv6=NO" >> /etc/vsftpd/vsftpd.conf && \
    echo "pam_service_name=vsftpd" >> /etc/vsftpd/vsftpd.conf && \
    echo "userlist_enable=NO" >> /etc/vsftpd/vsftpd.conf && \
    echo "local_root=/home/ftpuser" >> /etc/vsftpd/vsftpd.conf && \
    echo "chroot_local_user=NO" >> /etc/vsftpd/vsftpd.conf && \
    echo "seccomp_sandbox=NO" >> /etc/vsftpd/vsftpd.conf && \
    echo "pasv_enable=YES" >> /etc/vsftpd/vsftpd.conf && \
    echo "pasv_min_port=40000" >> /etc/vsftpd/vsftpd.conf && \
    echo "pasv_max_port=40100" >> /etc/vsftpd/vsftpd.conf && \
    echo "background=NO" >> /etc/vsftpd/vsftpd.conf

# Configure bash to use GBK encoding
RUN echo 'export LANG=zh_CN.GBK' >> /etc/bashrc && \
    echo 'export LC_ALL=zh_CN.GBK' >> /etc/bashrc

# Create startup script
RUN echo '#!/bin/bash' > /usr/local/bin/start-vsftpd.sh && \
    echo 'export LANG=zh_CN.GBK' >> /usr/local/bin/start-vsftpd.sh && \
    echo 'export LC_ALL=zh_CN.GBK' >> /usr/local/bin/start-vsftpd.sh && \
    echo 'source /etc/locale.conf' >> /usr/local/bin/start-vsftpd.sh && \
    echo 'exec /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf' >> /usr/local/bin/start-vsftpd.sh && \
    chmod +x /usr/local/bin/start-vsftpd.sh

EXPOSE 21 40000-40100

CMD ["/usr/local/bin/start-vsftpd.sh"]