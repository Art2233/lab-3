FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build -- --configuration production

FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml -q dependency:go-offline

COPY backend/ backend/
RUN rm -rf backend/src/main/resources/static/*
COPY --from=frontend-build /app/frontend/dist/frontend/browser/ backend/src/main/resources/static/

RUN mvn -f backend/pom.xml -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
