module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
        jwtSecret: env('JWT_SECRET'),
      },
      jwtRefreshToken: {
        expiresIn: '30d',
        refreshTokenSecret: env('JWT_REFRESH_SECRET'),
      },
      register: {
        allowedFields: ['username', 'email'],
      },
      ratelimit: {
        interval: 60000,
        max: 10,
      },
    },
  },
});