import { Redis } from "@upstash/redis"

// Redisクライアントの初期化
const redis = new Redis({
  url: process.env.KV_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

export default redis

