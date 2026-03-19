# RHEL MFA Docker Container

Rocky Linux 8.7 container with SSH and Google Authenticator (MFA) support.

## Quick Start

```bash
cd /Users/zxd/dev/test-dockers/dockers/rhel-mfa

# Build and start the container
docker-compose up -d --build

# Check container status
docker ps | grep rhel-mfa
```

## Services

- **SSH**: Port 2222 (mapped from container port 22)
- **Default credentials**: root / root
- **MFA**: Google Authenticator enabled

## Initialize MFA

After starting the container for the first time, you need to initialize MFA:

```bash
# Access the container
docker exec -it rhel-mfa /bin/bash

# Run Google Authenticator setup as root
google-authenticator

# Follow the prompts:
# - Make tokens "time-based"? YES
# - Update your ~/.google_authenticator file? YES
# - Disallow multiple uses of the same authentication? YES
# - Increase the original generation time limit? NO
# - Enable rate-limiting? YES

# Configure PAM for SSH to use Google Authenticator
echo "auth required pam_google_authenticator.so secret=/root/.google_authenticator nullok" >> /etc/pam.d/sshd
```

### Setup Google Authenticator App

1. The command will display a QR code - scan it with your Google Authenticator app
2. Also save the **secret key** and **verification codes** in a secure place
3. The emergency scratch codes (5 codes) are one-time use backup codes

### Test MFA Login

```bash
# SSH into the container with MFA
ssh root@localhost -p 2222

# You will be prompted for:
# 1. Password: root
# 2. Verification code: (enter code from Google Authenticator)
```

## Common Operations

### Restart Container

```bash
# Stop and start
docker-compose restart

# Or rebuild and start
docker-compose up -d --build

# Or restart a running container
docker restart rhel-mfa
```

### View Logs

```bash
# View container logs
docker logs rhel-mfa

# Follow logs in real-time
docker logs -f rhel-mfa
```

### Reinitialize MFA

If you need to set up MFA again:

```bash
docker exec -it rhel-mfa /bin/bash

# Remove old config and reinitialize
rm -f ~/.google_authenticator
google-authenticator
```

### Access Container Shell

```bash
docker exec -it rhel-mfa /bin/bash
```

### Stop Container

```bash
docker-compose down
```

### Rebuild Container

```bash
docker-compose up -d --build --force-recreate
```

## Configuration Details

### SSH Configuration

The Dockerfile configures SSH with:
- Root login enabled (`PermitRootLogin yes`)
- Password authentication enabled
- Keyboard-interactive authentication enabled (required for MFA)
- Challenge-response authentication enabled

### Environment

- Base image: Rocky Linux 8.7
- SSH port: 22 (internal), 2222 (host)
- Packages installed:
  - openssh-server
  - curl
  - iproute
  - google-authenticator
  - qrencode

## Troubleshooting

### SSH Connection Refused

```bash
# Check if container is running
docker ps | grep rhel-mfa

# Check SSH service status inside container
docker exec rhel-mfa ps aux | grep sshd

# Check port mappings
docker port rhel-mfa
```

### MFA Not Working

1. Make sure your system time is correct (Google Authenticator is time-based)
2. Reinitialize MFA if keys are corrupted
3. Check SSH config for keyboard-interactive authentication

### Reset Password

```bash
docker exec rhel-mfa /bin/bash -c "echo 'root:newpassword' | chpasswd"
```
