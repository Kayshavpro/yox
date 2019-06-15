import CustomEvent from './event/CustomEvent';
import YoxOptions from './options/Yox';
import Yox from './interface/Yox';
import VNode from './vnode/VNode';
import Directive from './vnode/Directive';
import Location from './router/Location';
import RouteTarget from './router/RouteTarget';
export declare type hint = 1 | 2 | 3;
export declare type lazy = number | true;
export declare type propType = (key: string, value: any) => void;
export declare type propValue = () => any;
export declare type data = Record<string, any>;
export declare type dataGenerator = (options: YoxOptions) => data;
export declare type getter = () => any;
export declare type setter = (value: any) => void;
export declare type formater = (...args: any) => string | number | boolean;
export declare type filter = formater | Record<string, formater>;
export declare type watcher = (newValue: any, oldValue: any, keypath: string) => void;
export declare type listener = (event: CustomEvent, data?: data) => false | void;
export declare type nativeListener = (event: CustomEvent | Event) => false | void;
export declare type enter = (node: HTMLElement) => void;
export declare type leave = (node: HTMLElement, done: () => void) => void;
export declare type bind = (node: HTMLElement | Yox, directive: Directive, vnode: VNode) => void;
export declare type unbind = (node: HTMLElement | Yox, directive: Directive, vnode: VNode) => void;
export declare type on = (node: HTMLElement | Window | Document, listener: nativeListener) => void;
export declare type off = (node: HTMLElement | Window | Document, listener: nativeListener) => void;
export declare type componentCallback = (options: YoxOptions) => void;
export declare type componentLoader = (callback: componentCallback) => void;
export declare type component = YoxOptions | componentLoader;
export declare type yoxOptionsBeforeCreateHook = (options: YoxOptions) => void;
export declare type yoxOptionsOtherHook = () => void;
export declare type yoxClassBeforeCreateHook = (options: YoxOptions) => void;
export declare type yoxClassOtherHook = (instance: Yox) => void;
export declare type yoxRouterBeforeHook = (to: Location, from: Location | void, next: (value?: false | string | RouteTarget) => void) => void;
export declare type yoxRouterAfterHook = (to: Location, from: Location | void) => void;
//# sourceMappingURL=type.d.ts.map