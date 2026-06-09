# 数查 User 服务 Dockerfile

# ===== Stage 1: Build =====
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

COPY pom.xml .
COPY shucha-common/pom.xml shucha-common/
COPY shucha-user/pom.xml shucha-user/

RUN mvn dependency:go-offline -pl shucha-user -am -q

COPY shucha-common/src shucha-common/src
COPY shucha-user/src shucha-user/src

RUN mvn clean package -pl shucha-user -am -DskipTests -q

# ===== Stage 2: Runtime =====
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="shucha@local"
LABEL version="0.1.0"

RUN apk add --no-cache curl tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

RUN addgroup -S shucha && adduser -S shucha -G shucha

WORKDIR /app

COPY --from=builder /build/shucha-user/target/shucha-user-*.jar app.jar

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9004/actuator/health || exit 1

USER shucha

EXPOSE 9004

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
