FROM ubuntu:24.04

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

RUN sed -i 's|http://archive.ubuntu.com|https://mirrors.aliyun.com|g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's|http://security.ubuntu.com|https://mirrors.aliyun.com|g' /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt-get install -y \
    openssh-server \
    telnetd \
    inetutils-inetd \
    lrzsz \
    curl \
    iproute2 \
    libsixel-bin \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/atanunq/viu/releases/download/v1.4.0/viu -o /usr/local/bin/viu && chmod +x /usr/local/bin/viu

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
touch /etc/inetd.conf\n\
echo "telnet stream tcp nowait root /usr/sbin/in.telnetd in.telnetd" > /etc/inetd.conf\n\
sed -i "s|23|21|g" /etc/inetd.conf\n\
/usr/sbin/inetutils-inetd /etc/inetd.conf\n\
tc qdisc del dev eth0 root 2>/dev/null || true\n\
tc qdisc del dev eth0 ingress 2>/dev/null || true\n\
tc qdisc add dev eth0 root handle 1: htb default 10\n\
tc class add dev eth0 parent 1: classid 1:1 htb rate 5mbit ceil 5mbit\n\
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 5mbit ceil 5mbit\n\
tc qdisc add dev eth0 parent 1:10 handle 10: sfq perturb 10\n\
/usr/sbin/sshd -D' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

EXPOSE 22 21

CMD ["/usr/local/bin/start.sh"]
