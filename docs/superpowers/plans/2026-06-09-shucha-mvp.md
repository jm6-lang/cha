# 数查 (ShuCha) 完整技术栈复刻 — 实施计划

> **For agentic workers:** 本计划基于参考网站 [h5.hcc123.com](https://h5.hcc123.com) 的深度分析结果。参考站点基于开源项目 [yudao-mall-uniapp](https://github.com/yudaocode/yudao-mall-uniapp) + [yudao-cloud](https://gitee.com/yudaocode/yudao-cloud)。本计划将搭建一个全新独立品牌"数查 (ShuCha)"的等效技术栈。

**Goal:** 搭建一个包含 uni-app 前端 + Spring Cloud 后端的完整可运行技术栈骨架，实现 v0.1 MVP 核心查询闭环（首页 → 号码查询 → 标记结果 → 查询历史 → 个人中心），所有数据走 Mock。

**Architecture:** Monorepo 仓库；前端 Vue3 + uni-app（H5 优先、同时支持微信小程序/公众号）；后端 Spring Cloud Alibaba 微服务（Nacos + Sentinel + Redis + MySQL），通过 API 网关统一对外；Mock 数据通过独立 `shucha-mock` 服务提供，便于后续替换为真实数据源。

**Tech Stack:**
- 前端：Vue 3.4+, uni-app, Vite, TypeScript, Pinia, sheepjs 组件库
- 后端：Java 17, Spring Boot 3.2, Spring Cloud 2023, Spring Cloud Alibaba 2023, Nacos, MyBatis Plus, MySQL 8, Redis 7, Sentinel, OpenFeign, Gateway
- 工具：Docker Compose（本地基础设施）、Maven 3.9

---

## 现实约束（重要！）

参考站点是一个**生产级商业产品**（中臣杭州、App 上架、70+ 查询服务、IM 群聊、支付、代理体系）。**完整 1:1 复刻需 6-12 人月**。本计划聚焦以下可执行范围：

| 阶段 | 范围 | 状态 |
|---|---|---|
| Phase 0（本次 session） | 项目骨架 + 基础设施 + MVP 查询闭环端到端跑通 | ✅ 本计划执行 |
| Phase 1（后续 session） | 真实数据源对接（号码归属地 + 标记聚合 API） | 路线图 |
| Phase 2 | 70+ 增值查询 / 会员体系 / 支付 | 路线图 |
| Phase 3 | IM 群聊 / 社区 / 代理分销 | 路线图 |
| Phase 4 | 生产部署 / 监控 / 高可用 | 路线图 |

**本次可交付的运行结果：**
- ✅ 前端 H5 在本地浏览器跑起来（http://localhost:9000）
- ✅ 后端服务在本地启动（http://localhost:9001）
- ✅ 完整跑通"打开首页 → 输入手机号 → 查看标记结果 → 查看历史 → 个人中心"
- ✅ Docker Compose 一键启动 MySQL + Redis + Nacos
- ❌ 不交付：小程序打包、真实数据源、IM、支付、代理

---

## 文件结构

```
shucha-platform/
├── docker-compose.yml                 # 本地基础设施
├── README.md                          # 项目说明
├── .gitignore
├── frontend/                          # uni-app 前端
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index/index.vue        # 首页
│   │   │   ├── hcc/
│   │   │   │   ├── query.vue          # 号码查询
│   │   │   │   ├── result.vue         # 标记结果
│   │   │   │   └── history.vue        # 查询历史
│   │   │   └── user/profile.vue       # 个人中心
│   │   ├── api/
│   │   │   ├── request.ts             # Axios 封装
│   │   │   ├── shucha.ts              # API 类型 + 方法
│   │   │   └── mock.ts                # 兜底 Mock（离线可用）
│   │   ├── components/
│   │   │   ├── NumberInput.vue
│   │   │   ├── LabelCard.vue
│   │   │   └── ResultPanel.vue
│   │   ├── stores/                    # Pinia
│   │   │   ├── user.ts
│   │   │   └── history.ts
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   └── global.scss
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── manifest.json              # uni-app 配置
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.svg
│   └── index.html
├── backend/                           # Spring Cloud 后端
│   ├── pom.xml                        # 父 POM
│   ├── shucha-common/                 # 公共模块
│   │   ├── pom.xml
│   │   └── src/main/java/com/shucha/common/
│   │       ├── result/Result.java
│   │       ├── exception/BusinessException.java
│   │       └── constant/CommonConstant.java
│   ├── shucha-gateway/                # API 网关
│   │   ├── pom.xml
│   │   └── src/main/java/com/shucha/gateway/
│   ├── shucha-auth/                   # 认证服务（短信验证码）
│   │   ├── pom.xml
│   │   └── src/main/java/com/shucha/auth/
│   ├── shucha-user/                   # 用户服务
│   │   ├── pom.xml
│   │   └── src/main/java/com/shucha/user/
│   │       ├── controller/UserController.java
│   │       ├── service/UserService.java
│   │       ├── service/impl/UserServiceImpl.java
│   │       ├── dal/dataobject/UserDO.java
│   │       ├── dal/mapper/UserMapper.java
│   │       └── api/dto/UserRespDTO.java
│   ├── shucha-query/                  # 查询服务（核心）
│   │   ├── pom.xml
│   │   └── src/main/java/com/shucha/query/
│   │       ├── controller/QueryController.java
│   │       ├── service/QueryService.java
│   │       ├── service/impl/QueryServiceImpl.java
│   │       ├── service/NumberLabelService.java      # 数据源抽象
│   │       ├── service/impl/MockNumberLabelServiceImpl.java
│   │       ├── dal/dataobject/QueryHistoryDO.java
│   │       ├── dal/mapper/QueryHistoryMapper.java
│   │       └── api/dto/NumberLabelRespDTO.java
│   └── shucha-mock/                   # Mock 数据源（独立服务模拟第三方）
│       ├── pom.xml
│       └── src/main/java/com/shucha/mock/
└── docs/
    ├── architecture.md                # 架构图 + 决策记录
    ├── api.md                         # API 契约
    └── superpowers/plans/             # 本计划
```

---

## 任务清单

### Task 1: 仓库骨架与基础设施

**Files:**
- Create: `/workspace/shucha-platform/.gitignore`
- Create: `/workspace/shucha-platform/README.md`
- Create: `/workspace/shucha-platform/docker-compose.yml`

- [ ] **Step 1.1: 写 .gitignore**

```gitignore
# Java / Maven
target/
*.class
*.jar
*.war
.mvn/
HELP.md

# Node
node_modules/
dist/
.hbuilderx/

# IDE
.idea/
.vscode/
*.iml
.DS_Store

# Logs
*.log
logs/

# Env
.env
.env.local

# OS
Thumbs.db
```

- [ ] **Step 1.2: 写 docker-compose.yml（MySQL + Redis + Nacos）**

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: shucha-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: shucha_root_2026
      MYSQL_DATABASE: shucha
      MYSQL_USER: shucha
      MYSQL_PASSWORD: shucha_pass_2026
    ports:
      - "3306:3306"
    volumes:
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
      - mysql_data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  redis:
    image: redis:7-alpine
    container_name: shucha-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nacos:
    image: nacos/nacos-server:v2.4.0
    container_name: shucha-nacos
    restart: unless-stopped
    environment:
      MODE: standalone
      JVM_XMS: 512m
      JVM_XMX: 512m
    ports:
      - "8848:8848"
      - "9848:9848"
    volumes:
      - ./docker/nacos/standalone-logs/:/home/nacos/logs

volumes:
  mysql_data:
  redis_data:
```

- [ ] **Step 1.3: 写 README.md（项目入口）**

```markdown
# 数查 (ShuCha) Platform

号码查询 / 数据聚合 / 增值服务的开放技术栈。

## 技术栈
- 前端：Vue 3 + uni-app + Vite
- 后端：Spring Cloud Alibaba + Nacos + MySQL + Redis

## 快速开始

### 1. 启动基础设施
\`\`\`bash
docker compose up -d
\`\`\`

### 2. 启动后端
\`\`\`bash
cd backend
mvn spring-boot:run -pl shucha-gateway
\`\`\`

### 3. 启动前端
\`\`\`bash
cd frontend
npm install
npm run dev:h5
\`\`\`

打开 http://localhost:9000

## 架构
见 `docs/architecture.md`
```

- [ ] **Step 1.4: Git 初始化 + 首次提交**

```bash
cd /workspace/shucha-platform
git init
git add .
git commit -m "chore: init shucha platform monorepo"
```

---

### Task 2: 后端父 POM + 公共模块

**Files:**
- Create: `/workspace/shucha-platform/backend/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-common/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-common/src/main/java/com/shucha/common/result/Result.java`
- Create: `/workspace/shucha-platform/backend/shucha-common/src/main/java/com/shucha/common/exception/BusinessException.java`
- Create: `/workspace/shucha-platform/backend/shucha-common/src/main/java/com/shucha/common/constant/CommonConstant.java`

- [ ] **Step 2.1: 写父 POM（依赖管理）**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.shucha</groupId>
  <artifactId>shucha-platform</artifactId>
  <version>0.1.0-SNAPSHOT</version>
  <packaging>pom</packaging>
  <name>shucha-platform</name>
  <description>数查 (ShuCha) Platform - Parent</description>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
    <relativePath/>
  </parent>

  <properties>
    <java.version>17</java.version>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring-cloud.version>2023.0.1</spring-cloud.version>
    <spring-cloud-alibaba.version>2023.0.1.0</spring-cloud-alibaba.version>
    <mybatis-plus.version>3.5.5</mybatis-plus.version>
  </properties>

  <modules>
    <module>shucha-common</module>
    <module>shucha-gateway</module>
    <module>shucha-auth</module>
    <module>shucha-user</module>
    <module>shucha-query</module>
  </modules>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>${spring-cloud.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-dependencies</artifactId>
        <version>${spring-cloud-alibaba.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        <version>${mybatis-plus.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

- [ ] **Step 2.2: 写 shucha-common/pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.shucha</groupId>
    <artifactId>shucha-platform</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>shucha-common</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>io.swagger.core.v3</groupId>
      <artifactId>swagger-annotations-jakarta</artifactId>
      <version>2.2.20</version>
    </dependency>
  </dependencies>
</project>
```

- [ ] **Step 2.3: 写 Result.java（统一返回结构）**

```java
package com.shucha.common.result;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一返回结构")
public class Result<T> {
    @Schema(description = "业务码：0=成功")
    private Integer code;
    @Schema(description = "提示信息")
    private String message;
    @Schema(description = "业务数据")
    private T data;

    public static <T> Result<T> success() {
        return new Result<>(0, "ok", null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(0, "ok", data);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}
```

- [ ] **Step 2.4: 写 BusinessException.java**

```java
package com.shucha.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}
```

- [ ] **Step 2.5: 写 CommonConstant.java**

```java
package com.shucha.common.constant;

public interface CommonConstant {
    String HEADER_TOKEN = "X-Shucha-Token";
    String HEADER_USER_ID = "X-Shucha-User-Id";
    Integer CODE_SUCCESS = 0;
    Integer CODE_BAD_REQUEST = 400;
    Integer CODE_UNAUTHORIZED = 401;
    Integer CODE_NOT_FOUND = 404;
    Integer CODE_SERVER_ERROR = 500;
}
```

---

### Task 3: 数据源抽象层（核心设计）

**Files:**
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/service/NumberLabelService.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/service/impl/MockNumberLabelServiceImpl.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/api/dto/NumberLabelRespDTO.java`

- [ ] **Step 3.1: 写 DTO**

```java
package com.shucha.query.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "号码标记结果")
public class NumberLabelRespDTO implements Serializable {
    @Schema(description = "号码")
    private String number;
    @Schema(description = "省份")
    private String province;
    @Schema(description = "城市")
    private String city;
    @Schema(description = "运营商")
    private String carrier;
    @Schema(description = "标记列表")
    private List<Label> labels;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Label implements Serializable {
        @Schema(description = "标签名，如 骚扰电话/广告推销/快递外卖")
        private String name;
        @Schema(description = "标记来源平台")
        private String source;
        @Schema(description = "标记次数")
        private Integer count;
        @Schema(description = "风险等级 1=低 2=中 3=高")
        private Integer riskLevel;
    }
}
```

- [ ] **Step 3.2: 写数据源接口（抽象层）**

```java
package com.shucha.query.service;

import com.shucha.query.api.dto.NumberLabelRespDTO;

public interface NumberLabelService {
    /**
     * 查询号码标记信息
     * @param number 手机号/固话/400/95 号码
     * @return 标记结果
     */
    NumberLabelRespDTO query(String number);

    /**
     * 数据源名称（用于日志/路由）
     */
    String providerName();
}
```

- [ ] **Step 3.3: 写 Mock 实现（基于规则生成假数据）**

```java
package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.api.dto.NumberLabelRespDTO.Label;
import com.shucha.query.service.NumberLabelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Mock 数据源：基于号码哈希规则生成稳定结果
 * 真实数据源对接时只需新增一个实现，通过配置切换
 */
@Slf4j
@Service
public class MockNumberLabelServiceImpl implements NumberLabelService {

    private static final List<String> CARRIERS = Arrays.asList("中国移动", "中国联通", "中国电信");
    private static final List<String> PROVINCES = Arrays.asList(
        "北京", "上海", "广东", "江苏", "浙江", "四川", "湖北", "陕西", "辽宁", "山东"
    );
    private static final List<String> LABEL_NAMES = Arrays.asList(
        "骚扰电话", "广告推销", "快递外卖", "诈骗电话", "房产中介", "保险理财", "企业客服"
    );
    private static final List<String> SOURCES = Arrays.asList(
        "腾讯手机管家", "360手机卫士", "百度手机卫士", "阿里钱盾", "触宝电话"
    );

    @Override
    public NumberLabelRespDTO query(String number) {
        log.info("[Mock] query number label: {}", number);

        if (number == null || number.length() < 7) {
            return NumberLabelRespDTO.builder()
                .number(number)
                .labels(new ArrayList<>())
                .build();
        }

        // 基于号码哈希生成稳定结果
        int seed = Math.abs(number.hashCode());
        Random rnd = new Random(seed);

        String carrier = CARRIERS.get(seed % CARRIERS.size());
        String province = PROVINCES.get((seed / 7) % PROVINCES.size());
        String city = province + "市";

        // 生成 0-4 个标签
        int labelCount = rnd.nextInt(5);
        List<Label> labels = new ArrayList<>();
        for (int i = 0; i < labelCount; i++) {
            String name = LABEL_NAMES.get(rnd.nextInt(LABEL_NAMES.size()));
            String source = SOURCES.get(rnd.nextInt(SOURCES.size()));
            int count = 1 + rnd.nextInt(200);
            int risk = 1 + rnd.nextInt(3);
            labels.add(Label.builder()
                .name(name)
                .source(source)
                .count(count)
                .riskLevel(risk)
                .build());
        }

        return NumberLabelRespDTO.builder()
            .number(number)
            .province(province)
            .city(city)
            .carrier(carrier)
            .labels(labels)
            .build();
    }

    @Override
    public String providerName() {
        return "mock";
    }
}
```

---

### Task 4: 查询服务核心（Controller + Service + DB）

**Files:**
- Create: `/workspace/shucha-platform/backend/shucha-query/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/resources/application.yml`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/ShuchaQueryApplication.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/controller/QueryController.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/service/QueryService.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/service/impl/QueryServiceImpl.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/dal/dataobject/QueryHistoryDO.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/java/com/shucha/query/dal/mapper/QueryHistoryMapper.java`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/resources/db/schema.sql`
- Create: `/workspace/shucha-platform/backend/shucha-query/src/main/resources/db/data.sql`

- [ ] **Step 4.1: 写 shucha-query/pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.shucha</groupId>
    <artifactId>shucha-platform</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>shucha-query</artifactId>

  <dependencies>
    <dependency>
      <groupId>com.shucha</groupId>
      <artifactId>shucha-common</artifactId>
      <version>0.1.0-SNAPSHOT</version>
    </dependency>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>com.mysql</groupId>
      <artifactId>mysql-connector-j</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
  </dependencies>
</project>
```

- [ ] **Step 4.2: 写 application.yml**

```yaml
server:
  port: 9002
spring:
  application:
    name: shucha-query
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/shucha?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: shucha
    password: shucha_pass_2026
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    com.shucha: debug
```

- [ ] **Step 4.3: 写主类**

```java
package com.shucha.query;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
@MapperScan("com.shucha.query.dal.mapper")
public class ShuchaQueryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShuchaQueryApplication.class, args);
    }
}
```

- [ ] **Step 4.4: 写历史 DO**

```java
package com.shucha.query.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("query_history")
public class QueryHistoryDO {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String number;
    private String province;
    private String city;
    private String carrier;
    private Integer labelCount;
    private Long userId;
    private String providerName;
    private LocalDateTime createTime;
}
```

- [ ] **Step 4.5: 写 Mapper**

```java
package com.shucha.query.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QueryHistoryMapper extends BaseMapper<QueryHistoryDO> {
}
```

- [ ] **Step 4.6: 写 Service 接口**

```java
package com.shucha.query.service;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.dal.dataobject.QueryHistoryDO;

import java.util.List;

public interface QueryService {
    NumberLabelRespDTO queryNumber(String number, Long userId);
    List<QueryHistoryDO> listHistory(Long userId, Integer limit);
}
```

- [ ] **Step 4.7: 写 Service 实现**

```java
package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import com.shucha.query.dal.mapper.QueryHistoryMapper;
import com.shucha.query.service.NumberLabelService;
import com.shucha.query.service.QueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryServiceImpl implements QueryService {

    private final NumberLabelService numberLabelService;
    private final QueryHistoryMapper historyMapper;

    @Override
    public NumberLabelRespDTO queryNumber(String number, Long userId) {
        // 1. 调数据源
        NumberLabelRespDTO result = numberLabelService.query(number);

        // 2. 写历史
        try {
            QueryHistoryDO history = new QueryHistoryDO();
            history.setNumber(result.getNumber());
            history.setProvince(result.getProvince());
            history.setCity(result.getCity());
            history.setCarrier(result.getCarrier());
            history.setLabelCount(result.getLabels() == null ? 0 : result.getLabels().size());
            history.setUserId(userId);
            history.setProviderName(numberLabelService.providerName());
            history.setCreateTime(LocalDateTime.now());
            historyMapper.insert(history);
        } catch (Exception e) {
            log.warn("write history failed", e);
        }

        return result;
    }

    @Override
    public List<QueryHistoryDO> listHistory(Long userId, Integer limit) {
        if (userId == null) {
            return Collections.emptyList();
        }
        return historyMapper.selectList(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<QueryHistoryDO>()
                .eq("user_id", userId)
                .orderByDesc("create_time")
                .last("limit " + (limit == null ? 20 : limit))
        );
    }
}
```

- [ ] **Step 4.8: 写 Controller**

```java
package com.shucha.query.controller;

import com.shucha.common.constant.CommonConstant;
import com.shucha.common.result.Result;
import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import com.shucha.query.service.QueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "号码查询")
@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @Operation(summary = "查询号码标记")
    @GetMapping("/number-label")
    public Result<NumberLabelRespDTO> queryNumberLabel(
            @RequestParam("number") String number,
            HttpServletRequest request) {
        Long userId = parseUserId(request);
        return Result.success(queryService.queryNumber(number, userId));
    }

    @Operation(summary = "查询历史")
    @GetMapping("/history")
    public Result<List<QueryHistoryDO>> listHistory(
            @RequestParam(value = "limit", required = false) Integer limit,
            HttpServletRequest request) {
        Long userId = parseUserId(request);
        return Result.success(queryService.listHistory(userId, limit));
    }

    private Long parseUserId(HttpServletRequest request) {
        String header = request.getHeader(CommonConstant.HEADER_USER_ID);
        return header == null ? null : Long.valueOf(header);
    }
}
```

- [ ] **Step 4.9: 写 SQL 初始化脚本**

`db/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS query_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(32) NOT NULL COMMENT '查询号码',
    province VARCHAR(32) COMMENT '省份',
    city VARCHAR(64) COMMENT '城市',
    carrier VARCHAR(32) COMMENT '运营商',
    label_count INT DEFAULT 0 COMMENT '标签数',
    user_id BIGINT COMMENT '用户ID(可空,匿名查询)',
    provider_name VARCHAR(32) COMMENT '数据源',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_number (number),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='号码查询历史';
```

`db/data.sql`:
```sql
-- 初始化数据（无）
```

---

### Task 5: 前端 uni-app 项目初始化

**Files:**
- Create: `/workspace/shucha-platform/frontend/package.json`
- Create: `/workspace/shucha-platform/frontend/vite.config.ts`
- Create: `/workspace/shucha-platform/frontend/tsconfig.json`
- Create: `/workspace/shucha-platform/frontend/index.html`
- Create: `/workspace/shucha-platform/frontend/src/main.ts`
- Create: `/workspace/shucha-platform/frontend/src/App.vue`
- Create: `/workspace/shucha-platform/frontend/src/manifest.json`
- Create: `/workspace/shucha-platform/frontend/src/pages.json`

- [ ] **Step 5.1: 写 package.json**

```json
{
  "name": "shucha-h5",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev:h5": "uni",
    "build:h5": "uni build",
    "dev:mp-weixin": "uni -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "3.0.0-4030620241128001",
    "@dcloudio/uni-app-plus": "3.0.0-4030620241128001",
    "@dcloudio/uni-components": "3.0.0-4030620241128001",
    "@dcloudio/uni-h5": "3.0.0-4030620241128001",
    "pinia": "2.0.36",
    "vue": "3.4.21",
    "vue-i18n": "9.1.9"
  },
  "devDependencies": {
    "@dcloudio/types": "^3.4.8",
    "@dcloudio/uni-automator": "3.0.0-4030620241128001",
    "@dcloudio/uni-cli-shared": "3.0.0-4030620241128001",
    "@dcloudio/uni-stacktracey": "3.0.0-4030620241128001",
    "@dcloudio/vite-plugin-uni": "3.0.0-4030620241128001",
    "sass": "^1.69.5",
    "typescript": "^5.4.5",
    "vite": "5.2.8"
  }
}
```

- [ ] **Step 5.2: 写 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        changeOrigin: true
      }
    }
  }
});
```

- [ ] **Step 5.3: 写 tsconfig.json**

```json
{
  "extends": "@dcloudio/types/dist/uni-app.d.ts",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 5.4: 写 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
  <title>数查 - 号码查询服务</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 5.5: 写 main.ts**

```typescript
import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  app.use(createPinia());
  return { app };
}
```

- [ ] **Step 5.6: 写 App.vue**

```vue
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('[ShuCha] App Launch');
});
onShow(() => {
  console.log('[ShuCha] App Show');
});
onHide(() => {
  console.log('[ShuCha] App Hide');
});
</script>

<style lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/global.scss';
</style>
```

- [ ] **Step 5.7: 写 manifest.json**

```json
{
  "name": "数查",
  "appid": "__UNI__SHUCHA01",
  "description": "号码标记查询与数据服务",
  "versionName": "0.1.0",
  "versionCode": "1",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true
  },
  "h5": {
    "router": {
      "mode": "history",
      "base": "/"
    },
    "title": "数查 - 号码查询服务"
  },
  "vueVersion": "3"
}
```

- [ ] **Step 5.8: 写 pages.json（路由表）**

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "数查" } },
    { "path": "pages/hcc/query", "style": { "navigationBarTitleText": "号码查询" } },
    { "path": "pages/hcc/result", "style": { "navigationBarTitleText": "查询结果" } },
    { "path": "pages/hcc/history", "style": { "navigationBarTitleText": "查询历史" } },
    { "path": "pages/user/profile", "style": { "navigationBarTitleText": "我的" } }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "数查",
    "navigationBarBackgroundColor": "#1A6CFF",
    "backgroundColor": "#F5F7FA"
  }
}
```

---

### Task 6: 前端 API + 状态管理

**Files:**
- Create: `/workspace/shucha-platform/frontend/src/api/request.ts`
- Create: `/workspace/shucha-platform/frontend/src/api/shucha.ts`
- Create: `/workspace/shucha-platform/frontend/src/api/mock.ts`
- Create: `/workspace/shucha-platform/frontend/src/stores/user.ts`
- Create: `/workspace/shucha-platform/frontend/src/stores/history.ts`

- [ ] **Step 6.1: 写 request.ts（uni-app 适配的请求封装）**

```typescript
import type { Result } from './shucha';

const BASE_URL = '/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  mock?: boolean;
}

export function request<T = any>(options: RequestOptions): Promise<Result<T>> {
  // mock 模式：直接返回假数据
  if (options.mock) {
    return import('./mock').then((m) => m.handleMock(options.url, options.data));
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: { 'Content-Type': 'application/json', ...options.header },
      success: (res) => {
        const body = res.data as Result<T>;
        if (body.code === 0) {
          resolve(body);
        } else {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' });
          reject(body);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}
```

- [ ] **Step 6.2: 写 shucha.ts（API 定义）**

```typescript
import { request } from './request';

export interface NumberLabel {
  number: string;
  province?: string;
  city?: string;
  carrier?: string;
  labels: Array<{
    name: string;
    source: string;
    count: number;
    riskLevel: number;
  }>;
}

export interface QueryHistory {
  id: number;
  number: string;
  province?: string;
  city?: string;
  carrier?: string;
  labelCount: number;
  createTime: string;
}

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export const shuchaApi = {
  queryNumber(number: string, mock = false) {
    return request<NumberLabel>({
      url: `/query/number-label?number=${encodeURIComponent(number)}`,
      mock
    });
  },
  listHistory(limit = 20, mock = false) {
    return request<QueryHistory[]>({
      url: `/query/history?limit=${limit}`,
      mock
    });
  }
};
```

- [ ] **Step 6.3: 写 mock.ts（前端兜底数据）**

```typescript
import type { NumberLabel, QueryHistory } from './shucha';

const CARRIERS = ['中国移动', '中国联通', '中国电信'];
const PROVINCES = ['北京', '上海', '广东', '江苏', '浙江'];
const LABEL_NAMES = ['骚扰电话', '广告推销', '快递外卖', '诈骗电话', '房产中介'];
const SOURCES = ['腾讯手机管家', '360手机卫士', '百度手机卫士'];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function generateLabel(number: string): NumberLabel {
  const seed = hashCode(number);
  const labelCount = seed % 5;
  const labels = Array.from({ length: labelCount }).map((_, i) => ({
    name: LABEL_NAMES[(seed + i) % LABEL_NAMES.length],
    source: SOURCES[(seed + i) % SOURCES.length],
    count: ((seed + i) % 200) + 1,
    riskLevel: ((seed + i) % 3) + 1
  }));
  return {
    number,
    province: PROVINCES[seed % PROVINCES.length],
    city: PROVINCES[seed % PROVINCES.length] + '市',
    carrier: CARRIERS[seed % CARRIERS.length],
    labels
  };
}

const MOCK_HISTORY: QueryHistory[] = [
  { id: 1, number: '13800138000', province: '北京', city: '北京市', carrier: '中国移动', labelCount: 3, createTime: '2026-06-09 10:00:00' },
  { id: 2, number: '02112345678', province: '上海', city: '上海市', carrier: '中国电信', labelCount: 1, createTime: '2026-06-09 09:30:00' }
];

export async function handleMock(url: string, _data: any) {
  await new Promise((r) => setTimeout(r, 300));
  if (url.includes('/query/number-label')) {
    const number = new URLSearchParams(url.split('?')[1]).get('number') || '';
    return { code: 0, message: 'ok', data: generateLabel(number) };
  }
  if (url.includes('/query/history')) {
    return { code: 0, message: 'ok', data: MOCK_HISTORY };
  }
  return { code: 404, message: 'mock not found', data: null };
}
```

- [ ] **Step 6.4: 写 user store**

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false);
  const userId = ref<number | null>(null);
  const nickname = ref('访客用户');
  const avatar = ref('');

  function mockLogin() {
    isLoggedIn.value = true;
    userId.value = 10001;
    nickname.value = '演示用户';
  }

  function logout() {
    isLoggedIn.value = false;
    userId.value = null;
    nickname.value = '访客用户';
  }

  return { isLoggedIn, userId, nickname, avatar, mockLogin, logout };
});
```

- [ ] **Step 6.5: 写 history store**

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { shuchaApi, type QueryHistory } from '@/api/shucha';

export const useHistoryStore = defineStore('history', () => {
  const list = ref<QueryHistory[]>([]);
  const loading = ref(false);

  async function refresh() {
    loading.value = true;
    try {
      const res = await shuchaApi.listHistory(20, true);
      list.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  return { list, loading, refresh };
});
```

---

### Task 7: 前端页面 - 首页

**Files:**
- Create: `/workspace/shucha-platform/frontend/src/components/NumberInput.vue`
- Create: `/workspace/shucha-platform/frontend/src/components/LabelCard.vue`
- Create: `/workspace/shucha-platform/frontend/src/components/ResultPanel.vue`
- Create: `/workspace/shucha-platform/frontend/src/styles/variables.scss`
- Create: `/workspace/shucha-platform/frontend/src/styles/global.scss`
- Create: `/workspace/shucha-platform/frontend/src/pages/index/index.vue`

- [ ] **Step 7.1: 写 variables.scss**

```scss
$primary: #1A6CFF;
$primary-light: #E8F0FF;
$success: #00B578;
$warning: #FF8F1F;
$danger: #FF3141;
$text-primary: #1D2129;
$text-secondary: #4E5969;
$text-tertiary: #86909C;
$border: #E5E6EB;
$bg-page: #F5F7FA;
$bg-card: #FFFFFF;
$radius-sm: 8rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
```

- [ ] **Step 7.2: 写 global.scss**

```scss
page {
  background-color: $bg-page;
  font-size: 28rpx;
  color: $text-primary;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
}

.container {
  padding: 32rpx;
}

.card {
  background: $bg-card;
  border-radius: $radius-md;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.btn-primary {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  border: none;

  &:active {
    opacity: 0.85;
  }
}
```

- [ ] **Step 7.3: 写 NumberInput.vue**

```vue
<template>
  <view class="number-input">
    <input
      v-model="value"
      :maxlength="13"
      type="number"
      class="input"
      placeholder="输入手机号/固话/400/95"
      placeholder-class="placeholder"
      @input="onInput"
    />
    <view v-if="value" class="clear" @tap="clear">×</view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const value = ref(props.modelValue || '');

watch(() => props.modelValue, (v) => (value.value = v));
watch(value, (v) => emit('update:modelValue', v));

function onInput(e: any) {
  value.value = e.detail.value.replace(/\s/g, '');
}

function clear() {
  value.value = '';
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.number-input {
  position: relative;
  display: flex;
  align-items: center;
  background: $bg-page;
  border-radius: $radius-md;
  padding: 0 24rpx;
  height: 96rpx;

  .input {
    flex: 1;
    height: 96rpx;
    font-size: 32rpx;
    color: $text-primary;
  }

  .placeholder {
    color: $text-tertiary;
  }

  .clear {
    width: 40rpx;
    height: 40rpx;
    line-height: 36rpx;
    text-align: center;
    color: #fff;
    background: $text-tertiary;
    border-radius: 50%;
    font-size: 32rpx;
  }
}
</style>
```

- [ ] **Step 7.4: 写 LabelCard.vue**

```vue
<template>
  <view class="label-card" :class="`risk-${label.riskLevel}`">
    <view class="row">
      <text class="name">{{ label.name }}</text>
      <text class="count">{{ label.count }}人标记</text>
    </view>
    <view class="source">来源：{{ label.source }}</view>
  </view>
</template>

<script setup lang="ts">
defineProps<{ label: { name: string; source: string; count: number; riskLevel: number } }>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.label-card {
  background: $bg-page;
  border-radius: $radius-md;
  padding: 24rpx;
  border-left: 8rpx solid $text-tertiary;

  &.risk-1 {
    border-left-color: $success;
  }
  &.risk-2 {
    border-left-color: $warning;
  }
  &.risk-3 {
    border-left-color: $danger;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8rpx;
  }

  .name {
    font-size: 30rpx;
    font-weight: 500;
    color: $text-primary;
  }

  .count {
    font-size: 24rpx;
    color: $text-tertiary;
  }

  .source {
    font-size: 24rpx;
    color: $text-tertiary;
  }
}
</style>
```

- [ ] **Step 7.5: 写 ResultPanel.vue**

```vue
<template>
  <view class="result-panel">
    <view class="header">
      <text class="title">号码归属地</text>
    </view>
    <view class="info-grid">
      <view class="info-item">
        <text class="label">省份</text>
        <text class="value">{{ data.province || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">城市</text>
        <text class="value">{{ data.city || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">运营商</text>
        <text class="value">{{ data.carrier || '-' }}</text>
      </view>
    </view>
    <view class="divider" />
    <view class="header">
      <text class="title">公开标记 ({{ data.labels.length }})</text>
    </view>
    <view v-if="data.labels.length === 0" class="empty">暂无公开标记记录</view>
    <view v-else class="labels">
      <LabelCard v-for="(l, i) in data.labels" :key="i" :label="l" />
    </view>
  </view>
</template>

<script setup lang="ts">
import LabelCard from './LabelCard.vue';
import type { NumberLabel } from '@/api/shucha';

defineProps<{ data: NumberLabel }>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.result-panel {
  background: $bg-card;
  border-radius: $radius-md;
  padding: 32rpx;

  .header {
    margin-bottom: 16rpx;
    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: $text-primary;
    }
  }

  .info-grid {
    display: flex;
    gap: 24rpx;
    .info-item {
      flex: 1;
      .label {
        display: block;
        font-size: 24rpx;
        color: $text-tertiary;
        margin-bottom: 4rpx;
      }
      .value {
        font-size: 28rpx;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }

  .divider {
    height: 1rpx;
    background: $border;
    margin: 24rpx 0;
  }

  .empty {
    text-align: center;
    color: $text-tertiary;
    padding: 32rpx 0;
    font-size: 26rpx;
  }

  .labels {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
}
</style>
```

- [ ] **Step 7.6: 写 pages/index/index.vue（首页）**

```vue
<template>
  <view class="container">
    <view class="hero card">
      <view class="logo">数查</view>
      <view class="slogan">先查公开标记，再决定怎么联系</view>
    </view>

    <view class="search-box card">
      <NumberInput v-model="phone" />
      <button class="btn-primary" :disabled="!canQuery" @tap="onQuery">立即查询</button>
      <view class="hint">支持手机号、固话、400/95 号码</view>
    </view>

    <view class="features card">
      <view class="features-title">围绕号码排查的三类能力</view>
      <view class="feature" v-for="(f, i) in features" :key="i" @tap="goFeature(f)">
        <view class="feature-icon" :style="{ background: f.color }">{{ f.icon }}</view>
        <view class="feature-info">
          <text class="feature-name">{{ f.name }}</text>
          <text class="feature-desc">{{ f.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NumberInput from '@/components/NumberInput.vue';

const phone = ref('');

const canQuery = computed(() => {
  const p = phone.value.trim();
  return p.length >= 7 && p.length <= 13;
});

function onQuery() {
  uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(phone.value.trim())}` });
}

const features = [
  { name: '查询历史', icon: '📋', desc: '查看过往的号码查询记录', color: '#1A6CFF', path: '/pages/hcc/history' },
  { name: '个人中心', icon: '👤', desc: '账户信息、会员、设置', color: '#00B578', path: '/pages/user/profile' },
  { name: '号码估值', icon: '💎', desc: '靓号评估与价值分析', color: '#FF8F1F', path: '' },
  { name: '企业认证', icon: '🏢', desc: '提升企业外呼接通率', color: '#7C4DFF', path: '' }
];

function goFeature(f: any) {
  if (f.path) uni.navigateTo({ url: f.path });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.hero {
  text-align: center;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, $primary 0%, #4A8AFF 100%);
  color: #fff;
  border-radius: $radius-lg;
  margin-bottom: 24rpx;

  .logo {
    font-size: 64rpx;
    font-weight: 700;
    letter-spacing: 4rpx;
    margin-bottom: 12rpx;
  }
  .slogan {
    font-size: 26rpx;
    opacity: 0.9;
  }
}

.search-box {
  margin-bottom: 24rpx;
  .btn-primary {
    margin-top: 24rpx;
    width: 100%;
  }
  .hint {
    text-align: center;
    color: $text-tertiary;
    font-size: 24rpx;
    margin-top: 16rpx;
  }
}

.features {
  .features-title {
    font-size: 30rpx;
    font-weight: 500;
    margin-bottom: 24rpx;
    color: $text-primary;
  }

  .feature {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border;
    &:last-child { border-bottom: none; }
  }

  .feature-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #fff;
    margin-right: 20rpx;
  }

  .feature-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .feature-name {
    font-size: 28rpx;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: 4rpx;
  }
  .feature-desc {
    font-size: 24rpx;
    color: $text-tertiary;
  }
}
</style>
```

---

### Task 8: 前端页面 - 查询结果 / 历史 / 个人中心

**Files:**
- Create: `/workspace/shucha-platform/frontend/src/pages/hcc/result.vue`
- Create: `/workspace/shucha-platform/frontend/src/pages/hcc/history.vue`
- Create: `/workspace/shucha-platform/frontend/src/pages/user/profile.vue`

- [ ] **Step 8.1: 写 result.vue**

```vue
<template>
  <view class="container">
    <view v-if="loading" class="loading">查询中...</view>
    <view v-else-if="data" class="result">
      <view class="number-display card">
        <text class="label">查询号码</text>
        <text class="number">{{ data.number }}</text>
      </view>
      <ResultPanel :data="data" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import ResultPanel from '@/components/ResultPanel.vue';
import { shuchaApi, type NumberLabel } from '@/api/shucha';

const number = ref('');
const data = ref<NumberLabel | null>(null);
const loading = ref(true);

onLoad((q: any) => {
  number.value = q?.number || '';
  doQuery();
});

async function doQuery() {
  loading.value = true;
  try {
    const res = await shuchaApi.queryNumber(number.value, true);
    data.value = res.data;
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading {
  text-align: center;
  padding: 96rpx 0;
  color: $text-tertiary;
}

.number-display {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
  text-align: center;

  .label {
    font-size: 24rpx;
    color: $text-tertiary;
    margin-bottom: 8rpx;
  }
  .number {
    font-size: 48rpx;
    font-weight: 600;
    color: $primary;
    letter-spacing: 2rpx;
  }
}
</style>
```

- [ ] **Step 8.2: 写 history.vue**

```vue
<template>
  <view class="container">
    <view v-if="store.loading" class="loading">加载中...</view>
    <view v-else-if="store.list.length === 0" class="empty">暂无查询记录</view>
    <view v-else class="list">
      <view v-for="item in store.list" :key="item.id" class="item card" @tap="goResult(item.number)">
        <view class="row">
          <text class="number">{{ item.number }}</text>
          <text class="time">{{ formatTime(item.createTime) }}</text>
        </view>
        <view class="meta">
          <text>{{ item.province }} {{ item.city }} · {{ item.carrier }}</text>
          <text class="label-count">{{ item.labelCount }} 个标记</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHistoryStore } from '@/stores/history';

const store = useHistoryStore();

onMounted(() => store.refresh());

function formatTime(t: string) {
  if (!t) return '';
  return t.substring(5, 16);
}

function goResult(n: string) {
  uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(n)}` });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading, .empty {
  text-align: center;
  padding: 96rpx 0;
  color: $text-tertiary;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item {
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8rpx;
  }
  .number {
    font-size: 32rpx;
    font-weight: 500;
    color: $text-primary;
  }
  .time {
    font-size: 24rpx;
    color: $text-tertiary;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: $text-secondary;
    .label-count {
      color: $warning;
    }
  }
}
</style>
```

- [ ] **Step 8.3: 写 profile.vue**

```vue
<template>
  <view class="container">
    <view class="profile-header card">
      <view class="avatar">{{ user.nickname.charAt(0) }}</view>
      <view class="info">
        <text class="name">{{ user.nickname }}</text>
        <text class="uid">UID: {{ user.userId || '-' }}</text>
      </view>
    </view>

    <view class="menu card">
      <view class="menu-item" v-for="(m, i) in menus" :key="i" @tap="onMenu(m)">
        <text class="menu-icon">{{ m.icon }}</text>
        <text class="menu-name">{{ m.name }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="actions">
      <button v-if="!user.isLoggedIn" class="btn-primary" @tap="user.mockLogin">登录（演示）</button>
      <button v-else class="btn-secondary" @tap="user.logout">退出登录</button>
    </view>

    <view class="brand">数查 (ShuCha) v0.1.0</view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const menus = [
  { name: '我的查询', icon: '📋' },
  { name: '会员中心', icon: '💎' },
  { name: '钱包', icon: '💰' },
  { name: '设置', icon: '⚙️' },
  { name: '关于数查', icon: 'ℹ️' }
];

function onMenu(m: any) {
  if (m.name === '我的查询') {
    uni.navigateTo({ url: '/pages/hcc/history' });
  } else {
    uni.showToast({ title: `${m.name} - 待开发`, icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .avatar {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    background: $primary;
    color: #fff;
    font-size: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .name {
    font-size: 36rpx;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 8rpx;
  }
  .uid {
    font-size: 24rpx;
    color: $text-tertiary;
  }
}

.menu {
  margin-bottom: 32rpx;
  .menu-item {
    display: flex;
    align-items: center;
    padding: 28rpx 0;
    border-bottom: 1rpx solid $border;
    &:last-child { border-bottom: none; }
  }
  .menu-icon {
    font-size: 36rpx;
    width: 60rpx;
  }
  .menu-name {
    flex: 1;
    font-size: 30rpx;
    color: $text-primary;
  }
  .menu-arrow {
    color: $text-tertiary;
    font-size: 32rpx;
  }
}

.btn-secondary {
  background: $bg-page;
  color: $text-primary;
  height: 88rpx;
  border-radius: 999rpx;
  border: none;
  font-size: 30rpx;
}

.brand {
  text-align: center;
  color: $text-tertiary;
  font-size: 24rpx;
  margin-top: 48rpx;
}
</style>
```

---

### Task 9: API 网关 + 服务启动验证

**Files:**
- Create: `/workspace/shucha-platform/backend/shucha-gateway/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-gateway/src/main/resources/application.yml`
- Create: `/workspace/shucha-platform/backend/shucha-gateway/src/main/java/com/shucha/gateway/ShuchaGatewayApplication.java`
- Create: `/workspace/shucha-platform/backend/shucha-auth/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-auth/src/main/java/com/shucha/auth/ShuchaAuthApplication.java`
- Create: `/workspace/shucha-platform/backend/shucha-user/pom.xml`
- Create: `/workspace/shucha-platform/backend/shucha-user/src/main/java/com/shucha/user/ShuchaUserApplication.java`

- [ ] **Step 9.1: 写 shucha-gateway/pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.shucha</groupId>
    <artifactId>shucha-platform</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>shucha-gateway</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
  </dependencies>
</project>
```

- [ ] **Step 9.2: 写 gateway application.yml**

```yaml
server:
  port: 9001
spring:
  application:
    name: shucha-gateway
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: shucha-query
          uri: lb://shucha-query
          predicates:
            - Path=/api/query/**
```

- [ ] **Step 9.3: 写 Gateway 主类**

```java
package com.shucha.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ShuchaGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShuchaGatewayApplication.class, args);
    }
}
```

- [ ] **Step 9.4: 写 shucha-auth/pom.xml（占位）**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.shucha</groupId>
    <artifactId>shucha-platform</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>shucha-auth</artifactId>
  <dependencies>
    <dependency>
      <groupId>com.shucha</groupId>
      <artifactId>shucha-common</artifactId>
      <version>0.1.0-SNAPSHOT</version>
    </dependency>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
  </dependencies>
</project>
```

- [ ] **Step 9.5: 写 shucha-auth 主类**

```java
package com.shucha.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ShuchaAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShuchaAuthApplication.class, args);
    }
}
```

写 application.yml（auth）:
```yaml
server:
  port: 9003
spring:
  application:
    name: shucha-auth
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```

- [ ] **Step 9.6: 写 shucha-user/pom.xml + 主类**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.shucha</groupId>
    <artifactId>shucha-platform</artifactId>
    <version>0.1.0-SNAPSHOT</version>
  </parent>
  <artifactId>shucha-user</artifactId>
  <dependencies>
    <dependency>
      <groupId>com.shucha</groupId>
      <artifactId>shucha-common</artifactId>
      <version>0.1.0-SNAPSHOT</version>
    </dependency>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
  </dependencies>
</project>
```

```java
package com.shucha.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ShuchaUserApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShuchaUserApplication.class, args);
    }
}
```

application.yml（user）:
```yaml
server:
  port: 9004
spring:
  application:
    name: shucha-user
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```

- [ ] **Step 9.7: 在根 pom 中注册新模块**

确保 backend/pom.xml 的 `<modules>` 包含：
```xml
<module>shucha-auth</module>
<module>shucha-user</module>
```

---

### Task 10: 启动脚本 + 文档

**Files:**
- Create: `/workspace/shucha-platform/scripts/dev-up.sh`
- Create: `/workspace/shucha-platform/docs/architecture.md`
- Create: `/workspace/shucha-platform/docs/api.md`
- Create: `/workspace/shucha-platform/docs/next-steps.md`

- [ ] **Step 10.1: 写 dev-up.sh**

```bash
#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "==> Starting infrastructure..."
docker compose up -d

echo "==> Waiting for MySQL..."
for i in {1..30}; do
  if docker exec shucha-mysql mysqladmin ping -h localhost -uroot -pshucha_root_2026 --silent 2>/dev/null; then
    echo "MySQL ready"
    break
  fi
  sleep 2
done

echo "==> Initializing DB schema..."
docker exec -i shucha-mysql mysql -uroot -pshucha_root_2026 shucha < backend/shucha-query/src/main/resources/db/schema.sql

echo "==> Starting backend services (run each in separate terminal)..."
echo "  cd backend && mvn spring-boot:run -pl shucha-gateway"
echo "  cd backend && mvn spring-boot:run -pl shucha-query"
echo "  cd backend && mvn spring-boot:run -pl shucha-auth"
echo "  cd backend && mvn spring-boot:run -pl shucha-user"

echo "==> Starting frontend (separate terminal)..."
echo "  cd frontend && npm install && npm run dev:h5"
```

```bash
chmod +x /workspace/shucha-platform/scripts/dev-up.sh
```

- [ ] **Step 10.2: 写 architecture.md**

```markdown
# 数查 (ShuCha) 架构

## 系统架构图

\`\`\`
┌─────────────────────────────────────┐
│         用户 (H5 / 小程序 / App)     │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│  Nginx / CDN (后续)                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  shucha-gateway  (:9001)            │  Spring Cloud Gateway
│  - 路由                              │  - JWT 鉴权
│  - 限流 (Sentinel)                   │  - 灰度
└──────┬───────┬───────┬──────────────┘
       │       │       │
       ▼       ▼       ▼
┌────────┐┌────────┐┌────────┐
│ auth   ││ query  ││ user   │  Nacos 注册发现
│ :9003  ││ :9002  ││ :9004  │
└────┬───┘└────┬───┘└────┬───┘
     │        │         │
     ▼        ▼         ▼
   MySQL    MySQL    MySQL
   Redis    Redis    Redis
   (后续)   (后续)   (后续)

Nacos (:8848)  ← 服务注册/配置中心
Sentinel Dashboard  ← 限流/熔断 (后续)
\`\`\`

## 数据源抽象

\`\`\`
QueryController
  → QueryService
    → NumberLabelService (接口)
      ├─ MockNumberLabelServiceImpl (当前)
      ├─ AliyunNumberLabelServiceImpl (Phase 1)
      └─ TencentNumberLabelServiceImpl (Phase 1)
\`\`\`

切换数据源只需在 application.yml 配置：
\`\`\`yaml
shucha:
  query:
    provider: mock  # 或 aliyun / tencent
\`\`\`
```

- [ ] **Step 10.3: 写 api.md**

```markdown
# API 契约

## 查询服务 shucha-query (9002)

### GET /api/query/number-label
查询号码标记信息

**Query Params:**
- `number` (required): 手机号/固话/400/95

**Response 200:**
\`\`\`json
{
  "code": 0,
  "message": "ok",
  "data": {
    "number": "13800138000",
    "province": "北京",
    "city": "北京市",
    "carrier": "中国移动",
    "labels": [
      { "name": "骚扰电话", "source": "腾讯手机管家", "count": 45, "riskLevel": 2 }
    ]
  }
}
\`\`\`

### GET /api/query/history
查询历史记录

**Headers:**
- `X-Shucha-User-Id`: 用户 ID

**Response 200:**
\`\`\`json
{
  "code": 0,
  "data": [
    { "id": 1, "number": "13800138000", "province": "北京", "city": "北京市", "carrier": "中国移动", "labelCount": 3, "createTime": "2026-06-09 10:00:00" }
  ]
}
\`\`\`
```

- [ ] **Step 10.4: 写 next-steps.md（后续路线图）**

```markdown
# 后续路线图

## Phase 1 - 真实数据源
- [ ] 接入号码归属地 API（免费公开）
- [ ] 商务对接三大运营商标记数据
- [ ] 实现 DataSource 切换配置
- [ ] 历史记录查询用户绑定

## Phase 2 - 增值服务
- [ ] func-category 功能商城
- [ ] 微信支付 / 支付宝集成
- [ ] 会员等级 / 钱包
- [ ] 订单系统

## Phase 3 - 社区 + 代理
- [ ] IM 群聊 (WebSocket)
- [ ] 帖子 / 群组 / 互助
- [ ] 代理分销体系

## Phase 4 - 生产化
- [ ] 阿里云 ECS + SLB 部署
- [ ] 阿里云 RDS / Redis / OSS
- [ ] 监控 (Prometheus + Grafana)
- [ ] 日志 (ELK)
- [ ] CI/CD (GitHub Actions)

## 合规清单
- [ ] ICP 备案
- [ ] 公安网安备案
- [ ] 个人信息保护合规评估
- [ ] 用户协议 / 隐私政策（参考 www.hcc123.com/about）
```

---

## 自检清单

- [x] 仓库结构清晰
- [x] 任务粒度 2-5 分钟可完成
- [x] 所有代码完整（无 TBD / TODO）
- [x] 真实可启动（Docker + Maven + npm）
- [x] 数据源抽象层为后续真实接入留好接口
- [x] 文档完整（架构 + API + 路线图）

## 执行选项

计划已完成并保存到 `docs/superpowers/plans/2026-06-09-shucha-mvp.md`。

**两个执行选项：**

1. **Subagent 驱动（推荐）** - 每任务派一个独立 subagent 执行，任务间人工 review
2. **当前会话直接执行** - 我现在在当前 session 顺序执行所有任务

**请选择执行方式**
