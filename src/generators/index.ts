import {IGenerator} from "./types";

export enum Generators {
  recursiveBackTrack
}

class GeneratorManager {
  private generators = new Map<Generators, IGenerator>();

  async loadGenerator(name: Generators) {
    if (this.generators.has(name)) {
      return this.generators.get(name);
    }

    // Just easiest work around for rollup dynamic imports
    let module;
    switch (name) {
      case Generators.recursiveBackTrack:
        module = (await import(`./recursiveBackTrack`)).default;
        break;
    }

    const generator = new module();
    this.generators.set(name, generator);
    return generator;
  }
}

export default new GeneratorManager();
