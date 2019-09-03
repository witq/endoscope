interface EndoscopeOptions {
  prefix?: string;
  defaultLevel?: number;
  successCode?: number;
  errorCode?: number;
}

interface ProbeOptions {
  timeout?: number;
  level?: number;
}

declare class Endoscope {
  register: (
    probe: () => Promise<any | Error>,
    options?: ProbeOptions
  ) => Endoscope;
  run: (level?: number) => Promise<Array<any> | Error>;
}

declare module "endoscope" {
  const endoscopeInstance: Endoscope;
  const expressEndoscope: (app: any, options: EndoscopeOptions) => void;
  const fastifyEndoscope: (
    fastify: any,
    options: EndoscopeOptions,
    next: any
  ) => void;
  const httpEndoscope: (
    options: EndoscopeOptions
  ) => (req: any, res: any) => Promise<any>;
}
