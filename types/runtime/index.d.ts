import { Spec } from '..';

// TODO
export type Runtime = any;

export const version: string;
export function parse(spec: Spec, opt?: any): Runtime;
export function isString(value: any): value is string;

export interface Loader {
  load: (uri: string, options?: any) => Promise<string>;
  sanitize: (uri: string, options: any) => Promise<{ href: string }>;
  http: (uri: string, options: any) => Promise<string>;
  file: (filename: string) => Promise<string>;
}

export class View {
  constructor(runtime: Runtime, config?: any);
  initialize(dom?: Element | string): View;
  finalize(): void;
  logLevel(level: number): View;
  renderer(renderer: 'canvas' | 'svg' | 'none'): View;
  loader(loader: Loader): View;

  hover(): View;
  run(): View;
  change(name: string, changeset: any): View;
  changeset(): any;
  data(name: string): object[];

  width(): number;
  width(w: number): View;
  height(): number;
  height(h: number): View;
  padding(p: number | { left?: number; right?: number; top?: number; bottom?: number }): View;

  toImageURL(type: string): Promise<string>;
  toSVG(): Promise<string>;
  toCanvas(): Promise<any>; // TODO node-canvas result
  signal(name: string, value: any): View;
  container(): HTMLElement | null;
  addEventListener(type: string, handler: Handler): void;
}

export const Warn: number;
export const changeset: any;
export function loader(opt?: any): Loader;
export type Handler = (event: Event, item?: Item) => void;
export interface Item<T = any> {
  /**
   * The underlying data element to which this item corresponds.
   */
  datum: T;
  /**
   * The mark to which this item belongs.
   */
  mark: RuntimeMark;
}

export type RuntimeMark =
  | DefineMark<'group'>
  | DefineMark<'rect', { x: number; y: number; width: number; height: number; fill: number }>
  | DefineMark<'symbol', {}, 'legend-symbol'>
  | DefineMark<'path'>
  | DefineMark<'arc'>
  | DefineMark<'area'>
  | DefineMark<'line'>
  | DefineMark<'image'>
  | DefineMark<'text', {}, 'axis-label' | 'legend-label'>;

export interface DefineMark<T extends string, I = {}, R extends string = never> {
  marktype: T;
  role: 'mark' | R;
  items: Item<I>[];
  group: any;
}
