// simulate async work properly
const sendBookingConfirmation = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`📧 Email sent to user ${userId}`);
};

const notifyEventUpdate = async (eventId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`🔔 Users notified for event ${eventId}`);
};

module.exports = {
  sendBookingConfirmation,
  notifyEventUpdate
};