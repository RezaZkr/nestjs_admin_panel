import * as process from 'node:process';

export const config = () => ({
  app_name: process.env.APP_NAME,
  port: process.env.PORT || 3000,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_full_url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  black_list_access_token_cache_key: process.env.BLACK_LIST_ACCESS_TOKEN_CACHE_KEY,
  black_list_refresh_token_cache_key: process.env.BLACK_LIST_REFRESH_TOKEN_CACHE_KEY,
});
