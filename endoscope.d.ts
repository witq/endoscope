declare class Endoscope {
  register: (
    probe: () => Promise<any>,
    options?: {
      timeout?: number;
      level?: number;
    }
  ) => Endoscope;
  run: (level?: number) => Promise<void | Error>;
}

declare module "endoscope" {
  const endoscopeInstance: Endoscope;
  const fastifyEndoscope: any;
  const expressEndoscope: any;
}
