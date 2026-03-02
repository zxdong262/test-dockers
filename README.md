# Test Docker Configs

**Languages**: [English](README.md) | [中文](README.zh.md)

This repository hosts test Docker configurations for development and testing purposes.

## Purpose

A collection of Docker configurations used for testing various setups and environments.

## Usage

Each directory contains Docker configurations for specific use cases. Navigate to the relevant directory and follow the instructions in the respective README or Dockerfile.

## Docker Configurations

### trzsz

Ubuntu 24.04 based container with trzsz installed and SSH service.

- **Location**: [dockers/trzsz/](dockers/trzsz/)
- **Features**:
  - Ubuntu 24.04 base image
  - trzsz file transfer tool installed
  - SSH service enabled (root/root)
  - Port: 22234
  - Bandwidth limited to 1Mbit
  - Uses Aliyun CN mirror for faster downloads
- **Usage**:
  ```bash
  cd dockers/trzsz
  docker-compose up -d --build
  node test-ssh.js
  ```
- **Testing**: SSH connection test using ssh2 library

### scp-only

Ubuntu 24.04 based container with SCP-only SSH service (SFTP disabled).

- **Location**: [dockers/scp-only/](dockers/scp-only/)
- **Features**:
  - Ubuntu 24.04 base image
  - SSH service enabled (root/root)
  - SCP allowed, SFTP disabled
  - Port: 22235
  - Uses Aliyun CN mirror for faster downloads
- **Usage**:
  ```bash
  cd dockers/scp-only
  docker-compose up -d --build
  node test-ssh.js
  ```
- **Testing**: SSH connection test using ssh2 library, verifies SFTP is disabled and SCP is available

## License

MIT