# 数查 (ShuCha) 架构

## 系统架构图

```
┌─────────────────────────────────────┐
│         用户 (H5 / 小程序 / App)     │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│  Nginx / CDN / WAF (生产)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  shucha-gateway  (:9001)            │  Spring Cloud Gateway
│  - 路由 / 限流 / 鉴权 / 灰度          │  - JWT 鉴权 (Phase 1)
└──────┬───────┬───────┬──────────────┘
       │       │       │
       ▼       ▼       ▼
┌────────┐┌────────┐┌────────┐
│ auth   ││ query  ││ user   │  Nacos (:8848)
│ :9003  ││ :9002  ││ :9004  │  服务注册/发现
└────┬───┘└────┬───┘└────┬───┘
     │        │         │
     ▼        ▼         ▼
   MySQL    MySQL    MySQL   (:3306)
   Redis    Redis    Redis   (:6379)
   (后续)   (后续)   (后续)

Sentinel Dashboard  ← 限流/熔断 (Phase 2)
Sleuth + Zipkin     ← 链路追踪 (Phase 2)
```

## 微服务清单

| 服务 | 端口 | 职责 | 状态 |
|---|---|---|---|
| shucha-gateway | 9001 | API 网关，统一入口 | ✅ v0.1 |
| shucha-auth    | 9003 | 短信验证码 / 登录 / Token | ✅ 占位 |
| shucha-user    | 9004 | 用户信息 / 会员 / 钱包 | ✅ 占位 |
| shucha-query   | 9002 | 号码查询 / 历史 | ✅ 核心 |
| shucha-mock    | -    | 数据源 Mock（合并在 query 内） | ✅ v0.1 |

## 数据源抽象

```
QueryController
  → QueryService
    → NumberLabelService (接口)
      └─ MockNumberLabelServiceImpl (当前)
      ├─ AliyunNumberLabelServiceImpl (Phase 1)
      ├─ TencentNumberLabelServiceImpl (Phase 1)
      └─ InternalNumberLabelServiceImpl (Phase 1 - 自主爬取)
```

**切换数据源** 只需新增实现 + 配置 `shucha.query.provider`。

## 前端架构

```
src/
├── pages/        # 页面（uni-app 自动路由）
├── components/   # 通用组件
├── api/          # API 客户端（含 mock 兜底）
├── stores/       # Pinia 状态
└── styles/       # SCSS 变量与全局样式
```

**关键设计**：
- 前端 mock 兜底：后端未启动时也能演示完整流程
- H5 优先，相同代码可编译出微信小程序 / App

## 关键决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 后端架构 | Spring Cloud Alibaba | 业界主流 + Nacos 一体化 + 团队熟悉 |
| 持久层 | MyBatis Plus | 与 yudao 生态一致 + 上手快 |
| 前端框架 | uni-app + Vue 3 | 一套代码多端 + yudao 同款 |
| 状态管理 | Pinia | Vue 3 官方推荐 |
| 数据源 | 抽象接口 + Mock 实现 | 为真实接入预留空间 |
| 认证 | 短信验证码 (Phase 1) | 与原站一致 |
| 部署 | Docker Compose 本地 / 阿里云生产 (Phase 4) | 渐进式 |

## 安全合规

- 输入校验（号码格式）
- SQL 注入（MyBatis Plus 参数化）
- 限流（Phase 2 接入 Sentinel）
- 用户隐私：历史记录 user_id 隔离
- 后续需 ICP + 公安网安备案
