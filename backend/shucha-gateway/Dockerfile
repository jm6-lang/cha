# 数查 Gateway 服务 Dockerfile
# 多阶段构建：编译 → 运行

# ===== Stage 1: Build =====
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# 先复制父 POM 和公共模块（利用 Docker 缓存层）
COPY pom.xml .
COPY shucha-common/pom.xml shucha-common/
COPY shucha-gateway/pom.xml shucha-gateway/

# 下载依赖（不编译，缓存层）
RUN mvn dependency:go-offline -pl shucha-gateway -am -q

# 复制源码
COPY shucha-common/src shucha-common/src
COPY shucha-gateway/src shucha-gateway/src

# 编译打包
RUN mvn clean package -pl shucha-gateway -am -DskipTests -q

# ===== Stage 2: Runtime =====
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="shucha@local"
LABEL version="0.1.0"

# 安装常用工具
RUN apk add --no-cache curl tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

# 创建非 root 用户
RUN addgroup -S shucha && adduser -S shucha -G shucha

WORKDIR /app

# 从 builder 阶段复制 jar
COPY --from=builder /build/shucha-gateway/target/shucha-gateway-*.jar app.jar

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9001/actuator/health || exit 1

USER shucha

EXPOSE 9001

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
