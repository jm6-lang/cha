# 数查 (ShuCha) 生产部署与合规指南

> **核心结论**：在中国大陆运营并接入微信支付/支付宝，**必须完成 ICP 备案 + 公安网安备案**。部署在阿里云国内节点是最稳妥方案。

---

## 一、备案合规总览

### 1.1 为什么必须备案？

| 场景 | 是否必须备案 | 说明 |
|---|---|---|
| 使用国内服务器（阿里云/腾讯云等） | ✅ 必须 | 工信部强制要求 |
| 接入微信支付 H5/JSAPI | ✅ 必须 | 微信要求域名 ICP 备案 + HTTPS |
| 接入支付宝 H5/小程序 | ✅ 必须 | 支付宝要求 ICP 备案 + 企业主体 |
| 仅做信息展示、无支付 | ✅ 必须 | 非经营性 ICP 备案 |
| 涉及付费查询/会员 | ✅ 必须 + ICP 许可证 | 经营性互联网信息服务 |

**法律依据**：《互联网信息服务管理办法》第4条、《非经营性互联网信息服务备案管理办法》第5条。

### 1.2 三种备案的区别

| 备案类型 | 性质 | 适用场景 | 有效期 |
|---|---|---|---|
| **ICP 备案** | 行政登记 | 所有境内网站（信息展示） | 无固定期，信息变更需更新 |
| **ICP 许可证** | 行政许可 | 涉及收费/广告/电商等经营性业务 | 5 年，到期续期 |
| **公安网安备案** | 补充登记 | ICP 备案后 30 日内必须完成 | 无固定期 |

> 数查（号码查询 + 付费增值服务）属于**经营性互联网信息服务**，理论上需要 **ICP 许可证**。但初期 MVP 阶段可先以 ICP 备案上线，后续再补 ICP 许可证。

---

## 二、备案全流程（阿里云为例）

### 2.1 准备材料

**企业备案**：
- 营业执照（电子版，清晰完整）
- 法人身份证正反面
- 网站负责人身份证正反面
- 域名证书（域名持有者 = 备案主体）
- 阿里云服务器（购买后获取备案服务码）
- 网站负责人手机号（需短信核验）

**前置审批**（如涉及）：
- 号码查询类：一般不需要特殊前置审批
- 但若涉及征信查询、金融数据等，可能需要相关资质

### 2.2 备案时间线

```
Day 1-2:   购买阿里云服务器 + 域名
Day 1-2:   阿里云备案系统提交申请
Day 2-3:   阿里云初审（1-2 工作日）
Day 3-23:  管局审核（1-20 工作日，各省不同）
Day 23-30: 完成公安网安备案
Day 30+:   网站底部添加备案号，正式上线
```

**总耗时：约 1 个月**

### 2.3 备案后必须做的事

1. **网站底部添加 ICP 备案号**
   ```html
   <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备XXXXXXXX号</a>
   ```

2. **30 日内完成公安网安备案**
   - 访问 [全国互联网安全管理服务平台](http://www.beian.gov.cn/portal/index.do)
   - 注册账号 → 提交网站信息 → 获取公安备案号

3. **网站底部添加公安备案号**
   ```html
   <a href="http://www.beian.gov.cn/portal/index.do" target="_blank">
     <img src="beian-icon.png" /> 浙公网安备 XXXXXXXXXXXX号
   </a>
   ```

---

## 三、后端生产部署方案

### 3.1 推荐架构（阿里云）

```
用户
  │
  ▼
┌─────────────────────────────────────────┐
│  CDN (静态资源加速)                      │  阿里云 CDN
│  - 前端 H5 静态文件                      │  - 全球加速
│  - 图片/JS/CSS                          │  - 缓存策略
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SLB (负载均衡)                          │  阿里云 SLB
│  - HTTPS 终止                            │  - 多可用区
│  - 健康检查                              │  - SSL 证书
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ECS 集群 (2-4 台)                       │  阿里云 ECS
│  ┌─────────┐ ┌─────────┐               │  - 4核8G 起步
│  │ Gateway │ │ Gateway │               │  - CentOS / Ubuntu
│  │  :9001  │ │  :9001  │               │  - 安全组配置
│  └────┬────┘ └────┬────┘               │
│       └─────┬─────┘                     │
│             ▼                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Query   │ │ Auth    │ │ User    │   │
│  │ :9002   │ │ :9003   │ │ :9004   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  数据层                                  │
│  ┌──────────┐ ┌──────────┐             │
│  │ RDS MySQL│ │ Redis    │             │  阿里云 RDS + Redis
│  │ 主从架构  │ │ 集群     │             │  - 自动备份
│  │ 自动备份  │ │ 会话缓存  │             │  - 监控告警
│  └──────────┘ └──────────┘             │
│  ┌──────────┐                          │
│  │ OSS      │                          │  阿里云 OSS
│  │ 静态资源  │                          │  - 图片/文件存储
│  └──────────┘                          │
└─────────────────────────────────────────┘
```

### 3.2 服务器配置建议

| 服务 | 配置 | 数量 | 月费用（预估） |
|---|---|---|---|
| ECS (Gateway) | 4核8G | 2 | ~¥400 |
| ECS (业务服务) | 4核8G | 2 | ~¥400 |
| RDS MySQL | 2核4G 50GB | 1 | ~¥300 |
| Redis | 1G 主从 | 1 | ~¥200 |
| SLB | 标准型 | 1 | ~¥100 |
| CDN | 按流量 | - | ~¥100 |
| OSS | 按存储/流量 | - | ~¥50 |
| **总计** | | | **~¥1550/月** |

> 初期可用单台 ECS（4核8G）+ RDS + Redis 起步，月费约 **¥800**。

### 3.3 部署步骤

#### Step 1: 购买阿里云资源

1. 注册阿里云账号（企业认证）
2. 购买域名（如 shucha.com）
3. 购买 ECS 实例（选择国内节点，如杭州/上海）
4. 购买 RDS for MySQL
5. 购买 Redis 实例
6. 购买 SLB + 配置 HTTPS 证书（免费 SSL）

#### Step 2: 环境准备

```bash
# 登录 ECS
ssh root@<ecs-ip>

# 安装 Java 17
yum install -y java-17-openjdk

# 安装 Maven
wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
tar -xzf apache-maven-3.9.6-bin.tar.gz -C /opt/
ln -s /opt/apache-maven-3.9.6/bin/mvn /usr/local/bin/mvn

# 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 安装 Nginx
yum install -y nginx
systemctl enable nginx
```

#### Step 3: 配置 Nginx（反向代理 + HTTPS）

```nginx
# /etc/nginx/conf.d/shucha.conf
server {
    listen 80;
    server_name h5.shucha.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name h5.shucha.com;

    ssl_certificate /etc/nginx/ssl/shucha.crt;
    ssl_certificate_key /etc/nginx/ssl/shucha.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # 前端静态资源
    location / {
        root /var/www/shucha-h5;
        try_files $uri $uri/ /index.html;
    }

    # API 代理到 Gateway
    location /api/ {
        proxy_pass http://localhost:9001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Step 4: 部署后端服务

```bash
# 上传代码到服务器
git clone https://github.com/your-org/shucha-platform.git /opt/shucha

# 修改配置文件（生产环境）
cd /opt/shucha/backend/shucha-query/src/main/resources
# 修改 application.yml：
# - MySQL 地址改为 RDS 内网地址
# - Redis 地址改为 Redis 内网地址
# - Nacos 地址改为 Nacos 内网地址

# 编译打包
cd /opt/shucha/backend
mvn clean package -DskipTests

# 启动服务（使用 systemd 管理）
# 创建 /etc/systemd/system/shucha-gateway.service
cat > /etc/systemd/system/shucha-gateway.service << 'EOF'
[Unit]
Description=Shucha Gateway
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/shucha/backend/shucha-gateway
ExecStart=/usr/bin/java -jar target/shucha-gateway-0.1.0-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 同理创建 shucha-query.service, shucha-auth.service, shucha-user.service

systemctl daemon-reload
systemctl enable shucha-gateway shucha-query shucha-auth shucha-user
systemctl start shucha-gateway shucha-query shucha-auth shucha-user
```

#### Step 5: 部署前端

```bash
# 本地编译前端
cd /opt/shucha/frontend
npm install
npm run build:h5

# 上传到服务器
scp -r dist/build/h5/* root@<ecs-ip>:/var/www/shucha-h5/
```

#### Step 6: 配置域名解析

在阿里云域名控制台：
- `h5.shucha.com` → A 记录 → ECS 公网 IP
- `api.shucha.com` → A 记录 → ECS 公网 IP（或 SLB IP）

---

## 四、支付接入合规要求

### 4.1 微信支付 H5 支付

**必备条件**：
- [ ] 企业营业执照
- [ ] 域名已完成 ICP 备案
- [ ] 备案主体与微信支付商户号主体一致
- [ ] 网站支持 HTTPS（TLS 1.2+）
- [ ] 网站底部显示 ICP 备案号

**配置路径**：
1. 注册微信支付商户号
2. 登录 [商户平台](https://pay.weixin.qq.com/) → 产品中心 → 开发配置 → H5 支付
3. 添加支付域名：`h5.shucha.com`
4. 上传 ICP 备案截图
5. 填写使用场景描述
6. 等待审核（3-5 工作日）

### 4.2 支付宝支付

**必备条件**：
- [ ] 企业营业执照
- [ ] 域名已完成 ICP 备案
- [ ] 备案主体与支付宝企业认证主体一致
- [ ] 强制 HTTPS + HSTS
- [ ] 有效 SSL 证书（DV 及以上）

**配置路径**：
1. 注册支付宝企业账号
2. 登录 [支付宝开放平台](https://open.alipay.com/) → 开发设置 → 服务器域名
3. 添加域名白名单
4. 上传 ICP 备案截图
5. 等待审核

### 4.3 支付域名配置对比

| 维度 | 微信支付 | 支付宝 |
|---|---|---|
| 备案要求 | 必须 | 必须 |
| HTTPS | 必须 | 必须 + HSTS |
| 主体一致性 | 必须 | 必须 |
| 审核周期 | 3-5 工作日 | 3-5 工作日 |
| 域名数量限制 | 最多 5 个 | 无明确上限 |

---

## 五、安全合规清单

### 5.1 上线前必须完成

- [ ] ICP 备案（工信部）
- [ ] 公安网安备案（30 日内）
- [ ] HTTPS 证书配置
- [ ] 网站底部 ICP 备案号 + 公安备案号
- [ ] 《用户协议》页面
- [ ] 《隐私政策》页面
- [ ] 个人信息保护合规评估
- [ ] 支付接口审核通过

### 5.2 后续需补充（业务扩展时）

- [ ] ICP 许可证（涉及付费/经营性业务）
- [ ] 等保测评（二级或三级，视业务规模）
- [ ] 数据安全评估（涉及个人信息处理）
- [ ] 增值电信业务经营许可证（如涉及电信业务）

---

## 六、快速启动检查清单

```
□ 购买域名（shucha.com）
□ 购买阿里云 ECS（国内节点）
□ 购买 RDS MySQL + Redis
□ 阿里云备案系统提交 ICP 备案
□ 等待管局审核（1-20 工作日）
□ ICP 备案通过后，完成公安网安备案
□ 配置域名解析（h5.shucha.com → ECS IP）
□ 配置 Nginx + HTTPS
□ 部署后端服务（systemd）
□ 部署前端静态资源
□ 申请微信支付商户号 + 配置 H5 支付域名
□ 申请支付宝企业账号 + 配置域名白名单
□ 网站底部添加 ICP + 公安备案号
□ 上线！
```

---

## 七、费用预估（首年）

| 项目 | 费用 |
|---|---|
| 域名（.com） | ~¥60/年 |
| 阿里云 ECS（4核8G × 2） | ~¥9600/年 |
| RDS MySQL（2核4G） | ~¥3600/年 |
| Redis（1G） | ~¥2400/年 |
| SLB | ~¥1200/年 |
| CDN + OSS | ~¥1800/年 |
| SSL 证书（免费 DV） | ¥0 |
| **基础设施总计** | **~¥18,660/年** |
| 微信支付手续费 | 0.6% 交易额 |
| 支付宝手续费 | 0.6% 交易额 |

> 初期可缩减至单台 ECS + 基础 RDS，首年约 **¥10,000**。

---

## 八、Docker 容器化部署（推荐）

### 8.1 镜像构建

每个微服务已配置多阶段 Dockerfile：

```bash
# 构建所有服务镜像
cd /workspace/shucha-platform

# Gateway
docker build -t shucha/gateway:0.1.0 -f backend/shucha-gateway/Dockerfile backend/

# Query
docker build -t shucha/query:0.1.0 -f backend/shucha-query/Dockerfile backend/

# Auth
docker build -t shucha/auth:0.1.0 -f backend/shucha-auth/Dockerfile backend/

# User
docker build -t shucha/user:0.1.0 -f backend/shucha-user/Dockerfile backend/
```

### 8.2 生产环境启动

```bash
# 使用 docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d

# 查看状态
docker compose -f docker-compose.prod.yml ps

# 查看日志
docker compose -f docker-compose.prod.yml logs -f gateway

# 滚动更新（零停机）
docker compose -f docker-compose.prod.yml up -d --no-deps --scale query=2 query
```

### 8.3 环境变量配置

生产配置通过环境变量注入：

| 变量 | 说明 | 默认值 |
|---|---|---|
| `NACOS_SERVER` | Nacos 地址 | `localhost:8848` |
| `MYSQL_HOST` | MySQL 主机 | `localhost` |
| `MYSQL_PORT` | MySQL 端口 | `3306` |
| `MYSQL_USER` | MySQL 用户名 | `shucha` |
| `MYSQL_PASSWORD` | MySQL 密码 | `shucha_pass_2026` |
| `REDIS_HOST` | Redis 主机 | `localhost` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `REDIS_PASSWORD` | Redis 密码 | (空) |

```bash
# 示例：使用阿里云 RDS
docker compose -f docker-compose.prod.yml up -d \
  -e MYSQL_HOST=rm-xxx.mysql.rds.aliyuncs.com \
  -e MYSQL_PASSWORD=your_secure_password \
  -e REDIS_HOST=r-xxx.redis.rds.aliyuncs.com
```

---

## 九、CI/CD 流水线（GitHub Actions）

### 9.1 工作流概览

| 工作流 | 触发条件 | 说明 |
|---|---|---|
| `ci.yml` | push 到 main/develop | 编译 + 测试 |
| `docker-build.yml` | push tag `v*` | 构建镜像 + 推送到 GHCR |
| `deploy.yml` | 手动触发 | SSH 部署到生产服务器 |

### 9.2 配置 Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

| Secret | 说明 |
|---|---|
| `SSH_PRIVATE_KEY` | 服务器 SSH 私钥 |
| `DEPLOY_HOST` | 生产服务器 IP/域名 |
| `DEPLOY_USER` | 服务器登录用户 |

### 9.3 发布流程

```bash
# 1. 打版本标签
git tag v0.1.1
git push origin v0.1.1

# 2. 自动触发 docker-build.yml，镜像推送到 GHCR
# 3. 在 GitHub Actions 页面手动触发 deploy.yml
# 4. 输入版本号 v0.1.1，选择环境 production
# 5. 自动 SSH 到服务器，拉取镜像，滚动更新
```

### 9.4 镜像地址

```
ghcr.io/<your-org>/shucha-gateway:0.1.0
ghcr.io/<your-org>/shucha-query:0.1.0
ghcr.io/<your-org>/shucha-auth:0.1.0
ghcr.io/<your-org>/shucha-user:0.1.0
```
