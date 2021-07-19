import { Consul, ConsulOptions, Agent } from "consul";

interface EggConsulOptions {
  server?: ConsulOptions;
  client?: any;
}

declare module 'egg' {
  interface Application {
    consul: Consul;
  }

  interface EggAppConfig {
    consul: EggConsulOptions;
  }
}
