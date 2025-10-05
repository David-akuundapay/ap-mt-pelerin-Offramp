# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN   if [ -f yarn.lock ]; then yarn install --frozen-lockfile;   elif [ -f package-lock.json ]; then npm ci;   else npm i;   fi
COPY . .
ARG MTP_TOKEN
ENV MTP_TOKEN=${MTP_TOKEN}
RUN npm run build || yarn build

# --- Runtime stage ---
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
