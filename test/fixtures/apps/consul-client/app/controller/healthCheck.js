'use strict';

const Controller = require('egg').Controller;

class HealthCheckController extends Controller {
  async index() {
    this.ctx.body = 'ok';
  }
}

module.exports = HealthCheckController;
