import * as Egg from 'egg';
import { Consul, ConsulOptions, Service } from "consul";

interface EggConsulOptions {
  server?: ConsulOptions;
  client?: Service.RegisterOptions;
}

declare module 'egg' {
  interface Application {
    consul: Consul;
  }

  interface EggAppConfig {
    consul: EggConsulOptions;
  }
}

export = Egg;
