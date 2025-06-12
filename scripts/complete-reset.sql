-- データベースを完全にリセット

-- 既存のテーブルをすべて削除
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 権限を復元
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
