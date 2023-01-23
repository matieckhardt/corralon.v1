module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/usuarios",
  PORT: process.env.PORT || 4000,
  secretKey: process.env.SECRET_KEY || "myUltraSecretKey",
  expiresInJWT: process.env.EXPIRE_JWT || "1h",
  expiresInCookie: process.env.EXPIRE_COOKIE || 24 * 60 * 60 * 1000, // 24 hours
  nameCookie: process.env.NAME_COOKIE || "token",
  cookieSecretKey: process.env.COOKIE_SECRET_KEY || "cookieSecretKey",
};
