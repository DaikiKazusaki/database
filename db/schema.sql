-- 棋譜データベースのスキーマ（自動生成）
--
-- 手で編集しないこと。変更は db/migrations/ にSQLを追加して本番へ適用し、
-- そのあと次のコマンドで再生成する：
--   node --env-file=.env.local scripts/dump-schema.mjs

CREATE TABLE games (
  id integer DEFAULT nextval('games_id_seq'::regclass) NOT NULL,
  sente_name text NOT NULL,
  sente_univ text,
  sente_grade text,
  gote_name text NOT NULL,
  gote_univ text,
  gote_grade text,
  event text,
  date date,
  result text,
  kifu text,
  deleted_at timestamp with time zone,
  CONSTRAINT games_pkey PRIMARY KEY (id)
);

CREATE INDEX games_date_idx ON public.games USING btree (date DESC, id DESC);
CREATE INDEX games_kifu_md5_idx ON public.games USING btree (md5(kifu));
