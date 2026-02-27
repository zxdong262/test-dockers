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

RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:trzsz/ppa && \
    apt-get update && apt-get install -y trzsz && \
    rm -rf /var/lib/apt/lists/*

RUN echo '#!/bin/bash\n\
tc qdisc del dev eth0 root 2>/dev/null || true\n\
tc qdisc del dev eth0 ingress 2>/dev/null || true\n\
tc qdisc add dev eth0 root handle 1: htb default 10\n\
tc class add dev eth0 parent 1: classid 1:1 htb rate 5mbit ceil 5mbit\n\
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 5mbit ceil 5mbit\n\
tc qdisc add dev eth0 parent 1:10 handle 10: sfq perturb 10\n\
/usr/sbin/sshd -D' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

EXPOSE 22

CMD ["/usr/local/bin/start.sh"]
