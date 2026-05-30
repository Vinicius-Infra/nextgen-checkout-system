# Estágio 1: Build da aplicação usando Maven e Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Baixa as dependências em cache para acelerar os próximos builds
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# Estágio 2: Imagem leve de execução (Runtime)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /deployments
# Copia o fast-jar padrão do Quarkus gerado no estágio anterior
COPY --from=build /app/target/quarkus-app/ /deployments/

EXPOSE 8087
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

CMD ["java", "-jar", "/deployments/quarkus-run.jar"]