import API from '../../yox-type/src/interface/API';
import Yox from '../../yox-type/src/interface/Yox';
import VNode from '../../yox-type/src/vnode/VNode';
export declare function patch(api: API, vnode: VNode, oldVnode: VNode): void;
export declare function create(api: API, node: Node, context: Yox, keypath: string): VNode;
export declare function destroy(api: API, vnode: VNode, isRemove?: boolean): void;
//# sourceMappingURL=snabbdom.d.ts.map