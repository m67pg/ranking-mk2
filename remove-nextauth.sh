# NextAuth.js関連のパッケージを削除
npm uninstall next-auth @auth/prisma-adapter bcryptjs @types/bcryptjs

# node_modulesとpackage-lock.jsonを削除してクリーンインストール
rm -rf node_modules package-lock.json
npm install
