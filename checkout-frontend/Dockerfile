# Estágio 1: Build do Angular usando o Node v22
FROM node:22.12.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor HTTP Nginx estável para produção
FROM nginx:alpine

# Limpa configurações e arquivos padrões antigos do container
RUN rm -rf /etc/nginx/conf.d/* && rm -rf /usr/share/nginx/html/*

# Cria a configuração apontando para a pasta correta do Nginx
RUN echo 'server { \
    listen 4200; \
    server_name localhost; \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# CORREÇÃO CIRÚRGICA: Mapeia o caminho exato incluindo a pasta interna browser
COPY --from=build /app/dist/checkout-frontend/browser /usr/share/nginx/html

# Garante permissão total de leitura no Linux para o processo do Nginx
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
