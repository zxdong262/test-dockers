FROM ubuntu:24.04

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

RUN sed -i 's|http://archive.ubuntu.com|https://mirrors.aliyun.com|g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's|http://security.ubuntu.com|https://mirrors.aliyun.com|g' /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt-get install -y \
    openssh-server \
    curl \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/run/sshd

RUN echo 'root:root' | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

RUN sed -i 's|^Subsystem.*sftp-server|#Subsystem sftp /usr/lib/openssh/sftp-server|g' /etc/ssh/sshd_config

RUN mkdir -p /etc/ssh/sshd_config.d

# Configure TCP keepalive at system level for early disconnect
RUN echo 'net.ipv4.tcp_keepalive_time = 5' >> /etc/sysctl.conf && \
    echo 'net.ipv4.tcp_keepalive_intvl = 5' >> /etc/sysctl.conf && \
    echo 'net.ipv4.tcp_keepalive_probes = 1' >> /etc/sysctl.conf

# Start script that applies keepalive settings and starts SSH
RUN echo '#!/bin/bash' > /usr/local/bin/start.sh && \
    echo 'sysctl -w net.ipv4.tcp_keepalive_time=2' >> /usr/local/bin/start.sh && \
    echo 'sysctl -w net.ipv4.tcp_keepalive_intvl=2' >> /usr/local/bin/start.sh && \
    echo 'sysctl -w net.ipv4.tcp_keepalive_probes=2' >> /usr/local/bin/start.sh && \
    echo 'echo "ClientAliveInterval 2" > /etc/ssh/sshd_config.d/timeout.conf' >> /usr/local/bin/start.sh && \
    echo 'echo "ClientAliveCountMax 3" >> /etc/ssh/sshd_config.d/timeout.conf' >> /usr/local/bin/start.sh && \
    echo 'echo "TCPKeepAlive yes" >> /etc/ssh/sshd_config.d/timeout.conf' >> /usr/local/bin/start.sh && \
    echo '/usr/sbin/sshd -D' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

EXPOSE 22

CMD ["/usr/local/bin/start.sh"]
