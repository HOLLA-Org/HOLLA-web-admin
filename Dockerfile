# Sử dụng node 20 alpine làm base
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file package
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ code vào container
COPY . .

# Build dự án Next.js
RUN yarn build

# Next.js mặc định chạy port 3000
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["yarn", "start"]
