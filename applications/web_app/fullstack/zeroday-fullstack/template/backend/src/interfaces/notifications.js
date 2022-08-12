const Expo = require('expo-server-sdk');
const logger = require('../logger');

// To check if something is a push token
// let isPushToken = Expo.isExponentPushToken(somePushToken);

// To send push notifications -- note that there is a limit on the number of
// notifications you can send at once, use expo.chunkPushNotifications()

exports.send = async (token, message, url) => {
  const expo = new Expo();

  try {
    await expo.sendPushNotificationsAsync([{
      to: token,
      sound: 'default',
      body: message,
      data: { url },
    }]);
  } catch (error) {
    logger.error('ERROR: Push notification error', { error });
  }
};
