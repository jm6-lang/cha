# API 契约

所有接口经 `shucha-gateway` (:9001) 暴露，统一前缀 `/api/`，统一返回 `Result<T>` 结构。

## 通用响应结构

```json
{
  "code": 0,
  "message": "ok",
  "data": <T>
}
```

业务码：
- `0` 成功
- `400` 参数错误
- `401` 未授权
- `500` 服务器错误

---

## 查询服务 shucha-query

### GET /api/query/number-label

查询号码标记信息

**Query Params:**
- `number` (required): 手机号/固话/400/95 号码 (7-13 位)

**Headers:**
- `X-Shucha-User-Id` (optional): 用户 ID（登录后传入）

**Response 200:**
```json
{
  "code": 0,
  "data": {
    "number": "13800138000",
    "province": "北京",
    "city": "北京市",
    "carrier": "中国移动",
    "labels": [
      { "name": "骚扰电话", "source": "腾讯手机管家", "count": 45, "riskLevel": 2 },
      { "name": "广告推销", "source": "360手机卫士", "count": 12, "riskLevel": 1 }
    ]
  }
}
```

### GET /api/query/history

查询用户历史

**Query Params:**
- `limit` (optional, default 20): 返回条数

**Headers:**
- `X-Shucha-User-Id` (optional)

**Response 200:**
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "number": "13800138000",
      "province": "北京",
      "city": "北京市",
      "carrier": "中国移动",
      "labelCount": 3,
      "createTime": "2026-06-09 10:00:00"
    }
  ]
}
```

---

## 认证服务 shucha-auth

### POST /api/auth/sms-code

发送短信验证码

**Body:** `phone=13800138000`

**Response 200:**
```json
{
  "code": 0,
  "data": { "phone": "13800138000", "hint": "演示模式：验证码固定 9999" }
}
```

### POST /api/auth/login

登录

**Body:** `phone=13800138000&code=9999`

**Response 200:**
```json
{
  "code": 0,
  "data": {
    "userId": 10001,
    "nickname": "演示用户",
    "token": "mock-token-xxx"
  }
}
```

---

## 用户服务 shucha-user

### GET /api/user/{id}

获取用户信息

**Response 200:**
```json
{
  "code": 0,
  "data": {
    "id": 10001,
    "nickname": "演示用户",
    "avatar": "",
    "phone": "138****0000",
    "level": "VIP1"
  }
}
```
