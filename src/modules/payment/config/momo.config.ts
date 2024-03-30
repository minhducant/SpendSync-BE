export const signatureDataMomo = {
  partnerCode: process.env.PARTNER_CODE,
  accessKey: process.env.ACCESS_KEY,
  requestId: `${process.env.PARTNER_CODE}${new Date().getTime()}id`,
  amount: 5000,
  orderId: `${new Date().getTime()}:0123456778`,
  orderInfo: 'Thanh toán qua ví MoMo',
  redirectUrl: 'https://clever-tartufo-c324cd.netlify.app/pages/home.html',
  ipnUrl: 'https://clever-tartufo-c324cd.netlify.app/pages/home.html',
  extraData: '',
  requestType: process.env.REQUEST_TYPE,
  userInfo: {
    name: '',
    phoneNumber: '',
    email: '',
  },
};
