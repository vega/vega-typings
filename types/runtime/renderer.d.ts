import { Scene, SceneItem } from './scene';
import { Loader } from '.';

export declare class Renderer {
    constructor(loader: Loader)
    initialize(el: HTMLElement, width: number, height: number, origin: number[]): this
    _render(scene: Scene, items: SceneItem[]): this;
    resize(width: number, height: number, origin: number[]): this;
}

export interface RenderModule {
    renderer: typeof Renderer;
    headless?: Renderer;
    handler: Handler;
}

export declare class Handler { }

export declare class CanvasHandler extends Handler { }
