export const jwtConstants = {
  access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  access_token_expire_in: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,

  refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refresh_token_expire_in: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
};
