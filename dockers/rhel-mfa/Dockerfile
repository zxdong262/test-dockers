FROM rockylinux:8.7

RUN dnf install -y ca-certificates && rm -rf /var/cache/dnf/*

RUN dnf install -y \
    openssh-server \
    curl \
    iproute \
    && dnf clean all

RUN mkdir /var/run/sshd

RUN ssh-keygen -A

RUN echo 'root:root' | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#*ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#*KbdInteractiveAuthentication no/KbdInteractiveAuthentication yes/' /etc/ssh/sshd_config

RUN dnf install -y epel-release && dnf install -y google-authenticator qrencode && dnf clean all

RUN printf '#!/bin/bash\necho "Starting SSH..."\n/usr/sbin/sshd\nsleep infinity\n' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

EXPOSE 22

CMD ["/usr/local/bin/start.sh"]
