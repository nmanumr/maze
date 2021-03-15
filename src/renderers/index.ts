import {IRenderer} from "./types";

export enum Renderers {
  rectangularSvg
}

class RendererManager {
  private renderers = new Map<Renderers, IRenderer>();

  async loadRenderer(name: Renderers) {
    if (this.renderers.has(name)) {
      return this.renderers.get(name);
    }

    // Just easiest work around for rollup dynamic imports
    let module;
    switch (name) {
      case Renderers.rectangularSvg:
        module = (await import('./rectangularSvg')).default;
        break;
    }

    const renderer = new module();
    this.renderers.set(name, renderer);
    return renderer;
  }
}

export default new RendererManager();
