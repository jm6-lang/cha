# 数查 (ShuCha) Platform

号码查询 / 数据聚合 / 增值服务的开放技术栈。

## 技术栈
- **前端**：Vue 3 + uni-app + Vite + TypeScript + Pinia
- **后端**：Spring Cloud Alibaba (Nacos + Gateway) + Spring Boot 3 + MyBatis Plus
- **基础设施**：MySQL 8 + Redis 7 + Nacos（通过 Docker Compose 一键启动）

## 快速开始

### 1. 启动基础设施（MySQL / Redis / Nacos）

```bash
docker compose up -d
```

### 2. 初始化数据库

```bash
docker exec -i shucha-mysql mysql -uroot -pshucha_root_2026 shucha < backend/shucha-query/src/main/resources/db/schema.sql
```

### 3. 启动后端服务

需要 4 个终端分别启动：

```bash
cd backend
mvn spring-boot:run -pl shucha-gateway     # 端口 9001
mvn spring-boot:run -pl shucha-query       # 端口 9002
mvn spring-boot:run -pl shucha-auth        # 端口 9003
mvn spring-boot:run -pl shucha-user        # 端口 9004
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev:h5
```

打开 [http://localhost:9000](http://localhost:9000)

## 目录

- `backend/` Spring Cloud 后端（5 个微服务）
- `frontend/` uni-app 前端（H5/小程序/App）
- `docs/` 架构、API、路线图文档
- `docker-compose.yml` 本地基础设施

## 文档

- [架构说明](docs/architecture.md)
- [API 契约](docs/api.md)
- [后续路线图](docs/next-steps.md)
- [实施计划](docs/superpowers/plans/2026-06-09-shucha-mvp.md)

## 当前状态

**v0.1 MVP** - 核心查询闭环已实现，所有数据走 Mock。

✅ 已完成：
- 首页（号码输入 + 功能入口）
- 号码查询（Mock 数据）
- 标记结果展示
- 查询历史
- 个人中心
- Spring Cloud 5 个服务骨架

⏳ 下一阶段：
- 真实数据源对接
- 增值服务 / 会员 / 支付
- IM 社区
- 生产部署
