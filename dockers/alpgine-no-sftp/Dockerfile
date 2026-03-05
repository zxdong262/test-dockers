FROM alpine:3.7

RUN apk add --no-cache openssh-server \
    && rm -rf /var/cache/apk/*

RUN ssh-keygen -A

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config

RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/g' /etc/ssh/sshd_config

RUN sed -i 's/^Subsystem.*sftp.*/#&/' /etc/ssh/sshd_config

RUN rm -f /bin/bash /usr/bin/bash

RUN sed -i 's|^root:[^:]*:|root:$1$vQn7CXy5$HKAaBDk.BvcAutJkR4jR71:|' /etc/shadow

RUN mkdir -p /var/run/sshd

RUN rm -f /bin/stat /usr/bin/stat

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
