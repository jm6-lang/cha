# 数查 (ShuCha) 数据源配置指南

> 完整的数据源接入文档。Phase 1 MVP 已实现完整的多源路由层 + 缓存 + 降级。

## 📋 数据源分级

| 层级 | 数据源 | 能力 | 成本 | QPS 限制 | 状态 |
|---|---|---|---|---|---|
| **L1 默认** | 淘宝公开 API | 归属地 + 运营商 | 免费 | 建议 < 10 | ✅ 已实现 |
| **L1 默认** | Mock | 全字段（测试） | 免费 | 无 | ✅ 已实现 |
| **L2 增强** | 阿里云号码百科 | 携号转网 + 转售企业 | ¥0.01/次 | 2000 | 🟡 待集成（接口预留） |
| **L3 标记** | 商务对接 | 骚扰/广告/快递标记 | 商务定价 | 商务 | ⏳ Phase 2 |
| **L3 标记** | 自建爬虫 | 主流标记平台 | 自维护 | 自控 | ⏳ Phase 2 |

## 🔄 数据源路由策略

```
用户请求 → 缓存查询 (Redis)
            ↓ 命中 → 返回
            ↓ 未命中
         多源降级链（按 providers 顺序）
            ↓ 成功 → 返回 + 写缓存
            ↓ 全部失败 → 兜底 mock（永远成功）
```

## ⚙️ 配置示例

### application.yml

```yaml
shucha:
  query:
    # 数据源列表（按顺序尝试，失败自动降级到下一个）
    providers:
      - taobao        # 优先用淘宝
      - mock          # 兜底

    # 缓存配置
    cache:
      enabled: true   # 是否启用 Redis 缓存
      ttl-days: 30    # 缓存有效期

    # 阿里云号码百科（需先在阿里云控制台申请）
    aliyun:
      access-key-id: ${ALIYUN_AK_ID}
      access-key-secret: ${ALIYUN_AK_SECRET}
      auth-code: ${ALIYUN_TNS_AUTH_CODE}
      endpoint: dytnsapi.aliyuncs.com
```

### 环境变量注入

```bash
export ALIYUN_AK_ID=LTAI5t...
export ALIYUN_AK_SECRET=xxx
export ALIYUN_TNS_AUTH_CODE=xxx
```

### 切换数据源

只要修改 `providers` 列表即可，无需改代码：

```yaml
# 启用阿里云（需配置凭证）
shucha:
  query:
    providers:
      - aliyun
      - taobao
      - mock
```

## 🔌 添加新的数据源

只需 3 步：

### Step 1: 实现 `NumberLabelService` 接口

```java
@Service
public class MyDataSourceImpl implements NumberLabelService {
    @Override
    public NumberLabelRespDTO query(String number) {
        // 调用你的数据源
        // 转换为 NumberLabelRespDTO 返回
    }

    @Override
    public String providerName() {
        return "my-source";
    }
}
```

### Step 2: 在 `DataSourceConfig` 注册

```java
case "my-source" -> {
    providers.add(myDataSourceService);
    log.info("[DataSource] enabled: my-source");
}
```

### Step 3: 配置启用

```yaml
shucha:
  query:
    providers:
      - my-source
      - taobao
      - mock
```

## 🛡️ 容错与降级

### 多源自动降级

`CompositeNumberLabelService` 按顺序调用每个数据源，失败自动降级：

```
请求 → taobao.query() → 异常
     → mock.query()   → 成功
     → 返回 mock 结果
```

**降级策略**：
- 任一数据源抛异常 → 降级到下一个
- 任一数据源返回 null → 降级到下一个
- 所有数据源失败 → 抛 IllegalStateException（理论上不会发生，因为 mock 永远成功）

### 缓存穿透防护

- **缓存命中**：直接返回，无下游调用
- **缓存未命中**：调数据源，**写缓存**（即便查不到也缓存空值，防穿透）
- **TTL**：30 天（号码属性基本不变）

### 限流（Phase 2）

待接入 Sentinel：
- 限流：单 IP 100 QPS
- 熔断：5xx 错误率 > 50% 熔断 30s
- 降级：超出限流返回 mock 结果

## 💰 成本估算

| 数据源 | 单次成本 | 1 万次/月成本 |
|---|---|---|
| 淘宝（免费） | ¥0 | ¥0 |
| 阿里云号码百科 | ¥0.01 | ¥100 |
| 自建（人工+服务器） | ~¥0.005 | ¥50（分摊） |

**MVP 阶段建议**：只用淘宝免费 API + 缓存，**0 成本**即可服务数千用户。

## 🧪 测试

```bash
# 测试淘宝 API
curl 'http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13800138000'
# 返回: __GetZoneResult_ = {"mts":"1380013","province":"北京","catName":"中国移动",...}

# 测试本地服务（启动后）
curl 'http://localhost:9002/api/query/number-label?number=13800138000'
curl 'http://localhost:9002/api/query/history?limit=10'
```

## ⚠️ 注意事项

1. **淘宝 API 长期可用性**：淘宝未官方公开此接口，可能随时下线。建议作为辅助源。
2. **QPS 限制**：淘宝 API 建议 < 10 QPS，生产环境**必须**用 Redis 缓存。
3. **数据准确性**：归属地数据**仅供参考**，不能 100% 准确（携号转网、虚拟号段等）。
4. **合规性**：号码查询类业务**必须完成 ICP 备案**，且数据使用需符合《个人信息保护法》。

## 📚 参考文档

- 阿里云号码百科：https://help.aliyun.com/zh/cpns/
- 淘宝手机号归属地（民间 API）：http://tcc.taobao.com/cc/json/mobile_tel_segment.htm
- 聚合数据：https://www.juhe.cn/docs/api/id/11
