module.exports = {
  async activate() {
    const currentTime = new Date().toLocaleTimeString();
    SL.commands.register('notifications.info', async prefix => {
      const msg = await SL.omnibar.showInput('Show Notification', {
        placeholder: `what would you like it to say? (activation time ${currentTime})`,
      });

      if (!msg) {
        return;
      }

      return SL.notifications.addInfo(`${prefix}: ${msg}`);
    });
  },
};
