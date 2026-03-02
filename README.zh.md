# Docker 测试配置

**Languages**: [English](README.md) | [中文](README.zh.md)

此仓库托管用于开发和测试的 Docker 配置。

## 目的

用于测试各种设置和环境的 Docker 配置集合。

## 使用方法

每个目录包含特定用例的 Docker 配置。导航到相关目录并按照相应的 README 或 Dockerfile 中的说明操作。

## Docker 配置

### trzsz
基于 Ubuntu 24.04 的容器，安装了 trzsz 并启用了 SSH 服务。

- **位置**: [dockers/trzsz/](dockers/trzsz/)
- **特性**:
  - Ubuntu 24.04 基础镜像
  - 安装了 trzsz 文件传输工具
  - 启用 SSH 服务 (root/root)
  - 端口: 22234
  - 带宽限制为 1Mbit
  - 使用阿里云 CN 镜像加速下载
- **使用方法**:
  ```bash
  cd dockers/trzsz
  docker-compose up -d --build
  node test-ssh.js
  ```
- **测试**: 使用 ssh2 库进行 SSH 连接测试

### scp-only
基于 Ubuntu 24.04 的容器，仅启用 SCP 的 SSH 服务（SFTP 已禁用）。

- **位置**: [dockers/scp-only/](dockers/scp-only/)
- **特性**:
  - Ubuntu 24.04 基础镜像
  - 启用 SSH 服务 (root/root)
  - 允许 SCP，禁用 SFTP
  - 端口: 22235
  - 使用阿里云 CN 镜像加速下载
- **使用方法**:
  ```bash
  cd dockers/scp-only
  docker-compose up -d --build
  node test-ssh.js
  ```
- **测试**: 使用 ssh2 库进行 SSH 连接测试，验证 SFTP 已禁用且 SCP 可用

## 许可证

MIT
