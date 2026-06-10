# ShuCha API Proxy (Cloudflare Worker)

把第三方 API Key 隔离在后端的反向代理。前端不持有任何 Key。

## 为什么需要

- 微信小程序/H5 代码可被反编译，API Key 一旦进前端就等于公开
- 婚姻核验等付费 API 暴露后会被恶意刷量
- 便于统一做配额、缓存、审计

## 路由

| 前端调用 | 实际代理 | 数据源 |
|---|---|---|
| `GET /api/tianapi/blood/index?he=A&me=O` | `GET https://apis.tianapi.com/blood/index?key=TIANAPI_KEY&he=A&me=O` | 天行数据 |
| `GET /api/tmini/qqqueryuin/uinq=xxx` | `GET https://tmini.net/api/qqqueryuin?apikey=TMINI_KEY&...` | 524900.xyz |
| `POST /api/marriage/single` | POST 阿里云市场 cmapi00071318 | 民政部 |
| `POST /api/marriage/dual` | POST 阿里云市场 cmapi00071318 | 民政部 |
| `GET /api/health` | — | 健康检查 |

## 部署步骤

```bash
cd /workspace/shucha-platform/api-proxy

# 1. 登录（首次）
npx wrangler login

# 2. 配置密钥（不入仓库）
npx wrangler secret put TIANAPI_KEY
# 粘贴：4a108d26704ac1e9a3054d6082003273

npx wrangler secret put TMINI_KEY        # 可选

npx wrangler secret put MARRIAGE_APIKEY
npx wrangler secret put MARRIAGE_PROVIDER     # aliyun
npx wrangler secret put MARRIAGE_GATEWAY      # https://market.aliyun.com

# 3. 部署
npx wrangler deploy

# 部署成功后，Worker 会得到一个 *.workers.dev 域名
# 例：shucha-api-proxy.<your-subdomain>.workers.dev
```

## 绑定到自定义域

如需绑定 `shucha.524900.xyz/api/*`，在 `wrangler.toml` 取消注释 `routes` 段：

```toml
routes = [
  { pattern = "shucha.524900.xyz/api/*", zone_name = "524900.xyz" }
]
```

## 本地开发

```bash
npx wrangler dev
# 默认跑在 http://localhost:8787
# 前端请求改为 /api/...
```

## 成本

- Cloudflare Workers 免费配额：10 万请求/天
- 完全够用，超出才收费（$0.50/百万请求）

## 密钥管理

密钥通过 `wrangler secret` 存储在 Cloudflare 控制台（加密），仅在运行时注入到 Worker。**不会出现在代码仓库**。
