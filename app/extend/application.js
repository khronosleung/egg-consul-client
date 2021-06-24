'use strict';

module.exports = {
  async consulRegister() {
    this.messenger.sendToAgent('consulRegister', {});
  },
  async consulDeRegister() {
    this.messenger.sendToAgent('consulDeRegister', {});
  },
};
