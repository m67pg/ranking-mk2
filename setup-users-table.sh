#!/bin/bash

echo "Setting up users table..."

# bcryptjsをインストール
npm install bcryptjs @types/bcryptjs

# Prismaクライアントを再生成
npx prisma generate

# データベーススキーマをプッシュ
npx prisma db push

echo "Users table setup complete!"
echo "Please run the SQL scripts to create the table and seed demo users."
