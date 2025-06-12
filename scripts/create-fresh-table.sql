-- 新しいランキングテーブルを作成

CREATE TABLE "Ranking" (
    "id" SERIAL PRIMARY KEY,
    "accountName" VARCHAR(255) NOT NULL UNIQUE,
    "profileUrl" VARCHAR(500),
    "followers" INTEGER NOT NULL,
    "imageUrl" VARCHAR(500),
    "area" VARCHAR(255),
    "storeName" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- インデックスを作成
CREATE INDEX "Ranking_followers_idx" ON "Ranking"("followers" DESC);
CREATE INDEX "Ranking_accountName_idx" ON "Ranking"("accountName");

-- シーケンスをリセット
ALTER SEQUENCE "Ranking_id_seq" RESTART WITH 1;
