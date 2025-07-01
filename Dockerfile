FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
# This will use VITE_* env vars from docker-compose
RUN npm run build

FROM nginx:alpine

# Copy built assets from the local dist folder (already built by CI)
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
