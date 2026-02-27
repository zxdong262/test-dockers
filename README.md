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

## License

MIT