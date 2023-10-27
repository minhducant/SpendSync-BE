export const httpErrors = {
  // CLIENT
  CLIENT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'CLIENT_00000',
  },
  CLIENT_EXISTED: {
    message: 'Account already existed.',
    code: 'CLIENT_00001',
  },
  CLIENT_HASH_NOT_MATCH: {
    message: 'Account adress and hash message are not matched.',
    code: 'CLIENT_00002',
  },
  CLIENT_UNAUTHORIZED: {
    message: 'Unauthorized client.',
    code: 'CLIENT_00003',
  },
  CLIENT_LOCKED: {
    message: 'Client has been locked.',
    code: 'CLIENT_00004',
  },
  CLIENT_VERIFY_SIGNATURE_FAIL: {
    message: 'System has been failed to verify signture.',
    code: 'CLIENT_00005',
  },
  CLIENT_REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'CLIENT_00006',
  },
  CLIENT_ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'CLIENT_00007',
  },
  CLIENT_FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'CLIENT_00008',
  },
  CLIENT_EMAIL_EXISTED: {
    message: 'Email has been associated with an other account.',
    code: 'CLIENT_00009',
  },
  CLIENT_EMAIL_VERIFY_FAIL: {
    message: 'Failed to verify this email.',
    code: 'CLIENT_00010',
  },
  CLIENT_EMAIL_CONFIRM_NOT_FOUND: {
    message: 'Email request not found!',
    code: 'CLIENT_00011',
  },
  CLIENT_EMAIL_WAIT_TIME: {
    message: 'Too much request',
    code: 'CLIENT_00012',
  },
  CLIENT_WRONG_PASSWORD: {
    message: 'Password is incorrect',
    code: 'CLIENT_00013',
  },
  CLIENT_CODE_INVALID: {
    message: 'Verification code is invalid',
    code: 'CLIENT_00014',
  },
  CLIENT_EXPIRED_CODE: {
    message: `You've entered an incorrect code. Please note that current code will be expired if you enter it wrong 5 times in a row`,
    code: 'CLIENT_00015',
  },
  CLIENT_BANNED: {
    message: 'User has been banned.',
    code: 'CLIENT_00016',
  },
  CLIENT_UNVERIFIED: {
    message: 'Unverified user.',
    code: 'CLIENT_00017',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized user.',
    code: 'USER_00003',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'USER_00007',
  },

  // FACEBOOK
  FACEBOOK_TOKEN_INVALID_OR_EXPIRES: {
    message: 'Access token is invalid or expires.',
    code: 'FACEBOOK_00000',
  },

  // GOOGLE
  GOOGLE_TOKEN_INVALID_OR_EXPIRES: {
    message: 'Access token is invalid or expires.',
    code: 'GOOGLE_00000',
  },
};
