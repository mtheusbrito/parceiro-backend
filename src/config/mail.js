export default {
  host: process.env.MAIL_HOST,
  port: process.env.PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Itanet <noreply@parceiros.itanet.com.br>',
  },
};
