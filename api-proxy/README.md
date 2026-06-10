# ShuCha API Proxy (Cloudflare Worker)

数查后端反向代理 + 支付网关。前端不持有任何 API Key 或商户密钥。

## 路由总览

| 前端调用 | 实际代理 | 数据源 | 密钥存放 |
|---|---|---|---|
| `GET /api/tianapi/{endpoint}?{params}` | `https://apis.tianapi.com/...` | 天行数据 | `TIANAPI_KEY` |
| `GET /api/tmini/{endpoint}?{params}` | `https://tmini.net/api/...` | 524900.xyz | 可选 |
| `POST /api/marriage/single` | 阿里云市场 / 智查 / 羽山 / 天远 | 民政部 | `MARRIAGE_*` |
| `POST /api/marriage/dual` | 同上双人 | 民政部 | 同上 |
| `POST /api/pay/jsapi` | 微信支付 v3 JSAPI | 微信支付 | `WECHAT_*` |
| `POST /api/pay/h5` | 微信支付 v3 H5 | 微信支付 | `WECHAT_*` |
| `GET /api/pay/query/{out_trade_no}` | 微信支付 v3 查单 | 微信支付 | `WECHAT_*` |
| `POST /api/pay/refund` | 微信支付 v3 退款 | 微信支付 | `WECHAT_*` |
| `POST /api/pay/notify` | 微信支付回调（验签）| 微信支付 | `WECHAT_*` |
| `POST /api/wx/jscode2session` | 微信 code 换 openid | 微信开放 | `WECHAT_APPID/SECRET` |
| `GET /api/health` | — | 健康检查 | — |

## 部署步骤

### 1. 登录
```bash
cd /workspace/shucha-platform/api-proxy
npm install
npx wrangler login
```

### 2. 注入密钥（**不入仓库**）
```bash
# 天行数据
npx wrangler secret put TIANAPI_KEY
# 粘贴：4a108d26704ac1e9a3054d6082003273

# 婚姻核验（签约后填入）
npx wrangler secret put MARRIAGE_APIKEY
npx wrangler secret put MARRIAGE_PROVIDER     # aliyun | hunyin | yushan | tianyuan
npx wrangler secret put MARRIAGE_GATEWAY      # https://market.aliyun.com

# 微信支付（拿到商户号后填入）
npx wrangler secret put WECHAT_MCH_ID
npx wrangler secret put WECHAT_APPID
npx wrangler secret put WECHAT_APP_SECRET
npx wrangler secret put WECHAT_API_V3_KEY     # 32位字符串
# 证书私钥用 base64 编码（去掉换行）后存：
#   cat apiclient_key.pem | base64 -w 0 | pbcopy
npx wrangler secret put WECHAT_MCH_KEY_PEM
npx wrangler secret put SERIAL_NO             # 证书序列号
```

### 3. 部署
```bash
npx wrangler deploy
# 部署后得到 shucha-api-proxy.<your-sub>.workers.dev
```

## 绑定到自定义域

取消 `wrangler.toml` 中 `routes` 段注释：
```toml
routes = [
  { pattern = "shucha.524900.xyz/api/*", zone_name = "524900.xyz" }
]
```

## 本地开发

```bash
# 终端 1：启动 Worker
npx wrangler dev    # http://localhost:8787

# 终端 2：启动前端
cd ../frontend
npm run dev:h5      # 自动把 /api/* 代理到 :8787
```

## 成本

- Cloudflare Workers 免费配额：**10 万请求/天**
- 完全够用，超出才收费（$0.50/百万请求）

## 关键安全特性

✅ **0 个 API Key 在前端代码**（grep `4a108d` 零结果）  
✅ **商户 API v3 密钥在 wrangler secret**（加密，不入仓）  
✅ **证书私钥 base64 存储**（不入仓）  
✅ **可统一加缓存/限流/审计**  
✅ **微信支付回调验签**（防止伪造通知）  
✅ **生产环境需从微信下载平台证书**（pay.js `verifyNotify` 函数有 TODO，生产部署时实现完整流程）
