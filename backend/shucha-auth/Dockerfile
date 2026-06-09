# 数查 Auth 服务 Dockerfile

# ===== Stage 1: Build =====
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

COPY pom.xml .
COPY shucha-common/pom.xml shucha-common/
COPY shucha-auth/pom.xml shucha-auth/

RUN mvn dependency:go-offline -pl shucha-auth -am -q

COPY shucha-common/src shucha-common/src
COPY shucha-auth/src shucha-auth/src

RUN mvn clean package -pl shucha-auth -am -DskipTests -q

# ===== Stage 2: Runtime =====
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="shucha@local"
LABEL version="0.1.0"

RUN apk add --no-cache curl tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

RUN addgroup -S shucha && adduser -S shucha -G shucha

WORKDIR /app

COPY --from=builder /build/shucha-auth/target/shucha-auth-*.jar app.jar

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9003/actuator/health || exit 1

USER shucha

EXPOSE 9003

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
