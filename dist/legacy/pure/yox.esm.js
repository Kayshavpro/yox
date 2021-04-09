/**
 * yox.js v1.0.0-alpha.212
 * (c) 2017-2021 musicode
 * Released under the MIT License.
 */

const SYNTAX_IF = '#if';
const SYNTAX_ELSE = 'else';
const SYNTAX_ELSE_IF = 'else if';
const SYNTAX_EACH = '#each';
const SYNTAX_PARTIAL = '#partial';
const SYNTAX_IMPORT = '>';
const SYNTAX_SPREAD = '...';
const SYNTAX_COMMENT = /^!(?:\s|--)/;
const SLOT_DATA_PREFIX = '$slot_';
const SLOT_NAME_DEFAULT = 'children';
const HINT_STRING = 1;
const HINT_NUMBER = 2;
const HINT_BOOLEAN = 3;
const DIRECTIVE_ON = 'on';
const DIRECTIVE_LAZY = 'lazy';
const DIRECTIVE_MODEL = 'model';
const DIRECTIVE_EVENT = 'event';
const DIRECTIVE_TRANSITION = 'transition';
const DIRECTIVE_CUSTOM = 'o';
const MODIFER_NATIVE = 'native';
const MAGIC_VAR_SCOPE = '$scope';
const MAGIC_VAR_KEYPATH = '$keypath';
const MAGIC_VAR_LENGTH = '$length';
const MAGIC_VAR_EVENT = '$event';
const MAGIC_VAR_DATA = '$data';

/**
 * 为了压缩，定义的常量
 */
const TRUE$1 = true;
const FALSE$1 = false;
const NULL$1 = null;
const UNDEFINED$1 = void 0;
const RAW_TRUE = 'true';
const RAW_FALSE = 'false';
const RAW_NULL = 'null';
const RAW_UNDEFINED = 'undefined';
const RAW_KEY = 'key';
const RAW_REF = 'ref';
const RAW_SLOT = 'slot';
const RAW_NAME = 'name';
const RAW_THIS = 'this';
const RAW_FUNCTION = 'function';
const RAW_TEMPLATE = 'template';
const RAW_WILDCARD = '*';
const RAW_DOT = '.';
const RAW_SLASH = '/';
const RAW_DOLLAR = '$';
const KEYPATH_ROOT = '~';
const KEYPATH_PARENT = '..';
const KEYPATH_CURRENT = RAW_THIS;
/**
 * Single instance for window in browser
 */
const WINDOW = typeof window !== RAW_UNDEFINED ? window : UNDEFINED$1;
/**
 * Single instance for noop function
 */
const EMPTY_FUNCTION = function () {
    /** yox */
};
/**
 * 空对象，很多地方会用到，比如 `a || EMPTY_OBJECT` 确保是个对象
 */
const EMPTY_OBJECT = Object.freeze({});
/**
 * 空数组
 */
const EMPTY_ARRAY = Object.freeze([]);
/**
 * 空字符串
 */
const EMPTY_STRING = '';
/**
 * 日志等级
 */
const LOG_LEVEL_DEBUG = 1;
const LOG_LEVEL_INFO = 2;
const LOG_LEVEL_WARN = 3;
const LOG_LEVEL_ERROR = 4;
const LOG_LEVEL_FATAL = 5;
/**
 * 当前是否是源码调试，如果开启了代码压缩，empty function 里的注释会被干掉
 * 源码模式默认选 INFO，因为 DEBUG 输出的日志太多，会导致性能急剧下降
 */
const LOG_LEVEL_DEFAULT = /yox/.test(EMPTY_FUNCTION.toString()) ? LOG_LEVEL_INFO : LOG_LEVEL_WARN;
/**
 * 外部可配置的对象
 */
const PUBLIC_CONFIG = {
    leftDelimiter: '{',
    rightDelimiter: '}',
    uglifyCompiled: FALSE$1,
    minifyCompiled: FALSE$1,
    logLevel: LOG_LEVEL_DEFAULT,
};

/**
 * Check if value is a function.
 *
 * @param value
 * @return
 */
function func(value) {
    return typeof value === RAW_FUNCTION;
}
/**
 * Check if value is an array.
 *
 * @param value
 * @return
 */
function array$1(value) {
    return Array.isArray(value);
}
/**
 * Check if value is an object.
 *
 * @param value
 * @return
 */
function object$1(value) {
    // 低版本 IE 会把 null 当作 object
    return value !== NULL$1 && typeof value === 'object';
}
/**
 * Check if value is a string.
 *
 * @param value
 * @return
 */
function string$1(value) {
    return typeof value === 'string';
}
/**
 * Check if value is a number.
 *
 * @param value
 * @return
 */
function number(value) {
    return typeof value === 'number' && !isNaN(value);
}
/**
 * Check if value is boolean.
 *
 * @param value
 * @return
 */
function boolean(value) {
    return typeof value === 'boolean';
}
/**
 * Check if value is numeric.
 *
 * @param value
 * @return
 */
function numeric(value) {
    return number(value)
        || (string$1(value) && !isNaN(parseFloat(value)) && isFinite(value));
}

var is = /*#__PURE__*/Object.freeze({
  __proto__: null,
  func: func,
  array: array$1,
  object: object$1,
  string: string$1,
  number: number,
  boolean: boolean,
  numeric: numeric
});

/**
 * 任性地执行一个函数，不管它有没有、是不是
 *
 * @param fn 调用的函数
 * @param context 执行函数时的 this 指向
 * @param args 调用函数的参数，多参数时传入数组
 * @return 调用函数的返回值
 */
function execute (fn, context, args) {
    if (func(fn)) {
        return array$1(args)
            ? fn.apply(context, args)
            : context !== UNDEFINED$1
                ? fn.call(context, args)
                : args !== UNDEFINED$1
                    ? fn(args)
                    : fn();
    }
}

class CustomEvent {
    /**
     * 构造函数
     *
     * 可以传事件名称，也可以传原生事件对象
     */
    constructor(type, originalEvent) {
        // 这里不设置命名空间
        // 因为有没有命名空间取决于 Emitter 的构造函数有没有传 true
        // CustomEvent 自己无法决定
        this.type = type;
        this.phase = CustomEvent.PHASE_CURRENT;
        if (originalEvent) {
            this.originalEvent = originalEvent;
        }
    }
    static is(event) {
        return event instanceof CustomEvent;
    }
    /**
     * 阻止事件的默认行为
     */
    preventDefault() {
        const instance = this;
        if (!instance.isPrevented) {
            const { originalEvent } = instance;
            if (originalEvent) {
                originalEvent.preventDefault();
            }
            instance.isPrevented = TRUE$1;
        }
        return instance;
    }
    /**
     * 停止事件广播
     */
    stopPropagation() {
        const instance = this;
        if (!instance.isStoped) {
            const { originalEvent } = instance;
            if (originalEvent) {
                originalEvent.stopPropagation();
            }
            instance.isStoped = TRUE$1;
        }
        return instance;
    }
    prevent() {
        return this.preventDefault();
    }
    stop() {
        return this.stopPropagation();
    }
}
CustomEvent.PHASE_CURRENT = 0;
CustomEvent.PHASE_UPWARD = 1;
CustomEvent.PHASE_DOWNWARD = -1;

/**
 * 遍历数组
 *
 * @param array
 * @param callback 返回 false 可停止遍历
 * @param reversed 是否逆序遍历
 */
function each$2(array, callback, reversed) {
    const { length } = array;
    if (length) {
        if (reversed) {
            for (let i = length - 1; i >= 0; i--) {
                if (callback(array[i], i) === FALSE$1) {
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < length; i++) {
                if (callback(array[i], i) === FALSE$1) {
                    break;
                }
            }
        }
    }
}
function nativePush(array, item) {
    array[array.length] = item;
}
function nativeUnshift(array, item) {
    array.unshift(item);
}
/**
 * 添加
 *
 * @param array
 * @param value
 * @param action
 */
function addItem(array, value, action) {
    if (array$1(value)) {
        each$2(value, function (item) {
            action(array, item);
        });
    }
    else {
        action(array, value);
    }
}
/**
 * 往后加
 *
 * @param array
 * @param target
 */
function push(array, target) {
    addItem(array, target, nativePush);
}
/**
 * 往前加
 *
 * @param array
 * @param target
 */
function unshift(array, target) {
    addItem(array, target, nativeUnshift);
}
/**
 * 数组项在数组中的位置
 *
 * @param array 数组
 * @param target 数组项
 * @param strict 是否全等判断，默认是全等
 * @return 如果未找到，返回 -1
 */
function indexOf$1(array, target, strict) {
    let result = -1;
    each$2(array, function (item, index) {
        if (strict === FALSE$1 ? item == target : item === target) {
            result = index;
            return FALSE$1;
        }
    });
    return result;
}
/**
 * 获取数组最后一项
 *
 * @param array 数组
 * @return
 */
function last(array) {
    const { length } = array;
    if (length > 0) {
        return array[length - 1];
    }
}
/**
 * 弹出数组最后一项
 *
 * 项目里用的太多，仅用于节省字符...
 *
 * @param array 数组
 * @return 弹出的数组项
 */
function pop(array) {
    const { length } = array;
    if (length > 0) {
        return array.pop();
    }
}
/**
 * 删除数组项
 *
 * @param array 数组
 * @param item 待删除项
 * @param strict 是否全等判断，默认是全等
 * @return 删除的数量
 */
function remove(array, target, strict) {
    let result = 0;
    each$2(array, function (item, index) {
        if (strict === FALSE$1 ? item == target : item === target) {
            array.splice(index, 1);
            result++;
        }
    }, TRUE$1);
    return result;
}
/**
 * 数组是否包含 item
 *
 * @param array 数组
 * @param target 可能包含的数组项
 * @param strict 是否全等判断，默认是全等
 * @return
 */
function has$2(array, target, strict) {
    return indexOf$1(array, target, strict) >= 0;
}
/**
 * 把类数组转成数组
 *
 * @param array 类数组
 * @return
 */
function toArray(array) {
    return array$1(array)
        ? array
        : execute(EMPTY_ARRAY.slice, array);
}
/**
 * 把数组转成对象
 *
 * @param array 数组
 * @param key 数组项包含的字段名称，如果数组项是基本类型，可不传
 * @param value
 * @return
 */
function toObject(array, key, value) {
    let result = {};
    each$2(array, function (item) {
        result[key ? item[key] : item] = value || item;
    });
    return result;
}
/**
 * 把数组合并成字符串
 *
 * @param array
 * @param separator
 * @return
 */
function join$1(array, separator) {
    return array.join(separator);
}
/**
 * 用于判断长度大于 0 的数组
 *
 * @param array
 * @return
 */
function falsy$2(array) {
    return !array$1(array) || !array.length;
}

var array = /*#__PURE__*/Object.freeze({
  __proto__: null,
  each: each$2,
  push: push,
  unshift: unshift,
  indexOf: indexOf$1,
  last: last,
  pop: pop,
  remove: remove,
  has: has$2,
  toArray: toArray,
  toObject: toObject,
  join: join$1,
  falsy: falsy$2
});

function toString (target, defaultValue) {
    return target != NULL$1 && target.toString
        ? target.toString()
        : defaultValue !== UNDEFINED$1
            ? defaultValue
            : EMPTY_STRING;
}

function isNative (target) {
    return func(target)
        && toString(target).indexOf('[native code]') >= 0;
}

let createPureObject = function () {
    const obj = Object.create(NULL$1);
    return {
        get(key) {
            return obj[key];
        },
        set(key, value) {
            obj[key] = value;
        },
        has(key) {
            return key in obj;
        },
        keys() {
            return Object.keys(obj);
        }
    };
};
// IE9+ 都已实现 Object.create
{
    if (!isNative(Object.create)) {
        createPureObject = function () {
            const obj = {};
            return {
                get(key) {
                    return obj.hasOwnProperty(key)
                        ? obj[key]
                        : UNDEFINED$1;
                },
                set(key, value) {
                    obj[key] = value;
                },
                has(key) {
                    return obj.hasOwnProperty(key);
                },
                keys() {
                    return Object.keys(obj);
                }
            };
        };
    }
}
/**
 * 创建纯净对象
 *
 * @return 纯净对象
 */
var createPureObject$1 = createPureObject;

/**
 * 缓存一个参数的函数调用结果
 *
 * @param fn 需要缓存的函数
 * @return 带缓存功能的函数
 */
function createOneKeyCache(fn) {
    const cache = createPureObject$1();
    return function (key) {
        const hit = cache.get(key);
        if (hit !== UNDEFINED$1) {
            return hit;
        }
        const value = fn(key);
        cache.set(key, value);
        return value;
    };
}
/**
 * 缓存两个参数的函数调用结果
 *
 * @param fn 需要缓存的函数
 * @return 带缓存功能的函数
 */
function createTwoKeyCache(fn) {
    const cache = createPureObject$1();
    return function (key1, key2) {
        let hit1 = cache.get(key1);
        if (hit1) {
            const hit2 = hit1.get(key2);
            if (hit2) {
                return hit2;
            }
        }
        else {
            hit1 = createPureObject$1();
            cache.set(key1, hit1);
        }
        const value = fn(key1, key2);
        hit1.set(key2, value);
        return value;
    };
}

const camelizePattern = /-([a-z])/gi, hyphenatePattern = /\B([A-Z])/g, capitalizePattern = /^[a-z]/;
/**
 * 连字符转成驼峰
 *
 * @param str
 * @return 驼峰格式的字符串
 */
const camelize = createOneKeyCache(function (str) {
    return str.replace(camelizePattern, function (_, $1) {
        return upper($1);
    });
});
/**
 * 驼峰转成连字符
 *
 * @param str
 * @return 连字符格式的字符串
 */
const hyphenate = createOneKeyCache(function (str) {
    return str.replace(hyphenatePattern, function (_, $1) {
        return '-' + lower($1);
    });
});
/**
 * 首字母大写
 *
 * @param str
 * @return
 */
const capitalize = createOneKeyCache(function (str) {
    return str.replace(capitalizePattern, upper);
});
/**
 * 重复字符串
 *
 * @param str
 * @param count 重复次数
 * @return
 */
function repeat(str, count) {
    return join$1(new Array(count + 1), str);
}
/**
 * 清除两侧空白符
 *
 * @param str
 * @return 清除两侧空白符的字符串
 */
function trim(str) {
    return falsy$1(str)
        ? EMPTY_STRING
        : str.trim();
}
/**
 * 截取字符串
 *
 * @param str
 * @param start
 * @param end
 * @return
 */
function slice(str, start, end) {
    return number(end)
        ? start === end
            ? EMPTY_STRING
            : str.slice(start, end)
        : str.slice(start);
}
/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param start
 * @return
 */
function indexOf(str, part, start) {
    return str.indexOf(part, start !== UNDEFINED$1 ? start : 0);
}
/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param end
 * @return
 */
function lastIndexOf(str, part, end) {
    return str.lastIndexOf(part, end !== UNDEFINED$1 ? end : str.length);
}
/**
 * str 是否以 part 开头
 *
 * @param str
 * @param part
 * @return
 */
function startsWith(str, part) {
    return indexOf(str, part) === 0;
}
/**
 * str 是否以 part 结束
 *
 * @param str
 * @param part
 * @return
 */
function endsWith(str, part) {
    const offset = str.length - part.length;
    return offset >= 0 && lastIndexOf(str, part) === offset;
}
/**
 * 获取某个位置的字符
 */
function charAt(str, index) {
    return str.charAt(index || 0);
}
/**
 * 获取某个位置的字符编码
 */
function codeAt(str, index) {
    return str.charCodeAt(index || 0);
}
/**
 * 大写格式
 */
function upper(str) {
    return str.toUpperCase();
}
/**
 * 小写格式
 */
function lower(str) {
    return str.toLowerCase();
}
/**
 * str 是否包含 part
 *
 * @param str
 * @param part
 * @return 是否包含
 */
function has$1(str, part) {
    return indexOf(str, part) >= 0;
}
/**
 * 判断长度大于 0 的字符串
 *
 * @param str
 * @return
 */
function falsy$1(str) {
    return !string$1(str) || !str.length;
}

var string = /*#__PURE__*/Object.freeze({
  __proto__: null,
  camelize: camelize,
  hyphenate: hyphenate,
  capitalize: capitalize,
  repeat: repeat,
  trim: trim,
  slice: slice,
  indexOf: indexOf,
  lastIndexOf: lastIndexOf,
  startsWith: startsWith,
  endsWith: endsWith,
  charAt: charAt,
  codeAt: codeAt,
  upper: upper,
  lower: lower,
  has: has$1,
  falsy: falsy$1
});

const dotPattern = /\./g, asteriskPattern = /\*/g, doubleAsteriskPattern = /\*\*/g;
/**
 * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
 *
 * @param keypath
 * @param prefix
 * @return
 */
const match = createTwoKeyCache(function (keypath, prefix) {
    if (keypath === prefix) {
        return prefix.length;
    }
    prefix += RAW_DOT;
    return startsWith(keypath, prefix)
        ? prefix.length
        : -1;
});
const getKeypathTokens = createOneKeyCache(function (keypath) {
    return indexOf(keypath, RAW_DOT) < 0
        ? [keypath]
        : keypath.split(RAW_DOT);
});
/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath
 * @param callback 返回 false 可中断遍历
 */
function each$1(keypath, callback) {
    const tokens = string$1(keypath) ? getKeypathTokens(keypath) : keypath;
    for (let i = 0, lastIndex = tokens.length - 1; i <= lastIndex; i++) {
        if (callback(tokens[i], i, lastIndex) === FALSE$1) {
            break;
        }
    }
}
/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath1
 * @param keypath2
 */
const join = createTwoKeyCache(function (keypath1, keypath2) {
    return keypath1 && keypath2
        ? keypath1 + RAW_DOT + keypath2
        : keypath1 || keypath2;
});
/**
 * 是否模糊匹配
 *
 * @param keypath
 */
const isFuzzy = createOneKeyCache(function (keypath) {
    return has$1(keypath, RAW_WILDCARD);
});
const getFuzzyPattern = createOneKeyCache(function (pattern) {
    return new RegExp(`^${pattern
        .replace(dotPattern, '\\.')
        .replace(asteriskPattern, '(\\w+)')
        .replace(doubleAsteriskPattern, '([\.\\w]+?)')}$`);
});
/**
 * 模糊匹配 keypath
 *
 * @param keypath
 * @param pattern
 */
const matchFuzzy = createTwoKeyCache(function (keypath, pattern) {
    const result = keypath.match(getFuzzyPattern(pattern));
    return result
        ? result[1]
        : UNDEFINED$1;
});

/**
 * 全局 value holder，避免频繁的创建临时对象
 */
const holder = {
    value: UNDEFINED$1
};

/**
 * 获取对象的 key 的数组
 *
 * @param object
 * @return
 */
function keys(object) {
    return Object.keys(object);
}
/**
 * 遍历对象
 *
 * @param object
 * @param callback 返回 false 可停止遍历
 */
function each(object, callback) {
    for (let key in object) {
        if (callback(object[key], key) === FALSE$1) {
            break;
        }
    }
}
/**
 * 清空对象所有的键值对
 *
 * @param object
 */
function clear(object) {
    each(object, function (_, key) {
        delete object[key];
    });
}
/**
 * 扩展对象
 *
 * @return
 */
function extend(original, object) {
    each(object, function (value, key) {
        original[key] = value;
    });
    return original;
}
/**
 * 合并对象
 *
 * @return
 */
function merge(object1, object2) {
    return object1 && object2
        ? extend(extend({}, object1), object2)
        : object1 || object2;
}
/**
 * 拷贝对象
 *
 * @param object
 * @param deep 是否需要深拷贝
 * @return
 */
function copy(object, deep) {
    let result = object;
    if (array$1(object)) {
        if (deep) {
            result = [];
            each$2(object, function (item, index) {
                result[index] = copy(item, deep);
            });
        }
        else {
            result = object.slice();
        }
    }
    else if (object$1(object)) {
        result = {};
        each(object, function (value, key) {
            result[key] = deep ? copy(value, deep) : value;
        });
    }
    return result;
}
/**
 * 从对象中查找一个 keypath
 *
 * 返回值是空时，表示没找到值
 *
 * @param object
 * @param keypath
 * @return
 */
function get(object, keypath) {
    let result = object;
    each$1(keypath, function (key, index, lastIndex) {
        if (result != NULL$1) {
            // 先直接取值
            let value = result[key], 
            // 紧接着判断值是否存在
            // 下面会处理计算属性的值，不能在它后面设置 hasValue
            hasValue = value !== UNDEFINED$1;
            // 如果是计算属性，取计算属性的值
            if (value && func(value.get)) {
                value = value.get();
            }
            if (index === lastIndex) {
                if (hasValue) {
                    holder.value = value;
                    result = holder;
                }
                else {
                    result = UNDEFINED$1;
                }
            }
            else {
                result = value;
            }
        }
        else {
            result = UNDEFINED$1;
            return FALSE$1;
        }
    });
    return result;
}
/**
 * 为对象设置一个键值对
 *
 * @param object
 * @param keypath
 * @param value
 * @param autofill 是否自动填充不存在的对象，默认自动填充
 */
function set(object, keypath, value, autofill) {
    let next = object;
    each$1(keypath, function (key, index, lastIndex) {
        if (index === lastIndex) {
            next[key] = value;
        }
        else if (next[key]) {
            next = next[key];
        }
        else if (autofill) {
            next = next[key] = {};
        }
        else {
            return FALSE$1;
        }
    });
}
/**
 * 对象是否包含某个 key
 *
 * @param object
 * @param key
 * @return
 */
function has(object, key) {
    // 不用 hasOwnProperty，性能差
    return object[key] !== UNDEFINED$1;
}
/**
 * 是否是空对象
 *
 * @param object
 * @return
 */
function falsy(object) {
    return !object$1(object)
        || array$1(object)
        || !keys(object).length;
}

var object = /*#__PURE__*/Object.freeze({
  __proto__: null,
  keys: keys,
  each: each,
  clear: clear,
  extend: extend,
  merge: merge,
  copy: copy,
  get: get,
  set: set,
  has: has,
  falsy: falsy
});

/**
 * 外部可用这些常量
 */
const DEBUG = LOG_LEVEL_DEBUG;
const INFO = LOG_LEVEL_INFO;
const WARN = LOG_LEVEL_WARN;
const ERROR = LOG_LEVEL_ERROR;
const FATAL = LOG_LEVEL_FATAL;
/**
 * 是否有原生的日志特性，没有必要单独实现
 */
const nativeConsole = typeof console !== RAW_UNDEFINED ? console : NULL$1, 
/**
 * console 样式前缀
 * ie 和 edge 不支持 console.log 样式
 */
stylePrefix = WINDOW && /edge|msie|trident/i.test(WINDOW.navigator.userAgent)
    ? EMPTY_STRING
    : '%c', 
/**
 * 日志打印函数
 */
printLog = nativeConsole
    ? stylePrefix
        ? function (tag, msg, style) {
            nativeConsole.log(stylePrefix + tag, style, msg);
        }
        : function (tag, msg) {
            nativeConsole.log(tag, msg);
        }
    : EMPTY_FUNCTION;
/**
 * 全局调试开关
 */
function getLogLevel() {
    const { logLevel } = PUBLIC_CONFIG;
    if (logLevel >= DEBUG && logLevel <= FATAL) {
        return logLevel;
    }
    return LOG_LEVEL_DEFAULT;
}
function getStyle(backgroundColor) {
    return `background-color:${backgroundColor};border-radius:12px;color:#fff;font-size:10px;padding:3px 6px;`;
}
/**
 * 打印 debug 日志
 *
 * @param msg
 */
function debug(msg, tag) {
    if (getLogLevel() <= DEBUG) {
        printLog(tag || 'Yox debug', msg, getStyle('#999'));
    }
}
/**
 * 打印 info 日志
 *
 * @param msg
 */
function info(msg, tag) {
    if (getLogLevel() <= INFO) {
        printLog(tag || 'Yox info', msg, getStyle('#2db7f5'));
    }
}
/**
 * 打印 warn 日志
 *
 * @param msg
 */
function warn(msg, tag) {
    if (getLogLevel() <= WARN) {
        printLog(tag || 'Yox warn', msg, getStyle('#f90'));
    }
}
/**
 * 打印 error 日志
 *
 * @param msg
 */
function error(msg, tag) {
    if (getLogLevel() <= ERROR) {
        printLog(tag || 'Yox error', msg, getStyle('#ed4014'));
    }
}
/**
 * 致命错误，中断程序
 *
 * @param msg
 */
function fatal(msg, tag) {
    if (getLogLevel() <= FATAL) {
        throw new Error(`[${tag || 'Yox fatal'}]: ${msg}`);
    }
}

var logger = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DEBUG: DEBUG,
  INFO: INFO,
  WARN: WARN,
  ERROR: ERROR,
  FATAL: FATAL,
  debug: debug,
  info: info,
  warn: warn,
  error: error,
  fatal: fatal
});

class Emitter {
    constructor(ns) {
        this.ns = ns || FALSE$1;
        this.listeners = {};
    }
    /**
     * 发射事件
     *
     * @param type 事件名称或命名空间
     * @param args 事件处理函数的参数列表
     * @param filter 自定义过滤器
     */
    fire(type, args, filter) {
        let instance = this, event = string$1(type) ? instance.toEvent(type) : type, list = instance.listeners[event.type], isComplete = TRUE$1;
        if (list) {
            // 避免遍历过程中，数组发生变化，比如增删了
            list = list.slice();
            // 判断是否是发射事件
            // 如果 args 的第一个参数是 CustomEvent 类型，表示发射事件
            // 因为事件处理函数的参数列表是 (event, data)
            const customEvent = args && CustomEvent.is(args[0])
                ? args[0]
                : UNDEFINED$1;
            // 这里不用 array.each，减少函数调用
            for (let i = 0, length = list.length; i < length; i++) {
                let options = list[i];
                // 命名空间不匹配
                if (!matchNamespace(event.ns, options)
                    // 在 fire 过程中被移除了
                    || !has$2(list, options)
                    // 传了 filter，则用 filter 判断是否过滤此 options
                    || (filter && !filter(event, args, options))) {
                    continue;
                }
                let result = execute(options.listener, options.ctx, args);
                // 执行次数
                options.num = options.num ? (options.num + 1) : 1;
                // 注册的 listener 可以指定最大执行次数
                if (options.num === options.max) {
                    instance.off(event.type, {
                        ns: event.ns,
                        listener: options.listener,
                    });
                }
                // 如果没有返回 false，而是调用了 customEvent.stop 也算是返回 false
                if (customEvent) {
                    if (result === FALSE$1) {
                        customEvent.prevent().stop();
                    }
                    else if (customEvent.isStoped) {
                        result = FALSE$1;
                    }
                }
                if (result === FALSE$1) {
                    isComplete = FALSE$1;
                    break;
                }
            }
        }
        return isComplete;
    }
    /**
     * 注册监听
     *
     * @param type
     * @param listener
     */
    on(type, listener) {
        const instance = this, listeners = instance.listeners, options = func(listener)
            ? { listener: listener }
            : listener;
        if (object$1(options) && func(options.listener)) {
            if (!string$1(options.ns)) {
                const event = instance.toEvent(type);
                options.ns = event.ns;
                type = event.type;
            }
            push(listeners[type] || (listeners[type] = []), options);
        }
    }
    /**
     * 取消监听
     *
     * @param type
     * @param listener
     */
    off(type, listener) {
        const instance = this, listeners = instance.listeners;
        if (type) {
            const filter = instance.toFilter(type, listener), each$1 = function (list, name) {
                each$2(list, function (item, index) {
                    if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
                        list.splice(index, 1);
                    }
                }, TRUE$1);
                if (!list.length) {
                    delete listeners[name];
                }
            };
            if (filter.type) {
                if (listeners[filter.type]) {
                    each$1(listeners[filter.type], filter.type);
                }
            }
            // 按命名空间过滤，如 type 传入 .ns
            else if (filter.ns) {
                each(listeners, each$1);
            }
        }
        else {
            // 清空
            instance.listeners = {};
        }
    }
    /**
     * 是否已监听某个事件
     *
     * @param type
     * @param listener
     */
    has(type, listener) {
        let instance = this, listeners = instance.listeners, filter = instance.toFilter(type, listener), result = TRUE$1, each$1 = function (list) {
            each$2(list, function (item) {
                if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
                    return result = FALSE$1;
                }
            });
            return result;
        };
        if (filter.type) {
            if (listeners[filter.type]) {
                each$1(listeners[filter.type]);
            }
        }
        else if (filter.ns) {
            each(listeners, each$1);
        }
        return !result;
    }
    /**
     * 把事件类型解析成命名空间格式
     *
     * @param type
     */
    toEvent(type) {
        // 这里 ns 必须为字符串
        // 用于区分 event 对象是否已完成命名空间的解析
        const event = {
            type,
            ns: EMPTY_STRING,
        };
        // 是否开启命名空间
        if (this.ns) {
            const index = indexOf(type, RAW_DOT);
            if (index >= 0) {
                event.type = slice(type, 0, index);
                event.ns = slice(type, index + 1);
            }
        }
        return event;
    }
    toFilter(type, listener) {
        let filter;
        if (listener) {
            filter = func(listener)
                ? { listener: listener }
                : listener;
        }
        else {
            filter = {};
        }
        if (string$1(filter.ns)) {
            filter.type = type;
        }
        else {
            const event = this.toEvent(type);
            filter.type = event.type;
            filter.ns = event.ns;
        }
        return filter;
    }
}
/**
 * 判断 options 是否能匹配 listener
 *
 * @param listener
 * @param options
 */
function matchListener(listener, options) {
    return listener
        ? listener === options.listener
        : TRUE$1;
}
/**
 * 判断 options 是否能匹配命名空间
 *
 * 如果 namespace 和 options.ns 都不为空，则需完全匹配
 *
 * 如果他们两个其中任何一个为空，则不判断命名空间
 *
 * @param namespace
 * @param options
 */
function matchNamespace(namespace, options) {
    const { ns } = options;
    return ns && namespace
        ? ns === namespace
        : TRUE$1;
}

let nextTick;
// IE (10+) 和 node
if (typeof setImmediate === RAW_FUNCTION && isNative(setImmediate)) {
    nextTick = setImmediate;
}
// 用 MessageChannel 去做 setImmediate 的 polyfill
// 原理是将新的 message 事件加入到原有的 dom events 之后
// 兼容性 IE10+ 和其他标准浏览器
if (typeof MessageChannel === RAW_FUNCTION && isNative(MessageChannel)) {
    nextTick = function (fn) {
        const channel = new MessageChannel();
        channel.port1.onmessage = fn;
        channel.port2.postMessage(1);
    };
}
else {
    nextTick = setTimeout;
}
var nextTick$1 = nextTick;

let shared;
class NextTask {
    constructor(hooks) {
        const instance = this;
        instance.tasks = [];
        instance.hooks = hooks || EMPTY_OBJECT;
    }
    /**
     * 全局单例
     */
    static shared() {
        return shared || (shared = new NextTask());
    }
    /**
     * 在队尾添加异步任务
     */
    append(func, context) {
        const instance = this, { tasks } = instance;
        push(tasks, {
            fn: func,
            ctx: context
        });
        if (tasks.length === 1) {
            nextTick$1(function () {
                instance.run();
            });
        }
    }
    /**
     * 在队首添加异步任务
     */
    prepend(func, context) {
        const instance = this, { tasks } = instance;
        unshift(tasks, {
            fn: func,
            ctx: context
        });
        if (tasks.length === 1) {
            nextTick$1(function () {
                instance.run();
            });
        }
    }
    /**
     * 清空异步队列
     */
    clear() {
        this.tasks.length = 0;
    }
    /**
     * 立即执行异步任务，并清空队列
     */
    run() {
        const instance = this, { tasks, hooks } = instance, { length } = tasks;
        if (length) {
            instance.tasks = [];
            if (hooks.beforeTask) {
                hooks.beforeTask();
            }
            for (let i = 0; i < length; i++) {
                execute(tasks[i].fn, tasks[i].ctx);
            }
            if (hooks.afterTask) {
                hooks.afterTask();
            }
        }
    }
}

/**
 * 元素 节点
 */
const ELEMENT = 1;
/**
 * 属性 节点
 */
const ATTRIBUTE = 2;
/**
 * 指令 节点
 */
const DIRECTIVE = 3;
/**
 * 属性 节点
 */
const PROPERTY = 4;
/**
 * 文本 节点
 */
const TEXT = 5;
/**
 * if 节点
 */
const IF = 6;
/**
 * else if 节点
 */
const ELSE_IF = 7;
/**
 * else 节点
 */
const ELSE = 8;
/**
 * each 节点
 */
const EACH = 9;
/**
 * partial 节点
 */
const PARTIAL = 10;
/**
 * import 节点
 */
const IMPORT = 11;
/**
 * 表达式 节点
 */
const EXPRESSION = 12;
/**
 * 延展操作 节点
 */
const SPREAD = 13;

// 特殊标签
const specialTags = {};
// 特殊属性
const specialAttrs = {};
// 名称 -> 类型的映射
const name2Type = {};
specialTags[RAW_SLOT] =
    specialTags[RAW_TEMPLATE] =
        specialAttrs[RAW_KEY] =
            specialAttrs[RAW_REF] =
                specialAttrs[RAW_SLOT] = TRUE$1;
name2Type['if'] = IF;
name2Type['each'] = EACH;
name2Type['partial'] = PARTIAL;

/**
 * 字面量
 */
const LITERAL = 1;
/**
 * 标识符
 */
const IDENTIFIER = 2;
/**
 * 对象属性或数组下标
 */
const MEMBER = 3;
/**
 * 一元表达式，如 - a
 */
const UNARY = 4;
/**
 * 二元表达式，如 a + b
 */
const BINARY = 5;
/**
 * 三元表达式，如 a ? b : c
 */
const TERNARY = 6;
/**
 * 数组表达式，如 [ 1, 2, 3 ]
 */
const ARRAY = 7;
/**
 * 对象表达式，如 { name: 'yox' }
 */
const OBJECT = 8;
/**
 * 函数调用表达式，如 a()
 */
const CALL = 9;

function createAttribute$1(name, ns) {
    return {
        type: ATTRIBUTE,
        isStatic: TRUE$1,
        name,
        ns,
    };
}
function createDirective(name, ns, modifier) {
    return {
        type: DIRECTIVE,
        ns,
        name,
        modifier,
    };
}
function createProperty(name, ns, hint, value, expr, children) {
    return {
        type: PROPERTY,
        isStatic: TRUE$1,
        name,
        ns,
        hint,
        value,
        expr,
        children,
    };
}
function createEach(from, to, equal, index) {
    return {
        type: EACH,
        from,
        to,
        equal: equal || UNDEFINED$1,
        index,
        isVirtual: TRUE$1,
    };
}
function createElement$1(tag, dynamicTag, isSvg, isStyle, isComponent) {
    return {
        type: ELEMENT,
        tag,
        dynamicTag,
        isSvg,
        isStyle,
        isComponent,
        // 只有 <option> 没有 value 属性时才为 true
        isOption: FALSE$1,
        isStatic: !isComponent && tag !== RAW_SLOT,
    };
}
function createElse() {
    return {
        type: ELSE,
        isVirtual: TRUE$1,
    };
}
function createElseIf(expr) {
    return {
        type: ELSE_IF,
        expr,
        isVirtual: TRUE$1,
    };
}
function createExpression(expr, safe) {
    return {
        type: EXPRESSION,
        expr,
        safe,
        isLeaf: TRUE$1,
        isStatic: expr.type === LITERAL,
    };
}
function createIf(expr) {
    return {
        type: IF,
        expr,
        isVirtual: TRUE$1,
    };
}
function createImport(name) {
    return {
        type: IMPORT,
        name,
        isLeaf: TRUE$1,
    };
}
function createPartial(name) {
    return {
        type: PARTIAL,
        name,
        isVirtual: TRUE$1,
    };
}
function createSpread(expr) {
    return {
        type: SPREAD,
        expr,
        isLeaf: TRUE$1,
    };
}
function createText(text) {
    return {
        type: TEXT,
        text,
        isStatic: TRUE$1,
        isLeaf: TRUE$1,
    };
}

const // 首字母大写，或中间包含 -
componentNamePattern = /^[A-Z]|-/, 
// HTML 实体（中间最多 6 位，没见过更长的）
htmlEntityPattern = /&[#\w\d]{2,6};/, 
// 常见的自闭合标签
selfClosingTagNames = EMPTY_OBJECT, 
// 常见的 svg 标签
svgTagNames = EMPTY_OBJECT, 
// 常见的字符串类型的属性
// 注意：autocomplete,autocapitalize 不是布尔类型
stringPropertyNames = EMPTY_OBJECT, 
// 常见的数字类型的属性（width,height,cellpadding,cellspacing 支持百分比，因此不计入数字类型）
numberPropertyNames = EMPTY_OBJECT, 
// 常见的布尔类型的属性
booleanPropertyNames = EMPTY_OBJECT, 
// 某些属性 attribute name 和 property name 不同
attr2Prop = {};
// 列举几个常见的
attr2Prop['for'] = 'htmlFor';
attr2Prop['class'] = 'className';
attr2Prop['accesskey'] = 'accessKey';
attr2Prop['style'] = 'style.cssText';
attr2Prop['novalidate'] = 'noValidate';
attr2Prop['readonly'] = 'readOnly';
attr2Prop['tabindex'] = 'tabIndex';
attr2Prop['minlength'] = 'minLength';
attr2Prop['maxlength'] = 'maxLength';
attr2Prop['cellpadding'] = 'cellPadding';
attr2Prop['cellspacing'] = 'cellSpacing';
attr2Prop['colspan'] = 'colSpan';
attr2Prop['rowspan'] = 'rowSpan';
attr2Prop['valign'] = 'vAlign';
attr2Prop['frameborder'] = 'frameBorder';
function isSelfClosing(tagName) {
    return selfClosingTagNames[tagName] !== UNDEFINED$1;
}
function createAttribute(element, name, ns) {
    // 组件用驼峰格式
    if (element.isComponent) {
        return createAttribute$1(camelize(name), ns);
    }
    // 原生 dom 属性
    else {
        // 把 attr 优化成 prop
        const lowerName = lower(name);
        // <slot> 、<template> 或 svg 中的属性不用识别为 property
        if (specialTags[element.tag] || element.isSvg) {
            return createAttribute$1(name, ns);
        }
        // 尝试识别成 property
        else if (stringPropertyNames[lowerName]) {
            return createProperty(attr2Prop[lowerName] || lowerName, ns, HINT_STRING);
        }
        else if (numberPropertyNames[lowerName]) {
            return createProperty(attr2Prop[lowerName] || lowerName, ns, HINT_NUMBER);
        }
        else if (booleanPropertyNames[lowerName]) {
            return createProperty(attr2Prop[lowerName] || lowerName, ns, HINT_BOOLEAN);
        }
        // 没辙，还是个 attribute
        return createAttribute$1(name, ns);
    }
}
function getAttributeDefaultValue(element, name) {
    // 比如 <Dog isLive>
    if (element.isComponent) {
        return TRUE$1;
    }
    // <div data-name checked>
    return startsWith(name, 'data-')
        ? EMPTY_STRING
        : name;
}
function isNativeElement(node) {
    if (node.type !== ELEMENT) {
        return FALSE$1;
    }
    const element = node;
    if (element.isComponent) {
        return FALSE$1;
    }
    return specialTags[element.tag] === UNDEFINED$1;
}
function createElement(staticTag, dynamicTag) {
    let isSvg = FALSE$1, isStyle = FALSE$1, isComponent = FALSE$1;
    if (dynamicTag) {
        isComponent = TRUE$1;
    }
    else {
        isSvg = svgTagNames[staticTag] !== UNDEFINED$1;
        // 是 svg 就不可能是组件
        // 加这个判断的原因是，svg 某些标签含有 连字符 和 大写字母，比较蛋疼
        if (!isSvg && componentNamePattern.test(staticTag)) {
            isComponent = TRUE$1;
        }
        else if (staticTag === 'style') {
            isStyle = TRUE$1;
        }
    }
    return createElement$1(staticTag, dynamicTag, isSvg, isStyle, isComponent);
}
function compatElement(element) {
    let { tag, attrs } = element, hasType = FALSE$1, hasValue = FALSE$1;
    if (attrs) {
        each$2(attrs, function (attr) {
            const name = attr.type === PROPERTY
                ? attr.name
                : UNDEFINED$1;
            if (name === 'type') {
                hasType = TRUE$1;
            }
            else if (name === 'value') {
                hasValue = TRUE$1;
            }
        });
    }
    // 补全 style 标签的 type
    // style 如果没有 type 则加一个 type="text/css"
    // 因为低版本 IE 没这个属性，没法正常渲染样式
    if (element.isStyle && !hasType) {
        push(element.attrs || (element.attrs = []), createProperty('type', UNDEFINED$1, HINT_STRING, 'text/css'));
    }
    // 低版本 IE 需要给 option 标签强制加 value
    else if (tag === 'option' && !hasValue) {
        element.isOption = TRUE$1;
    }
}
function setElementText(element, text) {
    if (string$1(text)) {
        if (htmlEntityPattern.test(text)) {
            element.html = text;
        }
        else {
            element.text = text;
        }
    }
    else {
        element.text = text;
    }
    return TRUE$1;
}
function setElementHtml(element, expr) {
    element.html = expr;
    return TRUE$1;
}

function isDef (target) {
    return target !== UNDEFINED$1;
}

function toNumber (target, defaultValue) {
    return numeric(target)
        ? +target
        : defaultValue !== UNDEFINED$1
            ? defaultValue
            : 0;
}

function createArray(nodes, raw) {
    return {
        type: ARRAY,
        raw,
        nodes,
    };
}
function createBinary(left, operator, right, raw) {
    return {
        type: BINARY,
        raw,
        left,
        operator,
        right,
    };
}
function createCall(name, args, raw) {
    return {
        type: CALL,
        raw,
        name,
        args,
    };
}
function createIdentifier(raw, name, isProp) {
    let root = FALSE$1, lookup = TRUE$1, offset = 0;
    if (name === KEYPATH_CURRENT) {
        name = EMPTY_STRING;
        lookup = FALSE$1;
    }
    else if (name === KEYPATH_PARENT) {
        name = EMPTY_STRING;
        lookup = FALSE$1;
        offset = 1;
    }
    else if (name === KEYPATH_ROOT) {
        name = EMPTY_STRING;
        root = TRUE$1;
        lookup = FALSE$1;
    }
    // 对象属性需要区分 a.b 和 a[b]
    // 如果不借用 Literal 无法实现这个判断
    // 同理，如果用了这种方式，就无法区分 a.b 和 a['b']，但是无所谓，这两种表示法本就一个意思
    return isProp
        ? createLiteral(name, raw)
        : createIdentifierInner(raw, name, root, lookup, offset);
}
function createLiteral(value, raw) {
    return {
        type: LITERAL,
        raw,
        value,
    };
}
function createObject(keys, values, raw) {
    return {
        type: OBJECT,
        raw,
        keys,
        values,
    };
}
function createTernary(test, yes, no, raw) {
    return {
        type: TERNARY,
        raw,
        test,
        yes,
        no,
    };
}
function createUnary(operator, node, raw) {
    return {
        type: UNARY,
        raw,
        operator,
        node,
    };
}
/**
 * 通过判断 nodes 来决定是否需要创建 Member
 *
 * 创建 Member 至少需要 nodes 有两个节点
 */
function createMemberIfNeeded(raw, nodes) {
    // 第一个节点要特殊处理
    let firstNode = nodes.shift(), 
    // 是否直接从顶层查找
    root = FALSE$1, 
    // 是否向上查找
    lookup = TRUE$1, 
    // 偏移量，默认从当前 context 开始查找
    offset = 0;
    // 表示传入的 nodes 至少有两个节点（弹出了一个）
    if (nodes.length > 0) {
        // 处理剩下的 nodes
        // 这里要做两手准备：
        // 1. 如果全是 literal 节点，则编译时 join
        // 2. 如果不全是 literal 节点，则运行时 join
        // 是否全是 Literal 节点
        let isLiteral = TRUE$1, 
        // 静态节点
        staticNodes = [], 
        // 对于 this.a.b[c] 这样的
        // 要还原静态部分 this.a.b 的 raw
        // 虽然 raw 没什么大用吧，谁让我是洁癖呢
        staticRaw = EMPTY_STRING, 
        // 动态节点
        dynamicNodes = [];
        each$2(nodes, function (node) {
            if (isLiteral) {
                if (node.type === LITERAL) {
                    const literalNode = node;
                    if (literalNode.raw === KEYPATH_PARENT) {
                        offset += 1;
                        staticRaw = staticRaw
                            ? staticRaw + RAW_SLASH + KEYPATH_PARENT
                            : KEYPATH_PARENT;
                        return;
                    }
                    if (literalNode.raw !== KEYPATH_CURRENT) {
                        const value = toString(literalNode.value);
                        push(staticNodes, value);
                        if (staticRaw) {
                            staticRaw += endsWith(staticRaw, KEYPATH_PARENT)
                                ? RAW_SLASH
                                : RAW_DOT;
                        }
                        staticRaw += value;
                    }
                }
                else {
                    isLiteral = FALSE$1;
                }
            }
            if (!isLiteral) {
                push(dynamicNodes, node);
            }
        });
        // lookup 要求第一位元素是 Identifier，且它的 lookup 是 true 才为 true
        // 其他情况都为 false，如 "11".length 第一位元素是 Literal，不存在向上寻找的需求
        // 优化 1：计算 keypath
        //
        // 计算 keypath 的唯一方式是，第一位元素是 Identifier，后面都是 Literal
        // 否则就表示中间包含动态元素，这会导致无法计算静态路径
        // 如 a.b.c 可以算出 static keypath，而 a[b].c 则不行，因为 b 是动态的
        // 优化 2：计算 offset 并智能转成 Identifier
        //
        // 比如 xx 这样的表达式，应优化成 offset = 2，并转成 Identifier
        // 处理第一个节点
        if (firstNode.type === IDENTIFIER) {
            const identifierNode = firstNode;
            root = identifierNode.root;
            lookup = identifierNode.lookup;
            offset += identifierNode.offset;
            let firstName = identifierNode.name;
            // 不是 KEYPATH_THIS 或 KEYPATH_PARENT 或 KEYPATH_ROOT
            if (firstName) {
                unshift(staticNodes, firstName);
            }
            // 转成 Identifier
            firstName = join$1(staticNodes, RAW_DOT);
            // a.b.c
            if (isLiteral) {
                firstNode = createIdentifierInner(raw, firstName, root, lookup, offset);
            }
            // a[b]
            // this.a[b]
            else {
                // 当 isLiteral 为 false 时
                // 需要为 lead 节点创建合适的 raw
                let firstRaw = identifierNode.raw;
                if (staticRaw) {
                    // 确定 firstNode 和后续静态节点的连接字符
                    let separator = RAW_DOT;
                    if (firstRaw === KEYPATH_ROOT
                        || firstRaw === KEYPATH_PARENT) {
                        separator = RAW_SLASH;
                    }
                    firstRaw += separator + staticRaw;
                }
                firstNode = createMemberInner(raw, createIdentifierInner(firstRaw, firstName, root, lookup, offset), UNDEFINED$1, dynamicNodes, root, lookup, offset);
            }
        }
        else {
            // 例子：
            // "xxx".length
            // format().a.b
            if (isLiteral) {
                firstNode = createMemberInner(raw, firstNode, join$1(staticNodes, RAW_DOT), UNDEFINED$1, root, lookup, offset);
            }
            // 例子：
            // "xxx"[length]
            // format()[a]
            else {
                firstNode = createMemberInner(raw, firstNode, UNDEFINED$1, dynamicNodes, root, lookup, offset);
            }
        }
    }
    return firstNode;
}
function createIdentifierInner(raw, name, root, lookup, offset) {
    return {
        type: IDENTIFIER,
        raw,
        name,
        root,
        lookup,
        offset,
    };
}
function createMemberInner(raw, lead, keypath, nodes, root, lookup, offset) {
    return {
        type: MEMBER,
        raw,
        lead,
        keypath,
        nodes,
        root,
        lookup,
        offset,
    };
}

const unary = {
    '+': TRUE$1,
    '-': TRUE$1,
    '~': TRUE$1,
    '!': TRUE$1,
    '!!': TRUE$1,
};
// 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
const binary = {
    '*': 15,
    '/': 15,
    '%': 15,
    '+': 14,
    '-': 14,
    '<<': 13,
    '>>': 13,
    '>>>': 13,
    '<': 12,
    '<=': 12,
    '>': 12,
    '>=': 12,
    '==': 11,
    '!=': 11,
    '===': 11,
    '!==': 11,
    '&': 10,
    '^': 9,
    '|': 8,
    '&&': 7,
    '||': 6,
};

class Parser {
    constructor(content) {
        const instance = this;
        instance.index = -1;
        instance.end = content.length;
        instance.code = CODE_EOF;
        instance.content = content;
        instance.go();
    }
    /**
     * 移动一个字符
     */
    go(step) {
        let instance = this, { index, end } = instance;
        index += step || 1;
        if (index >= 0 && index < end) {
            instance.code = instance.codeAt(index);
            instance.index = index;
        }
        else {
            instance.code = CODE_EOF;
            instance.index = index < 0 ? -1 : end;
        }
    }
    /**
     * 跳过空白符
     */
    skip(step) {
        const instance = this, reversed = step && step < 0;
        // 如果表达式是 "   xyz   "，到达结尾后，如果希望 skip(-1) 回到最后一个非空白符
        // 必须先判断最后一个字符是空白符，否则碰到 "xyz" 这样结尾不是空白符的，其实不应该回退
        if (instance.code === CODE_EOF) {
            const oldIndex = instance.index;
            instance.go(step);
            // 如果跳一位之后不是空白符，还原，然后返回
            if (!isWhitespace(instance.code)) {
                instance.go(oldIndex - instance.index);
                return;
            }
        }
        // 逆向时，只有位置真的发生过变化才需要在停止时正向移动一位
        // 比如 (a) 如果调用 skip 前位于 )，调用 skip(-1) ，结果应该是原地不动
        // 为了解决这个问题，应该首先判断当前是不是空白符，如果不是，直接返回
        else if (!isWhitespace(instance.code)) {
            return;
        }
        // 如果是正向的，停在第一个非空白符左侧
        // 如果是逆向的，停在第一个非空白符右侧
        while (TRUE$1) {
            if (isWhitespace(instance.code)) {
                instance.go(step);
            }
            else {
                if (reversed) {
                    instance.go();
                }
                break;
            }
        }
    }
    /**
     * 判断当前字符
     */
    is(code) {
        return this.code === code;
    }
    /**
     * 截取一段字符串
     */
    pick(startIndex, endIndex) {
        return slice(this.content, startIndex, isDef(endIndex) ? endIndex : this.index);
    }
    /**
     * 读取 index 位置的 char code
     *
     * @param index
     */
    codeAt(index) {
        return codeAt(this.content, index);
    }
    /**
     * 尝试解析下一个 token
     */
    scanToken() {
        const instance = this, { code, index } = instance;
        if (isIdentifierStart(code)) {
            return instance.scanTail(index, [
                instance.scanIdentifier(index)
            ]);
        }
        if (isDigit(code)) {
            return instance.scanNumber(index);
        }
        switch (code) {
            case CODE_EOF:
                return;
            // 'x' "x"
            case CODE_SQUOTE:
            case CODE_DQUOTE:
                return instance.scanTail(index, [
                    instance.scanString(index, code)
                ]);
            // .1  ./  ../
            case CODE_DOT:
                instance.go();
                return isDigit(instance.code)
                    ? instance.scanNumber(index)
                    : instance.scanPath(index);
            // ~/a
            case CODE_WAVE:
                // 因为 ~ 可以是一元运算符，因此必须判断后面紧跟 / 才是路径
                if (instance.codeAt(index + 1) === CODE_SLASH) {
                    return instance.scanPath(index);
                }
                break;
            // (xx)
            case CODE_OPAREN:
                instance.go();
                return instance.scanTernary(CODE_CPAREN);
            // [xx, xx]
            case CODE_OBRACK:
                return instance.scanTail(index, [
                    createArray(instance.scanTuple(index, CODE_CBRACK), instance.pick(index))
                ]);
            // { a: 'x', b: 'x' }
            case CODE_OBRACE:
                return instance.scanObject(index);
        }
        // 因为 scanOperator 会导致 index 发生变化，只能放在最后尝试
        const operator = instance.scanOperator(index);
        if (operator && unary[operator]) {
            const node = instance.scanTernary();
            if (node) {
                if (node.type === LITERAL) {
                    const value = node.value;
                    if (number(value)) {
                        // 类似 ' -1 ' 这样的右侧有空格，需要撤回来
                        instance.skip(-1);
                        return createLiteral(-value, instance.pick(index));
                    }
                }
                // 类似 ' -a ' 这样的右侧有空格，需要撤回来
                instance.skip(-1);
                return createUnary(operator, node, instance.pick(index));
            }
        }
    }
    /**
     * 扫描数字
     *
     * 支持整数和小数
     *
     * @param startIndex
     * @return
     */
    scanNumber(startIndex) {
        const instance = this;
        while (isNumber(instance.code)) {
            instance.go();
        }
        const raw = instance.pick(startIndex);
        // 尝试转型，如果转型失败，则确定是个错误的数字
        if (numeric(raw)) {
            return createLiteral(+raw, raw);
        }
    }
    /**
     * 扫描字符串
     *
     * 支持反斜线转义引号
     *
     * @param startIndex
     * @param endCode
     */
    scanString(startIndex, endCode) {
        const instance = this;
        loop: while (TRUE$1) {
            // 这句有两个作用：
            // 1. 跳过开始的引号
            // 2. 驱动 index 前进
            instance.go();
            switch (instance.code) {
                // \" \'
                case CODE_BACKSLASH:
                    instance.go();
                    break;
                case endCode:
                    instance.go();
                    break loop;
                case CODE_EOF:
                    break loop;
            }
        }
        // new Function 处理字符转义
        const raw = instance.pick(startIndex);
        return createLiteral(new Function(`return ${raw}`)(), raw);
    }
    /**
     * 扫描对象字面量
     *
     * @param startIndex
     */
    scanObject(startIndex) {
        let instance = this, keys = [], values = [], isKey = TRUE$1, node;
        // 跳过 {
        instance.go();
        loop: while (TRUE$1) {
            switch (instance.code) {
                case CODE_CBRACE:
                    instance.go();
                    break loop;
                case CODE_EOF:
                    break loop;
                // :
                case CODE_COLON:
                    instance.go();
                    isKey = FALSE$1;
                    break;
                // ,
                case CODE_COMMA:
                    instance.go();
                    isKey = TRUE$1;
                    break;
                default:
                    // 解析 key 的时候，node 可以为空，如 { } 或 { name: 'xx', }
                    // 解析 value 的时候，node 不能为空
                    node = instance.scanTernary();
                    if (isKey) {
                        if (node) {
                            // 处理 { key : value } key 后面的空格
                            instance.skip();
                            if (node.type === IDENTIFIER) {
                                push(keys, node.name);
                            }
                            else if (node.type === LITERAL) {
                                push(keys, node.value);
                            }
                            else {
                                break loop;
                            }
                        }
                    }
                    else if (node) {
                        // 处理 { key : value } value 后面的空格
                        instance.skip();
                        push(values, node);
                    }
                    // 类似这样 { key: }
                    else {
                        break loop;
                    }
            }
        }
        return createObject(keys, values, instance.pick(startIndex));
    }
    /**
     * 扫描元组，即 `a, b, c` 这种格式，可以是参数列表，也可以是数组
     *
     * @param startIndex
     * @param endCode 元组的结束字符编码
     */
    scanTuple(startIndex, endCode) {
        let instance = this, nodes = [], node;
        // 跳过开始字符，如 [ 和 (
        instance.go();
        loop: while (TRUE$1) {
            switch (instance.code) {
                case endCode:
                    instance.go();
                    break loop;
                case CODE_EOF:
                    break loop;
                case CODE_COMMA:
                    instance.go();
                    break;
                default:
                    // 1. ( )
                    // 2. (1, 2, )
                    // 这三个例子都会出现 scanTernary 为空的情况
                    // 但是不用报错
                    node = instance.scanTernary();
                    if (node) {
                        // 为了解决 1 , 2 , 3 这样的写法
                        // 当解析出值后，先跳过后面的空格
                        instance.skip();
                        push(nodes, node);
                    }
            }
        }
        return nodes;
    }
    /**
     * 扫描路径，如 `./` 和 `../` 和 `/a`
     *
     * 路径必须位于开头，如 ./../ 或 ，不存在 a/../b/../c 这样的情况，因为路径是用来切换或指定 context 的
     *
     * @param startIndex
     * @param prevNode
     */
    scanPath(startIndex) {
        let instance = this, nodes = [], name;
        // 进入此函数时，已确定前一个 code 是 CODE_DOT
        // 此时只需判断接下来是 ./ 还是 / 就行了
        while (TRUE$1) {
            name = KEYPATH_CURRENT;
            // ../
            if (instance.is(CODE_DOT)) {
                instance.go();
                name = KEYPATH_PARENT;
            }
            // ~/a
            else if (instance.is(CODE_WAVE)) {
                instance.go();
                name = KEYPATH_ROOT;
            }
            push(nodes, createIdentifier(name, name, nodes.length > 0));
            // 如果以 / 结尾，则命中 ./ 或 ../
            if (instance.is(CODE_SLASH)) {
                instance.go();
                // 没写错，这里不必强调 isIdentifierStart，数字开头也可以吧
                if (isIdentifierPart(instance.code)) {
                    push(nodes, instance.scanIdentifier(instance.index, TRUE$1));
                    return instance.scanTail(startIndex, nodes);
                }
                else if (instance.is(CODE_DOT)) {
                    // 先跳过第一个 .
                    instance.go();
                    // 继续循环
                }
                else {
                    break;
                }
            }
            // 类似 . 或 ..，可能就是想读取层级对象
            // 此处不用关心后面跟的具体是什么字符，那是其他函数的事情，就算报错也让别的函数去报
            // 此处也不用关心延展操作符，即 ...object，因为表达式引擎管不了这事，它没法把对象变成 attr1=value1 attr2=value2 的格式
            // 这应该是模板引擎该做的事
            else {
                break;
            }
        }
    }
    /**
     * 扫描变量
     */
    scanTail(startIndex, nodes) {
        let instance = this, node;
        /**
         * 标识符后面紧着的字符，可以是 ( . [，此外还存在各种组合，感受一下：
         *
         * a.b.c().length
         * a[b].c()()
         * a[b][c]()[d](e, f, g).length
         * [].length
         */
        loop: while (TRUE$1) {
            switch (instance.code) {
                // a(x)
                case CODE_OPAREN:
                    nodes = [
                        createCall(createMemberIfNeeded(instance.pick(startIndex), nodes), instance.scanTuple(instance.index, CODE_CPAREN), instance.pick(startIndex))
                    ];
                    break;
                // a.x
                case CODE_DOT:
                    instance.go();
                    // 接下来的字符，可能是数字，也可能是标识符，如果不是就报错
                    if (isIdentifierPart(instance.code)) {
                        // 无需识别关键字
                        push(nodes, instance.scanIdentifier(instance.index, TRUE$1));
                        break;
                    }
                    else {
                        break loop;
                    }
                // a[]
                case CODE_OBRACK:
                    // 过掉 [
                    instance.go();
                    node = instance.scanTernary(CODE_CBRACK);
                    if (node) {
                        push(nodes, node);
                        break;
                    }
                    else {
                        break loop;
                    }
                default:
                    break loop;
            }
        }
        return createMemberIfNeeded(instance.pick(startIndex), nodes);
    }
    /**
     * 扫描标识符
     *
     * @param startIndex
     * @param isProp 是否是对象的属性
     * @return
     */
    scanIdentifier(startIndex, isProp) {
        const instance = this;
        while (isIdentifierPart(instance.code)) {
            instance.go();
        }
        const raw = instance.pick(startIndex);
        return !isProp && raw in keywordLiterals
            ? createLiteral(keywordLiterals[raw], raw)
            : createIdentifier(raw, raw, isProp);
    }
    /**
     * 扫描运算符
     *
     * @param startIndex
     */
    scanOperator(startIndex) {
        const instance = this;
        switch (instance.code) {
            // /、%、~、^
            case CODE_DIVIDE:
            case CODE_MODULO:
            case CODE_WAVE:
            case CODE_XOR:
                instance.go();
                break;
            // *
            case CODE_MULTIPLY:
                instance.go();
                break;
            // +
            case CODE_PLUS:
                instance.go();
                break;
            // -
            case CODE_MINUS:
                instance.go();
                break;
            // !、!!、!=、!==
            case CODE_NOT:
                instance.go();
                if (instance.is(CODE_NOT)) {
                    instance.go();
                }
                else if (instance.is(CODE_EQUAL)) {
                    instance.go();
                    if (instance.is(CODE_EQUAL)) {
                        instance.go();
                    }
                }
                break;
            // &、&&
            case CODE_AND:
                instance.go();
                if (instance.is(CODE_AND)) {
                    instance.go();
                }
                break;
            // |、||
            case CODE_OR:
                instance.go();
                if (instance.is(CODE_OR)) {
                    instance.go();
                }
                break;
            // ==、===
            case CODE_EQUAL:
                instance.go();
                if (instance.is(CODE_EQUAL)) {
                    instance.go();
                    if (instance.is(CODE_EQUAL)) {
                        instance.go();
                    }
                }
                break;
            // <、<=、<<
            case CODE_LESS:
                instance.go();
                if (instance.is(CODE_EQUAL)
                    || instance.is(CODE_LESS)) {
                    instance.go();
                }
                break;
            // >、>=、>>、>>>
            case CODE_GREAT:
                instance.go();
                if (instance.is(CODE_EQUAL)) {
                    instance.go();
                }
                else if (instance.is(CODE_GREAT)) {
                    instance.go();
                    if (instance.is(CODE_GREAT)) {
                        instance.go();
                    }
                }
                break;
        }
        if (instance.index > startIndex) {
            return instance.pick(startIndex);
        }
    }
    /**
     * 扫描二元运算
     */
    scanBinary(startIndex) {
        // 二元运算，如 a + b * c / d，这里涉及运算符的优先级
        // 算法参考 https://en.wikipedia.org/wiki/Shunting-yard_algorithm
        let instance = this, 
        // 格式为 [ index1, node1, index2, node2, ... ]
        output = [], token, index, operator, operatorPrecedence, lastOperator, lastOperatorPrecedence;
        while (TRUE$1) {
            instance.skip();
            push(output, instance.index);
            token = instance.scanToken();
            if (token) {
                push(output, token);
                push(output, instance.index);
                instance.skip();
                operator = instance.scanOperator(instance.index);
                // 必须是二元运算符，一元不行
                if (operator && (operatorPrecedence = binary[operator])) {
                    // 比较前一个运算符
                    index = output.length - 4;
                    // 如果前一个运算符的优先级 >= 现在这个，则新建 Binary
                    // 如 a + b * c / d，当从左到右读取到 / 时，发现和前一个 * 优先级相同，则把 b * c 取出用于创建 Binary
                    if ((lastOperator = output[index])
                        && (lastOperatorPrecedence = binary[lastOperator])
                        && lastOperatorPrecedence >= operatorPrecedence) {
                        output.splice(index - 2, 5, createBinary(output[index - 2], lastOperator, output[index + 2], instance.pick(output[index - 3], output[index + 3])));
                    }
                    push(output, operator);
                    continue;
                }
                else {
                    operator = UNDEFINED$1;
                }
            }
            // 没匹配到 token 或 operator 则跳出循环
            break;
        }
        // 类似 a + b * c 这种走到这会有 11 个
        // 此时需要从后往前遍历，因为确定后面的优先级肯定大于前面的
        while (TRUE$1) {
            // 最少的情况是 a + b，它有 7 个元素
            if (output.length >= 7) {
                index = output.length - 4;
                output.splice(index - 2, 5, createBinary(output[index - 2], output[index], output[index + 2], instance.pick(output[index - 3], output[index + 3])));
            }
            else {
                return output[1];
            }
        }
    }
    /**
     * 扫描三元运算
     *
     * @param endCode
     */
    scanTernary(endCode) {
        /**
         * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
         *
         * ?: 运算符的优先级几乎是最低的，比它低的只有四种： 赋值、yield、延展、逗号
         * 我们不支持这四种，因此可认为 ?: 优先级最低
         */
        const instance = this;
        instance.skip();
        let index = instance.index, test = instance.scanBinary(index), yes, no;
        if (instance.is(CODE_QUESTION)) {
            // 跳过 ?
            instance.go();
            yes = instance.scanTernary();
            if (instance.is(CODE_COLON)) {
                // 跳过 :
                instance.go();
                no = instance.scanTernary();
            }
            if (test && yes && no) {
                // 类似 ' a ? 1 : 0 ' 这样的右侧有空格，需要撤回来
                instance.skip(-1);
                test = createTernary(test, yes, no, instance.pick(index));
            }
        }
        // 过掉结束字符
        if (isDef(endCode)) {
            instance.skip();
            if (instance.is(endCode)) {
                instance.go();
            }
        }
        return test;
    }
    fatal(start, message) {
    }
}
const CODE_EOF = 0, //
CODE_DOT = 46, // .
CODE_COMMA = 44, // ,
CODE_SLASH = 47, // /
CODE_BACKSLASH = 92, // \
CODE_SQUOTE = 39, // '
CODE_DQUOTE = 34, // "
CODE_OPAREN = 40, // (
CODE_CPAREN = 41, // )
CODE_OBRACK = 91, // [
CODE_CBRACK = 93, // ]
CODE_OBRACE = 123, // {
CODE_CBRACE = 125, // }
CODE_QUESTION = 63, // ?
CODE_COLON = 58, // :
CODE_PLUS = 43, // +
CODE_MINUS = 45, // -
CODE_MULTIPLY = 42, // *
CODE_DIVIDE = 47, // /
CODE_MODULO = 37, // %
CODE_WAVE = 126, // ~
CODE_AND = 38, // &
CODE_OR = 124, // |
CODE_XOR = 94, // ^
CODE_NOT = 33, // !
CODE_LESS = 60, // <
CODE_EQUAL = 61, // =
CODE_GREAT = 62, // >
/**
 * 区分关键字和普通变量
 * 举个例子：a === true
 * 从解析器的角度来说，a 和 true 是一样的 token
 */
keywordLiterals = {};
keywordLiterals[RAW_TRUE] = TRUE$1;
keywordLiterals[RAW_FALSE] = FALSE$1;
keywordLiterals[RAW_NULL] = NULL$1;
keywordLiterals[RAW_UNDEFINED] = UNDEFINED$1;
/**
 * 是否是空白符，用下面的代码在浏览器测试一下
 *
 * ```
 * for (var i = 0; i < 200; i++) {
 *   console.log(i, String.fromCharCode(i))
 * }
 * ```
 *
 * 从 0 到 32 全是空白符，100 往上分布比较散且较少用，唯一需要注意的是 160
 *
 * 160 表示 non-breaking space
 * http://www.adamkoch.com/2009/07/25/white-space-and-character-160/
 */
function isWhitespace(code) {
    return (code > 0 && code < 33) || code === 160;
}
/**
 * 是否是数字
 */
function isDigit(code) {
    return code > 47 && code < 58; // 0...9
}
/**
 * 是否是数字
 */
function isNumber(code) {
    return isDigit(code) || code === CODE_DOT;
}
/**
 * 变量开始字符必须是 字母、下划线、$
 */
function isIdentifierStart(code) {
    return code === 36 // $
        || code === 95 // _
        || (code > 96 && code < 123) // a...z
        || (code > 64 && code < 91); // A...Z
}
/**
 * 变量剩余的字符必须是 字母、下划线、$、数字
 */
function isIdentifierPart(code) {
    return isIdentifierStart(code) || isDigit(code);
}
const compile$1 = createOneKeyCache(function (content) {
    const parser = new Parser(content);
    return parser.scanTernary(CODE_EOF);
});

// 当前不位于 block 之间
const BLOCK_MODE_NONE = 1, 
// {{ x }}
BLOCK_MODE_SAFE = 2, 
// {{{ x }}}
BLOCK_MODE_UNSAFE = 3, 
// 缓存编译正则
patternCache = {}, 
// 指令分隔符，如 on-click 和 lazy-click
directiveSeparator = '-', 
// on-
directiveOnSeparator = DIRECTIVE_ON + directiveSeparator, 
// lazy-
directiveLazySeparator = DIRECTIVE_LAZY + directiveSeparator, 
// o-
directiveCustomSeparator = DIRECTIVE_CUSTOM + directiveSeparator, 
// 解析 each 的 index
eachIndexPattern = /\s*:\s*([_$a-z]+)$/i, 
// 换行符
// 比较神奇是，有时候你明明看不到换行符，却真的存在一个，那就是 \r
breaklinePattern = /^\s*[\n\r]\s*|\s*[\n\r]\s*$/g, 
// 区间遍历
rangePattern = /\s*(=>|->)\s*/, 
// 标签
tagPattern = /<(\/)?([$a-z][-a-z0-9]*)/i, 
// 注释
commentPattern = /<!--[\s\S]*?-->/g, 
// 开始注释
openCommentPattern = /^([\s\S]*?)<!--/, 
// 结束注释
closeCommentPattern = /-->([\s\S]*?)$/, 
// 属性的 name
// 支持 on-click.namespace="" 或 on-get-out="" 或 xml:xx=""
attributePattern = /^\s*([-$.:\w]+)(?:=(['"]))?/, 
// 自闭合标签
selfClosingTagPattern = /^\s*(\/)?>/;
/**
 * 截取前缀之后的字符串
 */
function slicePrefix(str, prefix) {
    return trim(slice(str, prefix.length));
}
function toTextNode(node) {
    if (node.safe
        && node.expr.type === LITERAL) {
        return createText(toString(node.expr.value));
    }
}
function isSpecialAttr(element, attr) {
    return specialAttrs[attr.name]
        || element.tag === RAW_SLOT && attr.name === RAW_NAME;
}
function removeComment(children) {
    // 类似 <!-- xx {{name}} yy {{age}} zz --> 这样的注释里包含插值
    // 按照目前的解析逻辑，是根据定界符进行模板分拆
    // 一旦出现插值，children 长度必然大于 1
    let openIndex = -1, openText = EMPTY_STRING, closeIndex = -1, closeText = EMPTY_STRING;
    each$2(children, function (child, index) {
        if (child.type === TEXT) {
            // 有了结束 index，这里的任务是配对开始 index
            if (closeIndex >= 0) {
                openText = child.text;
                // 处理 <!-- <!-- 这样有多个的情况
                while (openCommentPattern.test(openText)) {
                    openText = RegExp.$1;
                    openIndex = index;
                }
                if (openIndex >= 0) {
                    // openIndex 肯定小于 closeIndex，因为完整的注释在解析过程中会被干掉
                    // 只有包含插值的注释才会走进这里
                    let startIndex = openIndex, endIndex = closeIndex;
                    // 现在要确定开始和结束的文本节点，是否包含正常文本
                    if (openText) {
                        children[openIndex].text = openText;
                        startIndex++;
                    }
                    if (closeText) {
                        // 合并开始和结束文本，如 1<!-- {{x}}{{y}} -->2
                        // 这里要把 1 和 2 两个文本节点合并成一个
                        if (openText) {
                            children[openIndex].text += closeText;
                        }
                        else {
                            children[closeIndex].text = closeText;
                            endIndex--;
                        }
                    }
                    children.splice(startIndex, endIndex - startIndex + 1);
                    // 重置，再继续寻找结束 index
                    openIndex = closeIndex = -1;
                }
            }
            else {
                // 从后往前遍历
                // 一旦发现能匹配 --> 就可以断定这是注释的结束 index
                // 剩下的就是找开始 index
                closeText = child.text;
                // 处理 --> --> 这样有多个的情况
                while (closeCommentPattern.test(closeText)) {
                    closeText = RegExp.$1;
                    closeIndex = index;
                }
            }
        }
    }, TRUE$1);
}
function compile(content) {
    // 左安全定界符
    let leftSafeDelimiter = repeat(PUBLIC_CONFIG.leftDelimiter, 2), 
    // 右安全定界符
    rightSafeDelimiter = repeat(PUBLIC_CONFIG.rightDelimiter, 2), leftUnsafeFlag = PUBLIC_CONFIG.leftDelimiter, rightUnsafeFlag = PUBLIC_CONFIG.rightDelimiter, nodeList = [], nodeStack = [], 
    // 持有 if 节点，方便 if/elseif/else 出栈时，获取到 if 节点
    ifList = [], 
    // 持有 if/elseif/else 节点
    ifStack = [], 
    // 持有 each 节点，方便 each/else 出栈时，获取到 each 节点
    eachList = [], 
    // 持有 each/else 节点
    eachStack = [], currentElement, currentAttribute, length = content.length, 
    // 当前处理的位置
    index = 0, 
    // 下一段开始的位置
    nextIndex = 0, 
    // 开始定界符的位置，表示的是 {{ 的右侧位置
    openBlockIndex = 0, 
    // 结束定界符的位置，表示的是 }} 的左侧位置
    closeBlockIndex = 0, 
    // 当前正在处理或即将处理的 block 类型
    blockMode = BLOCK_MODE_NONE, 
    // mustache 注释可能出现嵌套插值的情况
    blockStack = [], indexList = [], code, attributeStartQuote, /**
     * 常见的两种情况：
     *
     * <div>
     *    <input>1
     * </div>
     *
     * <div>
     *    <input>
     * </div>
     */
    popSelfClosingElementIfNeeded = function (popingTagName) {
        const lastNode = last(nodeStack);
        if (lastNode && lastNode.type === ELEMENT) {
            const lastElement = lastNode;
            if (lastElement.tag !== popingTagName
                && isSelfClosing(lastElement.tag)) {
                popStack(lastElement.type, lastElement.tag);
            }
        }
    }, popStack = function (type, tagName) {
        const node = pop(nodeStack);
        const branchNode = node, isElement = type === ELEMENT, isAttribute = type === ATTRIBUTE, isProperty = type === PROPERTY, isDirective = type === DIRECTIVE, parentBranchNode = last(nodeStack);
        let { children } = branchNode;
        // 先处理 children.length 大于 1 的情况，因为这里会有一些优化，导致最后的 children.length 不一定大于 0
        if (children && children.length > 1) {
            // 元素层级
            if (!currentElement) {
                removeComment(children);
                if (!children.length) {
                    children = branchNode.children = UNDEFINED$1;
                }
            }
        }
        // 除了 helper.specialAttrs 里指定的特殊属性，attrs 里的任何节点都不能单独拎出来赋给 element
        // 因为 attrs 可能存在 if，所以每个 attr 最终都不一定会存在
        if (children) {
            // 优化单个子节点
            // 减少运行时的负担
            const onlyChild = children.length === 1 && children[0];
            if (onlyChild) {
                switch (onlyChild.type) {
                    case TEXT:
                        if (isElement) {
                            processElementSingleText(branchNode, onlyChild);
                        }
                        else if (isAttribute) {
                            processAttributeSingleText(branchNode, onlyChild);
                        }
                        else if (isProperty) {
                            processPropertySingleText(branchNode, onlyChild);
                        }
                        else if (isDirective) {
                            processDirectiveSingleText(branchNode, onlyChild);
                        }
                        break;
                    case EXPRESSION:
                        if (isElement) {
                            processElementSingleExpression(branchNode, onlyChild);
                        }
                        else if (isAttribute || isProperty || isDirective) {
                            processAttributeSingleExpression(branchNode, onlyChild);
                        }
                        break;
                }
            }
        }
        // 0 个子节点
        else if (currentElement) {
            if (isAttribute) {
                processAttributeEmptyChildren(currentElement, branchNode);
            }
            else if (isProperty) {
                processPropertyEmptyChildren(currentElement, branchNode);
            }
            else if (isDirective) {
                processDirectiveEmptyChildren(currentElement, branchNode);
            }
        }
        if (branchNode.isVirtual && !branchNode.children) {
            replaceChild(branchNode);
        }
        if (isElement) {
            checkElement(branchNode);
        }
        else if (currentElement) {
            if (isAttribute) {
                if (isSpecialAttr(currentElement, branchNode)) {
                    bindSpecialAttr(currentElement, branchNode);
                }
            }
        }
        // 弹出过程可能会修改 branchNode.isStatic，因此这段放在最后执行
        // 当 branchNode 出栈时，它的 isStatic 就彻底固定下来，不会再变了
        // 这时如果它不是静态节点，则父节点也不是静态节点
        if (parentBranchNode
            && parentBranchNode.isStatic
            && !branchNode.isStatic) {
            parentBranchNode.isStatic = FALSE$1;
        }
        return branchNode;
    }, processElementSingleText = function (element, child) {
        // 需要在这特殊处理的是 html 实体
        // 但这只是 WEB 平台的特殊逻辑，所以丢给 platform 处理
        if (isNativeElement(element)
            && setElementText(element, child.text)) {
            element.children = UNDEFINED$1;
        }
    }, processElementSingleExpression = function (element, child) {
        if (isNativeElement(element)) {
            if (child.safe && setElementText(element, child.expr)
                || !child.safe && setElementHtml(element, child.expr)) {
                element.children = UNDEFINED$1;
            }
        }
    }, processPropertyEmptyChildren = function (element, prop) {
        if (prop.hint === HINT_BOOLEAN) {
            prop.value = TRUE$1;
        }
        else {
            // string 或 number 类型的属性，如果不写值，直接忽略
            replaceChild(prop);
        }
    }, processPropertySingleText = function (prop, child) {
        const { text } = child;
        // 数字类型需要严格校验格式，比如 width="100%" 要打印报错信息，提示用户类型错误
        if (prop.hint === HINT_NUMBER) {
            prop.value = toNumber(text);
        }
        // 布尔类型的属性，只有值为 true 或 属性名 才表示 true
        else if (prop.hint === HINT_BOOLEAN) {
            prop.value = text === RAW_TRUE || text === prop.name;
        }
        // 字符串类型的属性，保持原样即可
        else {
            prop.value = text;
        }
        prop.children = UNDEFINED$1;
    }, processAttributeEmptyChildren = function (element, attr) {
        if (isSpecialAttr(element, attr)) ;
        else {
            attr.value = getAttributeDefaultValue(element, attr.name);
        }
    }, processAttributeSingleText = function (attr, child) {
        attr.value = child.text;
        attr.children = UNDEFINED$1;
    }, processAttributeSingleExpression = function (attr, child) {
        const { expr } = child;
        if (expr.type === LITERAL) {
            attr.value = expr.value;
        }
        else {
            attr.expr = expr;
        }
        attr.children = UNDEFINED$1;
    }, processDirectiveEmptyChildren = function (element, directive) {
        directive.value = TRUE$1;
    }, processDirectiveSingleText = function (directive, child) {
        let { ns } = directive, { text } = child, 
        // 自定义指令运行不合法的表达式
        isCustom = ns === DIRECTIVE_CUSTOM, 
        // 指令的值是纯文本，可以预编译表达式，提升性能
        expr, error;
        try {
            expr = compile$1(text);
        }
        catch (e) {
            error = e;
        }
        if (expr) {
            directive.expr = expr;
            directive.value = expr.type === LITERAL
                ? expr.value
                : text;
        }
        else {
            // 自定义指令支持错误的表达式
            // 反正是自定义的规则，爱怎么写就怎么写
            if (!isCustom) {
                throw error;
            }
            directive.value = text;
        }
        directive.children = UNDEFINED$1;
    }, checkCondition = function (condition) {
        // 这里会去掉没有子节点的空分支
        let currentNode = condition, nodeList = [], hasNext = FALSE$1, hasChildren = FALSE$1;
        // 转成数组，方便下一步从后往前遍历
        while (TRUE$1) {
            push(nodeList, currentNode);
            if (currentNode.next) {
                currentNode = currentNode.next;
            }
            else {
                break;
            }
        }
        each$2(nodeList, function (node) {
            // 当前分支有子节点
            if (node.children) {
                // 从后往前遍历第一次发现非空分支
                // 此时，可以删掉后面的空分支
                if (!hasNext && node.next) {
                    delete node.next;
                }
                hasChildren = hasNext = TRUE$1;
            }
        }, TRUE$1);
        // 所有分支都没有子节点，删掉整个 if
        if (!hasChildren) {
            replaceChild(condition);
        }
    }, checkElement = function (element) {
        const { tag, slot } = element, isTemplate = tag === RAW_TEMPLATE, isSlot = tag === RAW_SLOT;
        // 没有子节点，则意味着这个插槽没任何意义
        if (isTemplate && !element.children) {
            replaceChild(element);
        }
        // <slot /> 如果没写 name，自动加上默认名称
        else if (isSlot && !element.name) {
            element.name = SLOT_NAME_DEFAULT;
        }
        // 处理浏览器兼容问题
        else {
            compatElement(element);
        }
    }, bindSpecialAttr = function (element, attr) {
        const { name, value } = attr, 
        // 这 2 个属性值要求是字符串
        isStringValueRequired = name === RAW_NAME || name === RAW_SLOT;
        element[name] = isStringValueRequired ? value : attr;
        replaceChild(attr);
        if (attr.isStatic) {
            attr.isStatic = FALSE$1;
        }
    }, replaceChild = function (oldNode, newNode) {
        let currentBranch = last(nodeStack), isAttr, list, index;
        if (currentBranch) {
            isAttr = currentElement && currentElement === currentBranch;
            list = isAttr
                ? currentBranch.attrs
                : currentBranch.children;
        }
        else {
            list = nodeList;
        }
        if (list) {
            index = indexOf$1(list, oldNode);
            if (index >= 0) {
                if (newNode) {
                    list[index] = newNode;
                }
                else {
                    list.splice(index, 1);
                    if (currentBranch && !list.length) {
                        if (isAttr) {
                            delete currentBranch.attrs;
                        }
                        else {
                            currentBranch.children = UNDEFINED$1;
                        }
                    }
                }
            }
        }
    }, addChild = function (node) {
        /**
         * <div>
         *    <input>
         *    <div></div>
         * </div>
         *
         * <div>
         *    <input>xxx
         * </div>
         */
        if (!currentElement) {
            popSelfClosingElementIfNeeded();
        }
        let type = node.type, currentBranch = last(nodeStack), lastIfBranch = UNDEFINED$1, lastElseIfBranch = UNDEFINED$1, lastEachBranch = UNDEFINED$1;
        if (type === ELSE_IF) {
            const lastNode = last(ifStack);
            if (lastNode) {
                // lastNode 只能是 if 或 else if 节点
                if (lastNode.type === IF) {
                    lastIfBranch = lastNode;
                }
                else if (lastNode.type === ELSE_IF) {
                    lastElseIfBranch = lastNode;
                }
                // 上一个节点是 else，又加了一个 else if
                else ;
            }
        }
        else if (type === ELSE) {
            const lastIfNode = last(ifStack), lastEachNode = last(eachStack);
            if (lastIfNode && currentBranch === lastIfNode) {
                // lastIfNode 只能是 if 或 else if 节点
                if (lastIfNode.type === IF) {
                    lastIfBranch = lastIfNode;
                }
                else if (lastIfNode.type === ELSE_IF) {
                    lastElseIfBranch = lastIfNode;
                }
                // 上一个节点是 else，又加了一个 else
                else ;
            }
            else if (lastEachNode && currentBranch === lastEachNode) {
                // lastEachNode 只能是 each 节点
                if (lastEachNode.type === EACH) {
                    lastEachBranch = lastEachNode;
                }
            }
            else ;
        }
        else {
            if (currentBranch) {
                // 这里不能写 currentElement && !currentAttribute，举个例子
                //
                // <div id="x" {{#if}} name="xx" alt="xx" {{/if}}
                //
                // 当 name 属性结束后，条件满足，但此时已不是元素属性层级了
                if (currentElement && currentBranch.type === ELEMENT) {
                    // node 没法转型，一堆可能的类型怎么转啊...
                    push(currentElement.attrs || (currentElement.attrs = []), node);
                }
                else {
                    const children = currentBranch.children || (currentBranch.children = []), lastChild = last(children);
                    // 如果表达式是安全插值的字面量，可以优化成字符串
                    if (type === EXPRESSION
                        // 在元素的子节点中，则直接转成字符串
                        && (!currentElement
                            // 在元素的属性中，如果同级节点大于 0 个（即至少存在一个），则可以转成字符串
                            || (currentAttribute && children.length > 0))) {
                        const textNode = toTextNode(node);
                        if (textNode) {
                            node = textNode;
                            type = textNode.type;
                        }
                    }
                    // 连续添加文本节点，则直接合并
                    if (lastChild
                        && type === TEXT) {
                        // 合并两个文本节点
                        if (lastChild.type === TEXT) {
                            lastChild.text += node.text;
                            return;
                        }
                        // 前一个是字面量的表达式，也可以合并节点
                        // 比如 attr="{{true}}1"，先插入了一个 true 字面量表达式，然后再插入一个文本时，可以合并
                        if (lastChild.type === EXPRESSION) {
                            const textNode = toTextNode(lastChild);
                            if (textNode) {
                                children[children.length - 1] = textNode;
                                textNode.text += node.text;
                                return;
                            }
                        }
                    }
                    push(children, node);
                }
            }
            else {
                push(nodeList, node);
            }
        }
        if (type === IF) {
            push(ifList, node);
            push(ifStack, node);
        }
        else if (type === EACH) {
            push(eachList, node);
            push(eachStack, node);
        }
        else if (lastIfBranch) {
            lastIfBranch.next = node;
            ifStack[ifStack.length - 1] = node;
            popStack(lastIfBranch.type);
        }
        else if (lastElseIfBranch) {
            lastElseIfBranch.next = node;
            ifStack[ifStack.length - 1] = node;
            popStack(lastElseIfBranch.type);
        }
        else if (lastEachBranch) {
            lastEachBranch.next = node;
            eachStack[eachStack.length - 1] = node;
            popStack(lastEachBranch.type);
        }
        if (node.isLeaf) {
            // 当前树枝节点如果是静态的，一旦加入了一个非静态子节点，改变当前树枝节点的 isStatic
            // 这里不处理树枝节点的进栈，因为当树枝节点出栈时，还有一次处理机会，那时它的 isStatic 已确定下来，不会再变
            if (currentBranch) {
                if (currentBranch.isStatic && !node.isStatic) {
                    currentBranch.isStatic = FALSE$1;
                }
            }
        }
        else {
            push(nodeStack, node);
        }
    }, addTextChild = function (text) {
        // [注意]
        // 这里不能随便删掉
        // 因为收集组件的子节点会受影响，举个例子：
        // <Component>
        //
        // </Component>
        // 按现在的逻辑，这样的组件是没有子节点的，因为在这里过滤掉了，因此该组件没有 slot
        // 如果这里放开了，组件就会有一个 slot
        // trim 文本开始和结束位置的换行符
        text = text.replace(breaklinePattern, EMPTY_STRING);
        if (text) {
            addChild(createText(text));
        }
    }, htmlParsers = [
        function (content) {
            if (!currentElement) {
                const match = content.match(tagPattern);
                // 必须以 <tag 开头才能继续
                // 如果 <tag 前面有别的字符，会走进第四个 parser
                if (match && match.index === 0) {
                    let tag = match[2];
                    // 结束标签
                    if (match[1] === RAW_SLASH) {
                        /**
                         * 处理可能存在的自闭合元素，如下
                         *
                         * <div>
                         *    <input>
                         * </div>
                         */
                        popSelfClosingElementIfNeeded(tag);
                        // 等到 > 字符才算真正的结束
                        currentElement = popStack(ELEMENT);
                    }
                    // 开始标签
                    else {
                        let dynamicTag;
                        // 如果以 $ 开头，表示动态组件
                        if (charAt(tag) === RAW_DOLLAR) {
                            // 编译成表达式
                            tag = slice(tag, 1);
                            dynamicTag = compile$1(tag);
                        }
                        const node = createElement(tag, dynamicTag);
                        addChild(node);
                        currentElement = node;
                    }
                    return match[0];
                }
            }
        },
        // 处理标签的 > 或 />，不论开始还是结束标签
        function (content) {
            const match = content.match(selfClosingTagPattern);
            if (match) {
                // 处理开始标签的 > 或 />
                // 处理结束标签的 >
                if (currentElement && !currentAttribute) {
                    // 自闭合标签
                    if (match[1] === RAW_SLASH) {
                        popStack(currentElement.type, currentElement.tag);
                    }
                    currentElement = UNDEFINED$1;
                    return match[0];
                }
                // 如果只是写了一个 > 字符
                // 比如 <div>></div>
                // 则交给其他 parser 处理
            }
        },
        // 处理 attribute directive 的 name 部分
        function (content) {
            // 当前在 element 层级
            if (currentElement && !currentAttribute) {
                const match = content.match(attributePattern);
                if (match) {
                    let node, name = match[1];
                    if (name === DIRECTIVE_MODEL || name === DIRECTIVE_TRANSITION) {
                        node = createDirective(EMPTY_STRING, name);
                    }
                    // 这里要用 on- 判断前缀，否则 on 太容易重名了
                    else if (startsWith(name, directiveOnSeparator)) {
                        const event = slicePrefix(name, directiveOnSeparator);
                        const parts = camelize(event).split(RAW_DOT);
                        node = createDirective(parts[0], DIRECTIVE_EVENT, parts[1]);
                    }
                    // 当一个元素绑定了多个事件时，可分别指定每个事件的 lazy
                    // 当只有一个事件时，可简写成 lazy
                    // <div on-click="xx" lazy-click
                    else if (name === DIRECTIVE_LAZY) {
                        node = createDirective(EMPTY_STRING, DIRECTIVE_LAZY);
                    }
                    else if (startsWith(name, directiveLazySeparator)) {
                        const lazy = slicePrefix(name, directiveLazySeparator);
                        node = createDirective(camelize(lazy), DIRECTIVE_LAZY);
                    }
                    // 自定义指令
                    else if (startsWith(name, directiveCustomSeparator)) {
                        const custom = slicePrefix(name, directiveCustomSeparator);
                        const parts = camelize(custom).split(RAW_DOT);
                        node = createDirective(parts[0], DIRECTIVE_CUSTOM, parts[1]);
                    }
                    else {
                        // 处理类似 xml:name="value" 的命名空间
                        const parts = name.split(':');
                        node = parts.length === 2
                            ? createAttribute(currentElement, parts[1], parts[0])
                            : createAttribute(currentElement, name, UNDEFINED$1);
                    }
                    addChild(node);
                    // 这里先记下，下一个 handler 要匹配结束引号
                    attributeStartQuote = match[2];
                    // 有属性值才需要设置 currentAttribute，便于后续收集属性值
                    if (attributeStartQuote) {
                        currentAttribute = node;
                    }
                    else {
                        popStack(node.type);
                    }
                    return match[0];
                }
            }
        },
        function (content) {
            let text, match;
            // 处理 attribute directive 的 value 部分
            if (currentAttribute && attributeStartQuote) {
                match = content.match(patternCache[attributeStartQuote] || (patternCache[attributeStartQuote] = new RegExp(attributeStartQuote)));
                // 有结束引号
                if (match) {
                    text = slice(content, 0, match.index);
                    addTextChild(text);
                    // 收集 value 到此结束
                    // 此时如果一个值都没收集到，需设置一个空字符串
                    // 否则无法区分 <div a b=""> 中的 a 和 b
                    if (!currentAttribute.children) {
                        addChild(createText(EMPTY_STRING));
                    }
                    text += attributeStartQuote;
                    popStack(currentAttribute.type);
                    currentAttribute = UNDEFINED$1;
                }
                // 没有结束引号，整段匹配
                // 比如 <div name="1{{a}}2"> 中的 1
                else {
                    text = content;
                    addTextChild(text);
                }
            }
            // 如果不加判断，类似 <div {{...obj}}> 这样写，会把空格当做一个属性
            // 收集文本只有两处：属性值、元素内容
            // 属性值通过上面的 if 处理过了，这里只需要处理元素内容
            else if (!currentElement) {
                // 获取 <tag 前面的字符
                match = content.match(tagPattern);
                text = match
                    ? slice(content, 0, match.index)
                    : content;
                // 元素层级的 HTML 注释都要删掉
                if (text) {
                    addTextChild(text.replace(commentPattern, EMPTY_STRING));
                }
            }
            else {
                text = content;
            }
            return text;
        },
    ], blockParsers = [
        // {{#each xx:index}}
        function (source) {
            if (startsWith(source, SYNTAX_EACH)) {
                source = trim(slicePrefix(source, SYNTAX_EACH));
                let literal = source, index = UNDEFINED$1, match = source.match(eachIndexPattern);
                if (match) {
                    index = match[1];
                    literal = slice(source, 0, -1 * match[0].length);
                }
                match = literal.match(rangePattern);
                if (match) {
                    const parts = literal.split(rangePattern), from = compile$1(parts[0]), to = compile$1(parts[2]);
                    if (from && to) {
                        return createEach(from, to, match[1] === '=>', index);
                    }
                }
                else {
                    const expr = compile$1(literal);
                    if (expr) {
                        return createEach(expr, UNDEFINED$1, FALSE$1, index);
                    }
                }
            }
        },
        // {{#import name}}
        function (source) {
            if (startsWith(source, SYNTAX_IMPORT)) {
                source = slicePrefix(source, SYNTAX_IMPORT);
                if (source) {
                    return createImport(source);
                }
            }
        },
        // {{#partial name}}
        function (source) {
            if (startsWith(source, SYNTAX_PARTIAL)) {
                source = slicePrefix(source, SYNTAX_PARTIAL);
                if (source) {
                    return createPartial(source);
                }
            }
        },
        // {{#if expr}}
        function (source) {
            if (startsWith(source, SYNTAX_IF)) {
                source = slicePrefix(source, SYNTAX_IF);
                const expr = compile$1(source);
                if (expr) {
                    return createIf(expr);
                }
            }
        },
        // {{else if expr}}
        function (source) {
            if (startsWith(source, SYNTAX_ELSE_IF)) {
                source = slicePrefix(source, SYNTAX_ELSE_IF);
                const expr = compile$1(source);
                if (expr) {
                    return createElseIf(expr);
                }
            }
        },
        // {{else}}
        function (source) {
            if (startsWith(source, SYNTAX_ELSE)) {
                source = slicePrefix(source, SYNTAX_ELSE);
                if (!trim(source)) {
                    return createElse();
                }
            }
        },
        // {{...obj}}
        function (source) {
            if (startsWith(source, SYNTAX_SPREAD)) {
                source = slicePrefix(source, SYNTAX_SPREAD);
                const expr = compile$1(source);
                if (expr) {
                    if (currentElement && currentElement.isComponent) {
                        return createSpread(expr);
                    }
                }
            }
        },
        // {{expr}}
        function (source) {
            if (!SYNTAX_COMMENT.test(source)) {
                source = trim(source);
                const expr = compile$1(source);
                if (expr) {
                    return createExpression(expr, blockMode === BLOCK_MODE_SAFE);
                }
            }
        },
    ], parseHtml = function (code) {
        while (code) {
            each$2(htmlParsers, function (parse) {
                const match = parse(code);
                if (match) {
                    code = slice(code, match.length);
                    return FALSE$1;
                }
            });
        }
    }, parseBlock = function (code) {
        if (charAt(code) === RAW_SLASH) {
            /**
             * 处理可能存在的自闭合元素，如下
             *
             * {{#if xx}}
             *    <input>
             * {{/if}}
             */
            popSelfClosingElementIfNeeded();
            const name = slice(code, 1);
            let type = name2Type[name], ifNode = UNDEFINED$1, eachNode = UNDEFINED$1;
            if (type === IF) {
                const node = pop(ifStack);
                if (node) {
                    type = node.type;
                    ifNode = pop(ifList);
                }
            }
            else if (type === EACH) {
                const node = pop(eachStack);
                if (node) {
                    type = node.type;
                    eachNode = pop(eachList);
                }
            }
            popStack(type);
            if (ifNode) {
                checkCondition(ifNode);
            }
            else if (eachNode) {
                checkCondition(eachNode);
            }
        }
        else {
            // 开始下一个 block 或表达式
            each$2(blockParsers, function (parse) {
                const node = parse(code);
                if (node) {
                    addChild(node);
                    return FALSE$1;
                }
            });
        }
    }, closeBlock = function () {
        // 确定开始和结束定界符能否配对成功，即 {{ 对 }}，{{{ 对 }}}
        // 这里不能动 openBlockIndex 和 closeBlockIndex，因为等下要用他俩 slice
        index = closeBlockIndex + rightSafeDelimiter.length;
        // 这里要用 <=，因为很可能到头了
        if (index <= length) {
            if (index < length && charAt(content, index) === rightUnsafeFlag) {
                if (blockMode === BLOCK_MODE_UNSAFE) {
                    nextIndex = index + 1;
                }
            }
            else {
                if (blockMode === BLOCK_MODE_SAFE) {
                    nextIndex = index;
                }
            }
            pop(blockStack);
            // 结束定界符左侧的位置
            addIndex(closeBlockIndex);
            // 此时 nextIndex 位于结束定界符的右侧
        }
        else {
            // 到头了
            return TRUE$1;
        }
    }, addIndex = function (index) {
        if (!blockStack.length) {
            push(indexList, index);
        }
    };
    // 因为存在 mustache 注释内包含插值的情况
    // 这里把流程设计为先标记切片的位置，标记过程中丢弃无效的 block
    // 最后处理有效的 block
    while (TRUE$1) {
        // 当前内容位置
        addIndex(nextIndex);
        // 寻找下一个开始定界符和结束定界符
        openBlockIndex = indexOf(content, leftSafeDelimiter, nextIndex);
        closeBlockIndex = indexOf(content, rightSafeDelimiter, nextIndex);
        // 如果是连续的结束定界符，比如 {{！{{xx}} }}
        // 需要调用 closeBlock
        if (closeBlockIndex >= nextIndex
            && (openBlockIndex < 0 || closeBlockIndex < openBlockIndex)) {
            if (closeBlock()) {
                break;
            }
        }
        // 解析下一个 block
        else if (openBlockIndex >= nextIndex) {
            // 当前为安全插值模式
            blockMode = BLOCK_MODE_SAFE;
            // 开始定界符左侧的位置
            addIndex(openBlockIndex);
            // 跳过开始定界符
            openBlockIndex += leftSafeDelimiter.length;
            // 开始定界符后面总得有内容吧
            if (openBlockIndex < length) {
                // 判断是否为危险插值模式
                if (charAt(content, openBlockIndex) === leftUnsafeFlag) {
                    blockMode = BLOCK_MODE_UNSAFE;
                    openBlockIndex++;
                }
                // 开始定界符右侧的位置
                addIndex(openBlockIndex);
                // block 模式
                addIndex(blockMode);
                // 打开一个 block 就入栈一个
                push(blockStack, TRUE$1);
                if (openBlockIndex < length) {
                    // 结束定界符左侧的位置
                    closeBlockIndex = indexOf(content, rightSafeDelimiter, openBlockIndex);
                    if (closeBlockIndex >= openBlockIndex) {
                        nextIndex = indexOf(content, leftSafeDelimiter, openBlockIndex);
                        // 判断结束定界符是否能匹配开始定界符
                        // 因为支持 mustache 注释，而注释又能嵌套，如 {{！  {{xx}} {{! {{xx}} }}  }}
                        // 当 {{ 和 }} 中间还有 {{ 时，则表示无法匹配，需要靠下一次循环再次解析
                        if (nextIndex < 0 || closeBlockIndex < nextIndex) {
                            if (closeBlock()) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            break;
        }
    }
    // 开始处理有效 block 之前，重置 blockMode
    blockMode = BLOCK_MODE_NONE;
    for (let i = 0, length = indexList.length; i < length; i += 5) {
        // 每个单元有 5 个 index
        // [当前内容位置，下一个开始定界符的左侧, 下一个开始定界符的右侧, block 模式, 下一个结束定界符的左侧]
        index = indexList[i];
        // 开始定界符左侧的位置
        openBlockIndex = indexList[i + 1];
        // 如果 openBlockIndex 存在，则后续 3 个 index 都存在
        if (isDef(openBlockIndex)) {
            parseHtml(slice(content, index, openBlockIndex));
            // 开始定界符右侧的位置
            openBlockIndex = indexList[i + 2];
            blockMode = indexList[i + 3];
            // 结束定界符左侧的位置
            closeBlockIndex = indexList[i + 4];
            code = trim(slice(content, openBlockIndex, closeBlockIndex));
            // 不用处理 {{ }} 和 {{{ }}} 这种空 block
            if (code) {
                parseBlock(code);
            }
        }
        else {
            blockMode = BLOCK_MODE_NONE;
            parseHtml(slice(content, index));
        }
    }
    if (nodeStack.length) {
        /**
         * 处理可能存在的自闭合元素，如下
         *
         * <input>
         */
        popSelfClosingElementIfNeeded();
    }
    if (nodeList.length > 0) {
        removeComment(nodeList);
    }
    return nodeList;
}

const QUOTE_DOUBLE = '"', QUOTE_SINGLE = "'", COMMA = ',', RETURN = 'return ';
// 下面这些值需要根据外部配置才能确定
let isUglify$1 = UNDEFINED$1, isMinify = UNDEFINED$1, UNDEFINED = EMPTY_STRING, NULL = EMPTY_STRING, TRUE = EMPTY_STRING, FALSE = EMPTY_STRING, SPACE = EMPTY_STRING, INDENT = EMPTY_STRING, BREAK_LINE = EMPTY_STRING;
class Raw {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
class Primitive {
    constructor(value) {
        this.value = value;
    }
    toString() {
        const { value } = this;
        return value === TRUE$1
            ? TRUE
            : value === FALSE$1
                ? FALSE
                : value === NULL$1
                    ? NULL
                    : value === UNDEFINED$1
                        ? UNDEFINED
                        : string$1(value)
                            ? toStringLiteral(value)
                            : `${value}`;
    }
}
class Tuple {
    constructor(left, right, separator, breakLine, items) {
        this.left = left;
        this.right = right;
        this.separator = separator;
        this.breakLine = breakLine;
        this.items = items || [];
    }
    unshift(value) {
        unshift(this.items, value);
    }
    push(value) {
        push(this.items, value);
    }
    toString(tabSize) {
        let { left, right, separator, breakLine, items } = this, { length } = items;
        if (!length) {
            return `${left}${right}`;
        }
        const currentTabSize = tabSize || 0, nextTabSize = left ? currentTabSize + 1 : currentTabSize, currentIndentSize = repeat(INDENT, currentTabSize), nextIndentSize = repeat(INDENT, nextTabSize), result = items.map(function (item) {
            return item.toString(nextTabSize);
        });
        if (left && breakLine) {
            left += BREAK_LINE + nextIndentSize;
        }
        if (right && breakLine) {
            right = BREAK_LINE + currentIndentSize + right;
        }
        return `${left}${join$1(result, breakLine
            ? separator + BREAK_LINE + nextIndentSize
            : separator + SPACE)}${right}`;
    }
}
class Map {
    constructor(fields) {
        this.fields = {};
        if (fields) {
            const instance = this;
            each(fields, function (value, key) {
                instance.set(key, value);
            });
        }
    }
    set(name, value) {
        if (value instanceof Primitive
            && value.value === UNDEFINED$1) {
            return;
        }
        this.fields[name] = value;
    }
    isNotEmpty() {
        return keys(this.fields).length > 0;
    }
    toString(tabSize) {
        const items = [];
        each(this.fields, function (value, key) {
            push(items, {
                toString(tabSize) {
                    return toObjectPair(key, value.toString(tabSize));
                }
            });
        });
        return toTuple('{', '}', COMMA, TRUE$1, items).toString(tabSize);
    }
}
class Call {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
    toString(tabSize) {
        const { name, args } = this, tuple = args
            ? toTuple('(', ')', COMMA, TRUE$1, trimArgs(args)).toString(tabSize)
            : '()';
        return `${name}${tuple}`;
    }
}
class Unary {
    constructor(operator, value) {
        this.operator = operator;
        this.value = value;
    }
    toString(tabSize) {
        return `${this.operator}${this.value.toString(tabSize)}`;
    }
}
class Binary {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    toString(tabSize) {
        let left = this.left.toString(tabSize), right = this.right.toString(tabSize);
        if (this.leftGroup) {
            left = `(${left})`;
        }
        if (this.rightGroup) {
            right = `(${right})`;
        }
        return `${left}${SPACE}${this.operator}${SPACE}${right}`;
    }
}
class Ternary {
    constructor(test, yes, no) {
        this.test = test;
        this.yes = yes;
        this.no = no;
    }
    toString(tabSize) {
        return `${this.test.toString(tabSize)}${SPACE}?${SPACE}${this.yes.toString(tabSize)}${SPACE}:${SPACE}${this.no.toString(tabSize)}`;
    }
}
class AnonymousFunction {
    constructor(args, body, returnValue) {
        this.args = args;
        this.body = body;
        this.returnValue = returnValue;
    }
    toString(tabSize) {
        const { args, body, returnValue } = this, currentTabSize = tabSize || 0, nextTabSize = currentTabSize + 1, currentIndentSize = repeat(INDENT, currentTabSize), nextIndentSize = repeat(INDENT, nextTabSize), tuple = args ? toTuple(EMPTY_STRING, EMPTY_STRING, COMMA, FALSE$1, args).toString(currentTabSize) : EMPTY_STRING, code = [];
        if (body) {
            push(code, body.toString(nextTabSize));
        }
        if (returnValue) {
            push(code, `${RETURN}${returnValue.toString(nextTabSize)}`);
        }
        return `${RAW_FUNCTION}${SPACE}(${tuple})${SPACE}{${BREAK_LINE}${nextIndentSize}${join$1(code, BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize}}`;
    }
}
class Operator {
    constructor(base, code) {
        this.base = base;
        this.code = code;
    }
    toString(tabSize) {
        const { base, code } = this;
        return `${base.toString(tabSize)}.${code.toString(tabSize)}`;
    }
}
class Push {
    constructor(array, item) {
        this.array = array;
        this.item = item;
    }
    toString(tabSize) {
        const { array, item } = this;
        return `${array}[${SPACE}${array}.length${SPACE}]${SPACE}=${SPACE}${item.toString(tabSize)}`;
    }
}
function toRaw(value) {
    return new Raw(value);
}
function toPrimitive(value) {
    return new Primitive(value);
}
function toTuple(left, right, separator, breakLine, items) {
    return new Tuple(left, right, separator, breakLine, items);
}
function toList(items) {
    return new Tuple('[', ']', COMMA, TRUE$1, items);
}
function toMap(fields) {
    return new Map(fields);
}
function toCall(name, args) {
    return new Call(name, args);
}
function toUnary(operator, value) {
    return new Unary(operator, value);
}
function toBinary(left, operator, right) {
    return new Binary(left, operator, right);
}
function toTernary(test, yes, no) {
    return new Ternary(test, yes, no);
}
function toAnonymousFunction(args, body, returnValue) {
    return new AnonymousFunction(args, body, returnValue);
}
function toOperator(base, code) {
    return new Operator(base, code);
}
function toPush(array, item) {
    return new Push(array, item);
}
/**
 * 目的是 保证调用参数顺序稳定，减少运行时判断
 *
 * [a, undefined, undefined] => [a]
 * [a, undefined, b, undefined] => [a, undefined, b]
 */
function trimArgs(list) {
    let args = [], removable = TRUE$1;
    each$2(list, function (arg) {
        const isDef = arg instanceof Primitive
            ? arg.value !== UNDEFINED$1
            : TRUE$1;
        if (isDef) {
            removable = FALSE$1;
            unshift(args, arg);
        }
        else if (!removable) {
            unshift(args, toPrimitive(UNDEFINED$1));
        }
    }, TRUE$1);
    return args;
}
function toStringLiteral(value) {
    // 优先用单引号
    const quote = has$1(value, QUOTE_SINGLE)
        ? QUOTE_DOUBLE
        : QUOTE_SINGLE;
    // 换行符会导致字符串语法错误
    return `${quote}${value.replace(/\n\s*/g, '\\n')}${quote}`;
}
function toObjectPair(key, value) {
    if (!/^[\w$]+$/.test(key)) {
        key = toStringLiteral(key);
    }
    return `${key}:${SPACE}${value}`;
}
function toVarPair(key, value) {
    return `${key}${SPACE}=${SPACE}${value}`;
}
function init$1() {
    if (isUglify$1 !== PUBLIC_CONFIG.uglifyCompiled) {
        isUglify$1 = PUBLIC_CONFIG.uglifyCompiled;
        if (isUglify$1) {
            UNDEFINED = '$1';
            NULL = '$2';
            TRUE = '$3';
            FALSE = '$4';
        }
        else {
            UNDEFINED = '$undefined';
            NULL = '$null';
            TRUE = '$true';
            FALSE = '$false';
        }
    }
    if (isMinify !== PUBLIC_CONFIG.minifyCompiled) {
        isMinify = PUBLIC_CONFIG.minifyCompiled;
        if (isMinify) {
            SPACE = INDENT = BREAK_LINE = EMPTY_STRING;
        }
        else {
            SPACE = ' ';
            INDENT = '  ';
            BREAK_LINE = '\n';
        }
    }
}
function parse(keypath) {
    return keypath.split(RAW_DOT)
        .filter(function (item) {
        return item.length > 0;
    })
        .map(toPrimitive);
}
function generate$2(args, vars, code) {
    const localVarMap = {}, localVarList = [], addLocalVar = function (value, key) {
        push(localVarList, {
            toString(tabSize) {
                return toVarPair(key, value.toString(tabSize));
            }
        });
    };
    localVarMap[UNDEFINED] = toRaw('void 0');
    localVarMap[NULL] = toRaw('null');
    localVarMap[TRUE] = toRaw('!0');
    localVarMap[FALSE] = toRaw('!1');
    each(localVarMap, addLocalVar);
    each(vars, addLocalVar);
    return toAnonymousFunction(args, toTuple(EMPTY_STRING, EMPTY_STRING, ';', TRUE$1, [
        {
            toString(tabSize) {
                return `var ${toTuple(EMPTY_STRING, EMPTY_STRING, COMMA, FALSE$1, localVarList).toString(tabSize)}`;
            }
        },
        code
    ])).toString();
}

/**
 * 比较操作符优先级
 *
 * @param node
 * @param operator
 */
function compareOperatorPrecedence(node, operator) {
    // 三元表达式优先级最低
    if (node.type === TERNARY) {
        return -1;
    }
    // 二元运算要比较优先级
    if (node.type === BINARY) {
        return binary[node.operator] - binary[operator];
    }
    return 0;
}
function generate$1(node, transformIdentifier, generateIdentifier, generateValue, generateCall, holder, stack, parentNode) {
    let value, hasHolder = FALSE$1, generateNode = function (node, parentNode) {
        return generate$1(node, transformIdentifier, generateIdentifier, generateValue, generateCall, FALSE$1, // 如果是内部临时值，不需要 holder
        stack, parentNode);
    }, generateNodes = function (nodes, parentNode) {
        return nodes.map(function (node) {
            return generateNode(node, parentNode);
        });
    };
    switch (node.type) {
        case LITERAL:
            const literalNode = node;
            value = toPrimitive(literalNode.value);
            break;
        case UNARY:
            const unaryNode = node;
            value = toUnary(unaryNode.operator, generateNode(unaryNode.node));
            break;
        case BINARY:
            const binaryNode = node, left = generateNode(binaryNode.left), right = generateNode(binaryNode.right), newBinary = toBinary(left, binaryNode.operator, right);
            if (compareOperatorPrecedence(binaryNode.left, binaryNode.operator) < 0) {
                newBinary.leftGroup = TRUE$1;
            }
            if (compareOperatorPrecedence(binaryNode.right, binaryNode.operator) < 0) {
                newBinary.rightGroup = TRUE$1;
            }
            value = newBinary;
            break;
        case TERNARY:
            const ternaryNode = node, test = generateNode(ternaryNode.test), yes = generateNode(ternaryNode.yes), no = generateNode(ternaryNode.no);
            value = toTernary(test, yes, no);
            break;
        case ARRAY:
            const arrayNode = node;
            value = toList(generateNodes(arrayNode.nodes, parentNode));
            break;
        case OBJECT:
            const objectNode = node, newObject = toMap();
            each$2(objectNode.keys, function (key, index) {
                const value = objectNode.values[index];
                newObject.set(key, generateNode(value));
            });
            value = newObject;
            break;
        case IDENTIFIER:
            hasHolder = TRUE$1;
            const identifierNode = node;
            value = transformIdentifier(identifierNode)
                || generateIdentifier(identifierNode, identifierNode.name ? parse(identifierNode.name) : UNDEFINED$1, holder, stack, parentNode);
            break;
        case MEMBER:
            hasHolder = TRUE$1;
            const memberNode = node;
            if (memberNode.lead.type === IDENTIFIER) {
                // 只能是 a[b] 的形式，因为 a.b 已经在解析时转换成 Identifier 了
                const leadNode = memberNode.lead, leadValue = transformIdentifier(leadNode), memberNodes = generateNodes(memberNode.nodes || []);
                if (leadValue) {
                    value = generateValue(leadValue, memberNodes, holder);
                }
                else {
                    if (leadNode.name) {
                        // a.b.c[d] 这里要把 a.b.c 拆开
                        each$2(parse(leadNode.name), function (node) {
                            memberNodes.unshift(node);
                        }, TRUE$1);
                    }
                    value = generateIdentifier(memberNode, memberNodes, holder, stack, parentNode);
                }
            }
            else if (memberNode.nodes) {
                // "xx"[length]
                // format()[a][b]
                value = generateValue(generateNode(memberNode.lead), generateNodes(memberNode.nodes || []), holder);
            }
            else {
                // "xx".length
                // format().a.b
                value = generateValue(generateNode(memberNode.lead), parse(memberNode.keypath), holder);
            }
            break;
        default:
            hasHolder = TRUE$1;
            const callNode = node;
            value = generateCall(generateNode(callNode.name, callNode), callNode.args.length
                ? generateNodes(callNode.args)
                : UNDEFINED$1, holder);
            break;
    }
    if (!holder || hasHolder) {
        return value;
    }
    return toMap({
        value,
    });
}

const NATIVE_ATTRIBUTES = 'nativeAttrs';
const NATIVE_PROPERTIES = 'nativeProps';
const PROPERTIES = 'props';
const DIRECTIVES = 'directives';
const EVENTS = 'events';
const MODEL = 'model';
const LAZY = 'lazy';
const TRANSITION = 'transition';
const CHILDREN = 'children';

// 是否正在收集虚拟节点
const vnodeStack = [TRUE$1], 
// 是否正在处理组件节点
componentStack = [], 
// 是否正在处理 attribute
attributeStack = [], 
// 是否正在处理特殊 each，包括 遍历 range 和 遍历数组字面量和对象字面量
eachStack = [], 
// 是否正在收集字符串类型的值
stringStack = [], 
// 是否正在收集动态 child
dynamicChildrenStack = [TRUE$1], magicVariables = [MAGIC_VAR_KEYPATH, MAGIC_VAR_LENGTH, MAGIC_VAR_EVENT, MAGIC_VAR_DATA], nodeGenerator = {};
// 下面这些值需要根据外部配置才能确定
let isUglify = UNDEFINED$1, 
// 下面 4 个变量用于分配局部变量名称
localVarId = 0, localVarMap = {}, localVarCache = {}, VAR_LOCAL_PREFIX = EMPTY_STRING, ARG_INSTANCE = EMPTY_STRING, RENDER_ELEMENT_VNODE = EMPTY_STRING, RENDER_COMPONENT_VNODE = EMPTY_STRING, ADD_ATTRIBUTE = EMPTY_STRING, ADD_TEXT_VNODE = EMPTY_STRING, RENDER_TRANSITION = EMPTY_STRING, RENDER_MODEL = EMPTY_STRING, RENDER_EVENT_METHOD = EMPTY_STRING, RENDER_EVENT_NAME = EMPTY_STRING, RENDER_DIRECTIVE = EMPTY_STRING, RENDER_SPREAD = EMPTY_STRING, RENDER_SLOT = EMPTY_STRING, DEFINE_PARTIAL = EMPTY_STRING, RENDER_PARTIAL = EMPTY_STRING, RENDER_EACH = EMPTY_STRING, RENDER_RANGE = EMPTY_STRING, RENDER_EXPRESSION_IDENTIFIER = EMPTY_STRING, RENDER_EXPRESSION_VALUE = EMPTY_STRING, EXECUTE_FUNCTION = EMPTY_STRING, TO_STRING = EMPTY_STRING, ARG_STACK = EMPTY_STRING, ARG_VNODE = EMPTY_STRING, ARG_CHILDREN = EMPTY_STRING, ARG_COMPONENTS = EMPTY_STRING, ARG_MAGIC_VAR_SCOPE = EMPTY_STRING, ARG_MAGIC_VAR_KEYPATH = EMPTY_STRING, ARG_MAGIC_VAR_LENGTH = EMPTY_STRING, ARG_MAGIC_VAR_EVENT = EMPTY_STRING, ARG_MAGIC_VAR_DATA = EMPTY_STRING;
function init() {
    if (isUglify === PUBLIC_CONFIG.uglifyCompiled) {
        return;
    }
    if (PUBLIC_CONFIG.uglifyCompiled) {
        VAR_LOCAL_PREFIX = '_v';
        ARG_INSTANCE = '_a';
        RENDER_ELEMENT_VNODE = '_b';
        RENDER_COMPONENT_VNODE = '_c';
        ADD_ATTRIBUTE = '_d';
        ADD_TEXT_VNODE = '_e';
        RENDER_TRANSITION = '_f';
        RENDER_MODEL = '_g';
        RENDER_EVENT_METHOD = '_h';
        RENDER_EVENT_NAME = '_i';
        RENDER_DIRECTIVE = '_j';
        RENDER_SPREAD = '_k';
        RENDER_SLOT = '_l';
        DEFINE_PARTIAL = '_m';
        RENDER_PARTIAL = '_n';
        RENDER_EACH = '_o';
        RENDER_RANGE = '_p';
        RENDER_EXPRESSION_IDENTIFIER = '_q';
        RENDER_EXPRESSION_VALUE = '_r';
        EXECUTE_FUNCTION = '_s';
        TO_STRING = '_t';
        ARG_STACK = '_u';
        ARG_VNODE = '_v';
        ARG_CHILDREN = '_w';
        ARG_COMPONENTS = '_x';
        ARG_MAGIC_VAR_SCOPE = '_y';
        ARG_MAGIC_VAR_KEYPATH = '_z';
        ARG_MAGIC_VAR_LENGTH = '_1';
        ARG_MAGIC_VAR_EVENT = '_2';
        ARG_MAGIC_VAR_DATA = '_3';
    }
    else {
        VAR_LOCAL_PREFIX = 'var';
        ARG_INSTANCE = 'instance';
        RENDER_ELEMENT_VNODE = 'renderElementVnode';
        RENDER_COMPONENT_VNODE = 'renderComponentVnode';
        ADD_ATTRIBUTE = 'addAttribute';
        ADD_TEXT_VNODE = 'addTextVnode';
        RENDER_TRANSITION = 'renderTransition';
        RENDER_MODEL = 'renderModel';
        RENDER_EVENT_METHOD = 'renderEventMethod';
        RENDER_EVENT_NAME = 'renderEventName';
        RENDER_DIRECTIVE = 'renderDirective';
        RENDER_SPREAD = 'renderSpread';
        RENDER_SLOT = 'renderSlot';
        DEFINE_PARTIAL = 'definePartial';
        RENDER_PARTIAL = 'renderPartial';
        RENDER_EACH = 'renderEach';
        RENDER_RANGE = 'renderRange';
        RENDER_EXPRESSION_IDENTIFIER = 'renderExpressionIdentifier';
        RENDER_EXPRESSION_VALUE = 'renderExpressionValue';
        EXECUTE_FUNCTION = 'executeFunction';
        TO_STRING = 'toString';
        ARG_STACK = 'stack';
        ARG_VNODE = 'vnode';
        ARG_CHILDREN = 'children';
        ARG_COMPONENTS = 'components';
        ARG_MAGIC_VAR_SCOPE = MAGIC_VAR_SCOPE;
        ARG_MAGIC_VAR_KEYPATH = MAGIC_VAR_KEYPATH;
        ARG_MAGIC_VAR_LENGTH = MAGIC_VAR_LENGTH;
        ARG_MAGIC_VAR_EVENT = MAGIC_VAR_EVENT;
        ARG_MAGIC_VAR_DATA = MAGIC_VAR_DATA;
    }
    isUglify = PUBLIC_CONFIG.uglifyCompiled;
}
function addLocalVar(value) {
    const hash = value.toString();
    if (localVarCache[hash]) {
        return localVarCache[hash];
    }
    const key = VAR_LOCAL_PREFIX + (localVarId++);
    localVarMap[key] = value;
    localVarCache[hash] = key;
    return key;
}
function transformExpressionIdentifier(node) {
    const { name, root, lookup, offset } = node;
    // 魔法变量，直接转换
    if (has$2(magicVariables, name)) {
        switch (name) {
            case MAGIC_VAR_KEYPATH:
                return toRaw(ARG_MAGIC_VAR_KEYPATH);
            case MAGIC_VAR_LENGTH:
                return toRaw(ARG_MAGIC_VAR_LENGTH);
            case MAGIC_VAR_EVENT:
                return toRaw(ARG_MAGIC_VAR_EVENT);
            case MAGIC_VAR_DATA:
                return toRaw(ARG_MAGIC_VAR_DATA);
            default:
                return toRaw(name);
        }
    }
    // this 仅在 each 中有意义
    // 这里把 this 转成 $scope，方便直接读取
    // 避免不必要的查找，提升性能
    if (last(eachStack)
        && root === FALSE$1
        && lookup === FALSE$1
        && offset === 0) {
        return toRaw(name === EMPTY_STRING
            ? ARG_MAGIC_VAR_SCOPE
            : ARG_MAGIC_VAR_SCOPE
                + RAW_DOT
                // 这里要把 list.0.a 转成 list[0].a
                // . 是 Yox 特有的访问数组的语法，正常的 js 语法是 [index]
                + name.replace(/\.(\d+)/g, '[$1]'));
    }
}
function generateHolderIfNeeded(node, holder) {
    return holder
        ? node
        : toOperator(node, toRaw('value'));
}
function generateExpressionIdentifier(node, nodes, holder, stack, parentNode) {
    let getIndex;
    if (node.root) {
        getIndex = toRaw(addLocalVar(toAnonymousFunction(UNDEFINED$1, UNDEFINED$1, toPrimitive(0))));
    }
    else if (node.offset) {
        getIndex = toRaw(addLocalVar(toAnonymousFunction([
            toRaw(ARG_STACK)
        ], UNDEFINED$1, toOperator(toRaw(ARG_STACK), toBinary(toRaw('length'), '-', toPrimitive(1 + node.offset))))));
    }
    else {
        getIndex = toRaw(addLocalVar(toAnonymousFunction([
            toRaw(ARG_STACK)
        ], UNDEFINED$1, toOperator(toRaw(ARG_STACK), toBinary(toRaw('length'), '-', toPrimitive(1))))));
    }
    return generateHolderIfNeeded(toCall(RENDER_EXPRESSION_IDENTIFIER, [
        getIndex,
        nodes
            ? toList(nodes)
            : toPrimitive(UNDEFINED$1),
        node.lookup
            ? toPrimitive(TRUE$1)
            : toPrimitive(UNDEFINED$1),
        stack
            ? toRaw(ARG_STACK)
            : toPrimitive(UNDEFINED$1),
        parentNode && parentNode.type === CALL
            ? toPrimitive(TRUE$1)
            : toPrimitive(UNDEFINED$1)
    ]), holder);
}
function generateExpressionValue(value, keys, holder) {
    return generateHolderIfNeeded(toCall(RENDER_EXPRESSION_VALUE, [
        value,
        toList(keys)
    ]), holder);
}
function generateExpressionCall(fn, args, holder) {
    return generateHolderIfNeeded(toCall(EXECUTE_FUNCTION, [
        fn,
        args
            ? toList(args)
            : toPrimitive(UNDEFINED$1)
    ]), holder);
}
function generateExpression(expr) {
    return generate$1(expr, transformExpressionIdentifier, generateExpressionIdentifier, generateExpressionValue, generateExpressionCall);
}
function generateExpressionHolder(expr) {
    return generate$1(expr, transformExpressionIdentifier, generateExpressionIdentifier, generateExpressionValue, generateExpressionCall, TRUE$1);
}
function generateExpressionArg(expr) {
    return generate$1(expr, transformExpressionIdentifier, generateExpressionIdentifier, generateExpressionValue, generateExpressionCall, FALSE$1, TRUE$1);
}
function generateAttributeValue(value, expr, children) {
    if (isDef(value)) {
        return toPrimitive(value);
    }
    // 只有一个表达式时，保持原始类型
    if (expr) {
        return generateExpression(expr);
    }
    // 多个值拼接时，要求是字符串
    if (children) {
        // 常见的应用场景是序列化 HTML 元素属性值，处理值时要求字符串，在处理属性名这个级别，不要求字符串
        // compiler 会把原始字符串编译成 value
        // compiler 会把单个插值编译成 expr
        // 因此走到这里，一定是多个插值或是单个特殊插值（比如 If)
        push(stringStack, TRUE$1);
        const result = generateNodesToStringIfNeeded(children);
        pop(stringStack);
        return result;
    }
    return toPrimitive(UNDEFINED$1);
}
function generateNodesToTuple(nodes) {
    const result = nodes.map(function (node) {
        return nodeGenerator[node.type](node);
    });
    return toTuple(EMPTY_STRING, EMPTY_STRING, ';', TRUE$1, result);
}
function generateNodesToList(nodes) {
    return toList(nodes.map(function (node) {
        return nodeGenerator[node.type](node);
    }));
}
function generateNodesToStringIfNeeded(children) {
    const result = children.map(function (node) {
        return nodeGenerator[node.type](node);
    });
    if (result.length === 1) {
        return result[0];
    }
    // 字符串拼接涉及表达式的优先级问题，改成 array.join 有利于一致性
    if (last(stringStack)) {
        return toOperator(toList(result), toCall('join', [
            toPrimitive(EMPTY_STRING)
        ]));
    }
    return toList(result);
}
function addDynamicChildVnode(node, isTextVnode) {
    if (isTextVnode) {
        return toCall(ADD_TEXT_VNODE, [
            toRaw(ARG_CHILDREN),
            node,
        ]);
    }
    return toPush(ARG_CHILDREN, node);
}
function addComponentVnode(node) {
    return toPush(ARG_COMPONENTS, node);
}
function generateCommentVnode() {
    const result = toMap({
        context: toRaw(ARG_INSTANCE),
        isComment: toPrimitive(TRUE$1),
        text: toPrimitive(EMPTY_STRING),
    });
    return last(dynamicChildrenStack)
        ? addDynamicChildVnode(result)
        : result;
}
function generateTextVnode(text) {
    const result = toMap({
        context: toRaw(ARG_INSTANCE),
        isText: toPrimitive(TRUE$1),
        text,
    });
    return last(dynamicChildrenStack)
        ? addDynamicChildVnode(result, TRUE$1)
        : result;
}
function generateComponentSlots(children) {
    const result = toMap(), slots = {}, addSlot = function (name, nodes) {
        if (!falsy$2(nodes)) {
            name = SLOT_DATA_PREFIX + name;
            push(slots[name] || (slots[name] = []), nodes);
        }
    };
    each$2(children, function (child) {
        // 找到具名 slot
        if (child.type === ELEMENT) {
            const element = child;
            if (element.slot) {
                addSlot(element.slot, element.tag === RAW_TEMPLATE
                    ? element.children
                    : [element]);
                return;
            }
        }
        // 匿名 slot，名称统一为 children
        // 这个步骤不能放在 compiler，因为除了 element，还会有其他节点，比如文本节点
        addSlot(SLOT_NAME_DEFAULT, [child]);
    });
    each(slots, function (children, name) {
        result.set(name, toAnonymousFunction([
            toRaw(ARG_CHILDREN),
            toRaw(ARG_COMPONENTS)
        ], generateNodesToList(children)));
    });
    return result.isNotEmpty()
        ? result
        : toPrimitive(UNDEFINED$1);
}
function parseAttrs(attrs, isComponent) {
    let nativeAttributeList = [], nativePropertyList = [], propertyList = [], lazyList = [], transition = UNDEFINED$1, model = UNDEFINED$1, 
    // 最后收集事件指令、自定义指令、动态属性
    eventList = [], customDirectiveList = [], otherList = [];
    each$2(attrs, function (attr) {
        if (attr.type === ATTRIBUTE) {
            const attributeNode = attr;
            if (isComponent) {
                push(propertyList, attributeNode);
            }
            else {
                push(nativeAttributeList, attributeNode);
            }
        }
        else if (attr.type === PROPERTY) {
            const propertyNode = attr;
            push(nativePropertyList, propertyNode);
        }
        else if (attr.type === DIRECTIVE) {
            const directiveNode = attr;
            switch (directiveNode.ns) {
                case DIRECTIVE_LAZY:
                    push(lazyList, directiveNode);
                    break;
                case DIRECTIVE_TRANSITION:
                    transition = directiveNode;
                    break;
                case DIRECTIVE_MODEL:
                    model = directiveNode;
                    break;
                case DIRECTIVE_EVENT:
                    push(eventList, directiveNode);
                    break;
                default:
                    push(customDirectiveList, directiveNode);
            }
        }
        else {
            push(otherList, attr);
        }
    });
    return {
        nativeAttributeList,
        nativePropertyList,
        propertyList,
        lazyList,
        transition: transition,
        model: model,
        eventList,
        customDirectiveList,
        otherList,
    };
}
function sortAttrs(attrs, isComponent) {
    const { nativeAttributeList, nativePropertyList, propertyList, lazyList, transition, model, eventList, customDirectiveList, otherList, } = parseAttrs(attrs, isComponent);
    const result = [];
    push(result, nativeAttributeList);
    push(result, nativePropertyList);
    push(result, propertyList);
    push(result, lazyList);
    if (transition) {
        push(result, transition);
    }
    if (model) {
        push(result, model);
    }
    push(result, eventList);
    push(result, customDirectiveList);
    push(result, otherList);
    return result;
}
nodeGenerator[ELEMENT] = function (node) {
    let { tag, dynamicTag, isComponent, ref, key, html, text, attrs, children } = node, data = toMap(), outputAttrs = toPrimitive(UNDEFINED$1), outputChildren = toPrimitive(UNDEFINED$1), outputSlots = toPrimitive(UNDEFINED$1);
    if (tag === RAW_SLOT) {
        // slot 不可能有 html、text 属性
        // 因此 slot 的子节点只存在于 children 中
        const args = [
            toPrimitive(SLOT_DATA_PREFIX + node.name),
            toRaw(ARG_CHILDREN),
        ];
        if (children) {
            push(args, toAnonymousFunction(UNDEFINED$1, generateNodesToList(children)));
        }
        return toCall(RENDER_SLOT, args);
    }
    data.set('context', toRaw(ARG_INSTANCE));
    // 如果是动态组件，tag 会是一个标识符表达式
    data.set('tag', dynamicTag
        ? generateExpression(dynamicTag)
        : toPrimitive(tag));
    // 先序列化 children，再序列化 attrs，原因需要举两个例子：
    // 例子1：
    // <div on-click="output(this)"></div> 如果 this 序列化成 $scope，如果外部修改了 this，因为模板没有计入此依赖，不会刷新，因此 item 是旧的
    // 这个例子要求即使是动态执行的代码，也不能简单的直接序列化成 $scope
    // 例子2：
    // <div on-click="output(this)">{{this}}</div>，如果第一个 this 转成 $scope，第二个正常读取数据，这样肯定没问题
    // 但问题是，你不知道有没有第二个 this，因此这里反过来，先序列化非动态部分，即 children，再序列化可能动态的部分，即 attrs
    // 这样序列化动态部分的时候，就知道是否可以转成 $scope
    // 后来发现，即使这样实现也不行，因为模板里存在各种可能的 if 或三元运算，导致依赖的捕捉充满不确定，因此这里我们不再考虑把 this 转成 $scope
    push(vnodeStack, TRUE$1);
    push(attributeStack, FALSE$1);
    push(componentStack, isComponent);
    if (children) {
        if (isComponent) {
            outputSlots = generateComponentSlots(children);
        }
        else {
            let isDynamic = FALSE$1;
            each$2(children, function (node) {
                if (!node.isStatic) {
                    isDynamic = TRUE$1;
                    return FALSE$1;
                }
            });
            push(dynamicChildrenStack, isDynamic);
            if (isDynamic) {
                outputChildren = toAnonymousFunction([
                    toRaw(ARG_CHILDREN)
                ], generateNodesToTuple(children));
            }
            else {
                data.set(CHILDREN, generateNodesToList(children));
            }
            pop(dynamicChildrenStack);
        }
    }
    // 开始序列化 attrs，原则也是先序列化非动态部分，再序列化动态部分，即指令留在最后序列化
    vnodeStack[vnodeStack.length - 1] = FALSE$1;
    attributeStack[attributeStack.length - 1] = TRUE$1;
    // 在 vnodeStack 为 false 时取值
    if (ref) {
        data.set('ref', generateAttributeValue(ref.value, ref.expr, ref.children));
    }
    if (key) {
        data.set('key', generateAttributeValue(key.value, key.expr, key.children));
    }
    if (html) {
        data.set('html', string$1(html)
            ? toPrimitive(html)
            : toCall(TO_STRING, [
                generateExpression(html)
            ]));
    }
    if (text) {
        data.set('text', string$1(text)
            ? toPrimitive(text)
            : toCall(TO_STRING, [
                generateExpression(text)
            ]));
    }
    if (attrs) {
        const { nativeAttributeList, nativePropertyList, propertyList, lazyList, transition, model, eventList, customDirectiveList, otherList, } = parseAttrs(attrs, isComponent);
        if (nativeAttributeList.length) {
            const nativeAttributes = toMap();
            each$2(nativeAttributeList, function (node) {
                nativeAttributes.set(node.name, generateAttributeValue(node.value, node.expr, node.children));
            });
            data.set(NATIVE_ATTRIBUTES, nativeAttributes);
        }
        if (nativePropertyList.length) {
            const nativeProperties = toMap();
            each$2(nativePropertyList, function (node) {
                nativeProperties.set(node.name, generateAttributeValue(node.value, node.expr, node.children));
            });
            data.set(NATIVE_PROPERTIES, nativeProperties);
        }
        if (propertyList.length) {
            const properties = toMap();
            each$2(propertyList, function (node) {
                properties.set(node.name, generateAttributeValue(node.value, node.expr, node.children));
            });
            data.set(PROPERTIES, properties);
        }
        if (lazyList.length) {
            const lazy = toMap();
            each$2(lazyList, function (node) {
                lazy.set(node.name, getLazyValue(node));
            });
            data.set(LAZY, lazy);
        }
        if (transition) {
            data.set(TRANSITION, toCall(RENDER_TRANSITION, [
                getTransitionValue(transition)
            ]));
        }
        if (model) {
            data.set(MODEL, getModelValue(model));
        }
        if (eventList.length) {
            const events = toMap();
            each$2(eventList, function (node) {
                const info = getEventInfo(node);
                events.set(getDirectiveKey(node), toCall(info.name, info.args));
            });
            data.set(EVENTS, events);
        }
        if (customDirectiveList.length) {
            const directives = toMap();
            each$2(customDirectiveList, function (node) {
                directives.set(getDirectiveKey(node), toCall(RENDER_DIRECTIVE, getDirectiveArgs(node)));
            });
            data.set(DIRECTIVES, directives);
        }
        if (otherList.length) {
            outputAttrs = toAnonymousFunction([
                toRaw(ARG_VNODE)
            ], generateNodesToTuple(otherList));
        }
    }
    pop(vnodeStack);
    pop(attributeStack);
    pop(componentStack);
    if (isComponent) {
        data.set('isComponent', toPrimitive(TRUE$1));
    }
    if (node.isStatic) {
        data.set('isStatic', toPrimitive(TRUE$1));
    }
    if (node.isOption) {
        data.set('isOption', toPrimitive(TRUE$1));
    }
    if (node.isStyle) {
        data.set('isStyle', toPrimitive(TRUE$1));
    }
    if (node.isSvg) {
        data.set('isSvg', toPrimitive(TRUE$1));
    }
    let result;
    if (isComponent) {
        result = toCall(RENDER_COMPONENT_VNODE, [
            data,
            outputAttrs,
            outputSlots
        ]);
        result = addComponentVnode(result);
    }
    else {
        result = toCall(RENDER_ELEMENT_VNODE, [
            data,
            outputAttrs,
            outputChildren,
        ]);
    }
    return last(dynamicChildrenStack)
        ? addDynamicChildVnode(result)
        : result;
};
nodeGenerator[ATTRIBUTE] = function (node) {
    return toCall(ADD_ATTRIBUTE, [
        toRaw(ARG_VNODE),
        toPrimitive(last(componentStack)
            ? PROPERTIES
            : NATIVE_ATTRIBUTES),
        generateAttributeValue(node.value, node.expr, node.children),
        toPrimitive(node.name),
    ]);
};
nodeGenerator[PROPERTY] = function (node) {
    return toCall(ADD_ATTRIBUTE, [
        toRaw(ARG_VNODE),
        toPrimitive(NATIVE_PROPERTIES),
        generateAttributeValue(node.value, node.expr, node.children),
        toPrimitive(node.name),
    ]);
};
function getLazyValue(node) {
    return toPrimitive(node.value);
}
function getTransitionValue(node) {
    return toPrimitive(node.value);
}
function getModelValue(node) {
    return toCall(RENDER_MODEL, [
        generateExpressionHolder(node.expr)
    ]);
}
function addEventBooleanInfo(args, node) {
    // isComponent
    push(args, toPrimitive(UNDEFINED$1));
    // isNative
    push(args, toPrimitive(UNDEFINED$1));
    if (last(componentStack)) {
        if (node.modifier === MODIFER_NATIVE) {
            // isNative
            args[args.length - 1] = toPrimitive(TRUE$1);
        }
        else {
            // isComponent
            args[args.length - 2] = toPrimitive(TRUE$1);
        }
    }
}
function getEventInfo(node) {
    const args = [];
    // key
    push(args, toPrimitive(getDirectiveKey(node)));
    // value
    push(args, toPrimitive(node.value));
    // from
    push(args, toPrimitive(node.name));
    // fromNs
    push(args, 
    // 组件事件要用 component.on(type, options) 进行监听
    // 为了保证 options.ns 是字符串类型，这里需确保 fromNs 是字符串
    toPrimitive(node.modifier || EMPTY_STRING));
    // 事件的 expr 必须是表达式
    const expr = node.expr, { raw } = expr;
    if (expr.type === CALL) {
        const callNode = expr;
        // compiler 保证了函数调用的 name 是标识符
        // method
        push(args, toPrimitive(callNode.name.name));
        // 为了实现运行时动态收集参数，这里序列化成函数
        if (!falsy$2(callNode.args)) {
            // runtime
            push(args, toMap({
                args: toAnonymousFunction([
                    toRaw(ARG_STACK),
                    toRaw(ARG_MAGIC_VAR_EVENT),
                    toRaw(ARG_MAGIC_VAR_DATA),
                ], UNDEFINED$1, toList(callNode.args.map(generateExpressionArg)))
            }));
        }
        else {
            // runtime
            push(args, toPrimitive(UNDEFINED$1));
        }
        addEventBooleanInfo(args, node);
        return {
            name: RENDER_EVENT_METHOD,
            args,
        };
    }
    const parts = raw.split(RAW_DOT);
    // to
    push(args, toPrimitive(parts[0]));
    // toNs
    push(args, toPrimitive(parts[1]));
    addEventBooleanInfo(args, node);
    return {
        name: RENDER_EVENT_NAME,
        args,
    };
}
function getDirectiveKey(node) {
    return join(node.name, node.modifier || EMPTY_STRING);
}
function getDirectiveArgs(node) {
    const args = [];
    // key
    push(args, toPrimitive(getDirectiveKey(node)));
    // name
    push(args, toPrimitive(node.name));
    // modifier
    push(args, toPrimitive(node.modifier));
    // value
    push(args, toPrimitive(node.value));
    // 尽可能把表达式编译成函数，这样对外界最友好
    //
    // 众所周知，事件指令会编译成函数，对于自定义指令来说，也要尽可能编译成函数
    //
    // 比如 o-tap="method()" 或 o-log="{'id': '11'}"
    // 前者会编译成 handler（调用方法），后者会编译成 getter（取值）
    const { expr } = node;
    if (expr) {
        // 如果表达式明确是在调用方法，则序列化成 method + args 的形式
        if (expr.type === CALL) {
            const callNode = expr;
            // 为了实现运行时动态收集参数，这里序列化成函数
            if (!falsy$2(callNode.args)) {
                // runtime
                push(args, toMap({
                    args: toAnonymousFunction([
                        toRaw(ARG_STACK),
                    ], UNDEFINED$1, toList(callNode.args.map(generateExpressionArg)))
                }));
            }
            else {
                // runtime
                push(args, toPrimitive(UNDEFINED$1));
            }
            // compiler 保证了函数调用的 name 是标识符
            // method
            push(args, toPrimitive(callNode.name.name));
        }
        else {
            // 取值函数
            // getter 函数在触发事件时调用，调用时会传入它的作用域，因此这里要加一个参数
            if (expr.type !== LITERAL) {
                // runtime
                push(args, toMap({
                    expr: toAnonymousFunction([
                        toRaw(ARG_STACK)
                    ], UNDEFINED$1, generateExpressionArg(expr))
                }));
            }
        }
    }
    return args;
}
nodeGenerator[DIRECTIVE] = function (node) {
    switch (node.ns) {
        case DIRECTIVE_LAZY:
            return toCall(ADD_ATTRIBUTE, [
                toRaw(ARG_VNODE),
                toPrimitive(LAZY),
                getLazyValue(node),
                toPrimitive(node.name),
            ]);
        // <div transition="name">
        case DIRECTIVE_TRANSITION:
            return toCall(ADD_ATTRIBUTE, [
                toRaw(ARG_VNODE),
                toPrimitive(TRANSITION),
                getTransitionValue(node),
            ]);
        // <input model="id">
        case DIRECTIVE_MODEL:
            return toCall(ADD_ATTRIBUTE, [
                toRaw(ARG_VNODE),
                toPrimitive(MODEL),
                getModelValue(node),
            ]);
        // <div on-click="name">
        case DIRECTIVE_EVENT:
            const info = getEventInfo(node);
            return toCall(ADD_ATTRIBUTE, [
                toRaw(ARG_VNODE),
                toPrimitive(EVENTS),
                toCall(info.name, info.args),
                toPrimitive(getDirectiveKey(node)),
            ]);
        default:
            return toCall(ADD_ATTRIBUTE, [
                toRaw(ARG_VNODE),
                toPrimitive(DIRECTIVES),
                toCall(RENDER_DIRECTIVE, getDirectiveArgs(node)),
                toPrimitive(getDirectiveKey(node)),
            ]);
    }
};
nodeGenerator[SPREAD] = function (node) {
    return toCall(RENDER_SPREAD, [
        toRaw(ARG_VNODE),
        toPrimitive(PROPERTIES),
        generateExpression(node.expr)
    ]);
};
nodeGenerator[TEXT] = function (node) {
    const text = toPrimitive(node.text);
    return last(vnodeStack)
        ? generateTextVnode(text)
        : text;
};
nodeGenerator[EXPRESSION] = function (node) {
    const value = generateExpression(node.expr);
    return last(vnodeStack)
        ? generateTextVnode(toCall(TO_STRING, [
            value
        ]))
        : value;
};
nodeGenerator[IF] =
    nodeGenerator[ELSE_IF] = function (node) {
        let { children, next } = node, defaultValue = last(vnodeStack)
            ? generateCommentVnode()
            : toPrimitive(UNDEFINED$1), value;
        if (children) {
            if (last(attributeStack)) {
                children = sortAttrs(children, last(componentStack));
            }
            value = generateNodesToStringIfNeeded(children);
        }
        return toTernary(generateExpression(node.expr), value || defaultValue, next ? nodeGenerator[next.type](next) : defaultValue);
    };
nodeGenerator[ELSE] = function (node) {
    let { children } = node, defaultValue = last(vnodeStack)
        ? generateCommentVnode()
        : toPrimitive(UNDEFINED$1), value;
    if (children) {
        if (last(attributeStack)) {
            children = sortAttrs(children, last(componentStack));
        }
        value = generateNodesToStringIfNeeded(children);
    }
    return value || defaultValue;
};
nodeGenerator[EACH] = function (node) {
    const { index, from, to, equal, next } = node, isSpecial = to || from.type === ARRAY || from.type === OBJECT;
    const args = [
        toRaw(ARG_MAGIC_VAR_KEYPATH),
        toRaw(ARG_MAGIC_VAR_LENGTH),
        toRaw(ARG_MAGIC_VAR_SCOPE),
    ];
    if (index) {
        push(args, toRaw(index));
        push(magicVariables, index);
    }
    // 如果是特殊的 each，包括 遍历 range 和 遍历数组字面量和对象字面量
    // 在这种 each 中引用 this 无需追踪依赖，因此可直接认为 this 已用过，这样生成代码时，会直接引用局部变量，提高执行效率
    push(eachStack, isSpecial);
    // compiler 保证了 children 一定有值
    const renderChildren = toAnonymousFunction(args, UNDEFINED$1, generateNodesToList(node.children));
    if (index) {
        pop(magicVariables);
    }
    pop(eachStack);
    // compiler 保证了 children 一定有值
    const renderElse = next
        ? toAnonymousFunction(UNDEFINED$1, UNDEFINED$1, generateNodesToList(next.children))
        : toPrimitive(UNDEFINED$1);
    // 遍历区间
    if (to) {
        return toCall(RENDER_RANGE, [
            generateExpression(from),
            generateExpression(to),
            toPrimitive(equal),
            renderChildren,
            renderElse,
        ]);
    }
    // 遍历数组和对象
    return toCall(RENDER_EACH, [
        generateExpressionHolder(from),
        renderChildren,
        renderElse,
    ]);
};
nodeGenerator[PARTIAL] = function (node) {
    return toCall(DEFINE_PARTIAL, [
        toPrimitive(node.name),
        toAnonymousFunction([
            toRaw(ARG_MAGIC_VAR_KEYPATH),
            toRaw(ARG_CHILDREN),
            toRaw(ARG_COMPONENTS),
        ], UNDEFINED$1, generateNodesToList(node.children))
    ]);
};
nodeGenerator[IMPORT] = function (node) {
    return toCall(RENDER_PARTIAL, [
        toPrimitive(node.name),
        toRaw(ARG_MAGIC_VAR_KEYPATH),
        toRaw(ARG_CHILDREN),
        toRaw(ARG_COMPONENTS)
    ]);
};
function generate(node) {
    init();
    init$1();
    // 重新收集
    localVarId = 0;
    localVarMap = {};
    localVarCache = {};
    return generate$2([
        toRaw(ARG_INSTANCE),
        toRaw(RENDER_ELEMENT_VNODE),
        toRaw(RENDER_COMPONENT_VNODE),
        toRaw(ADD_ATTRIBUTE),
        toRaw(ADD_TEXT_VNODE),
        toRaw(RENDER_TRANSITION),
        toRaw(RENDER_MODEL),
        toRaw(RENDER_EVENT_METHOD),
        toRaw(RENDER_EVENT_NAME),
        toRaw(RENDER_DIRECTIVE),
        toRaw(RENDER_SPREAD),
        toRaw(RENDER_SLOT),
        toRaw(DEFINE_PARTIAL),
        toRaw(RENDER_PARTIAL),
        toRaw(RENDER_EACH),
        toRaw(RENDER_RANGE),
        toRaw(RENDER_EXPRESSION_IDENTIFIER),
        toRaw(RENDER_EXPRESSION_VALUE),
        toRaw(EXECUTE_FUNCTION),
        toRaw(TO_STRING),
        toRaw(ARG_MAGIC_VAR_KEYPATH),
        toRaw(ARG_CHILDREN),
        toRaw(ARG_COMPONENTS),
    ], localVarMap, nodeGenerator[node.type](node));
}

/**
 * 计算属性
 *
 * 可配置 cache、deps、get、set 等
 */
class Computed {
    constructor(keypath, sync, cache, deps, observer, getter, setter) {
        const instance = this;
        instance.keypath = keypath;
        instance.cache = cache;
        instance.deps = deps;
        instance.observer = observer;
        instance.getter = getter;
        instance.setter = setter;
        instance.watcherOptions = {
            sync,
            watcher: instance.watcher = function ($0, $1, $2) {
                // 计算属性的依赖变了会走进这里
                const oldValue = instance.value, newValue = instance.get(TRUE$1);
                if (newValue !== oldValue) {
                    observer.diff(keypath, newValue, oldValue);
                }
            }
        };
        // 如果 deps 是空数组，Observer 会传入 undefined
        // 因此这里直接判断即可
        if (deps) {
            instance.fixed = TRUE$1;
            for (let i = 0, length = deps.length; i < length; i++) {
                observer.watch(deps[i], instance.watcherOptions);
            }
        }
    }
    /**
     * 读取计算属性的值
     *
     * @param force 是否强制刷新缓存
     */
    get(force) {
        const instance = this, { getter, deps, observer, watcher, watcherOptions } = instance;
        // 禁用缓存
        if (!instance.cache) {
            instance.value = getter();
        }
        // 减少取值频率，尤其是处理复杂的计算规则
        else if (force || !has(instance, 'value')) {
            // 如果写死了依赖，则不需要收集依赖
            if (instance.fixed) {
                instance.value = getter();
            }
            // 自动收集依赖
            else {
                // 清空上次收集的依赖
                if (deps) {
                    for (let i = deps.length - 1; i >= 0; i--) {
                        observer.unwatch(deps[i], watcher);
                    }
                }
                // 惰性初始化
                instance.unique = createPureObject$1();
                // 开始收集新的依赖
                const lastComputed = Computed.current;
                Computed.current = instance;
                instance.value = getter();
                // 绑定新的依赖
                const newDeps = instance.unique.keys();
                for (let i = 0, length = newDeps.length; i < length; i++) {
                    observer.watch(newDeps[i], watcherOptions);
                }
                instance.deps = newDeps;
                // 取值完成，恢复原值
                Computed.current = lastComputed;
            }
        }
        return instance.value;
    }
    set(value) {
        const { setter } = this;
        if (setter) {
            setter(value);
        }
    }
    /**
     * 添加依赖
     *
     * 这里只是为了保证依赖唯一
     *
     * @param dep
     */
    add(dep) {
        this.unique.set(dep, TRUE$1);
    }
}

function readValue (source, keypath) {
    if (source == NULL$1 || keypath === EMPTY_STRING) {
        return source;
    }
    const result = get(source, keypath);
    if (result) {
        return result.value;
    }
}

/**
 * 对比新旧字符串
 *
 * @param newValue
 * @param oldValue
 * @param callback
 */
function diffString (newValue, oldValue, callback) {
    const newIsString = string$1(newValue), oldIsString = string$1(oldValue);
    if (newIsString || oldIsString) {
        callback('length', newIsString ? newValue.length : UNDEFINED$1, oldIsString ? oldValue.length : UNDEFINED$1);
        return TRUE$1;
    }
}

/**
 * 对比新旧数组
 *
 * @param newValue
 * @param oldValue
 * @param callback
 */
function diffArray (newValue, oldValue, callback) {
    const newIsArray = array$1(newValue), oldIsArray = array$1(oldValue);
    if (newIsArray || oldIsArray) {
        const newLength = newIsArray ? newValue.length : UNDEFINED$1, oldLength = oldIsArray ? oldValue.length : UNDEFINED$1;
        callback('length', newLength, oldLength);
        for (let i = 0, length = Math.max(newLength || 0, oldLength || 0); i < length; i++) {
            callback(
            // 把 number 转成 string
            EMPTY_STRING + i, newIsArray ? newValue[i] : UNDEFINED$1, oldIsArray ? oldValue[i] : UNDEFINED$1);
        }
        return TRUE$1;
    }
}

/**
 * 对比新旧对象
 *
 * @param newValue
 * @param oldValue
 * @param callback
 */
function diffObject (newValue, oldValue, callback) {
    const newIsObject = object$1(newValue), oldIsObject = object$1(oldValue);
    if (newIsObject || oldIsObject) {
        const diffed = createPureObject$1(), newObject = newIsObject ? newValue : EMPTY_OBJECT, oldObject = oldIsObject ? oldValue : EMPTY_OBJECT;
        if (newIsObject) {
            for (let key in newObject) {
                const value = newObject[key];
                if (value !== oldObject[key]) {
                    // 保证遍历 oldObject 时不会再次触发
                    diffed.set(key, TRUE$1);
                    callback(key, value, oldObject[key]);
                }
            }
        }
        if (oldIsObject) {
            for (let key in oldObject) {
                const value = oldObject[key];
                if (diffed.get(key) === UNDEFINED$1 && value !== newObject[key]) {
                    callback(key, newObject[key], value);
                }
            }
        }
    }
}

/**
 * 递归对比
 */
function diffRecursion(keypath, newValue, oldValue, fuzzyKeypaths, fuzzyKeypathLength, callback) {
    const diff = function (subKey, subNewValue, subOldValue) {
        if (subNewValue !== subOldValue) {
            const newKeypath = join(keypath, subKey);
            for (let i = 0; i < fuzzyKeypathLength; i++) {
                const fuzzyKeypath = fuzzyKeypaths[i];
                if (matchFuzzy(newKeypath, fuzzyKeypath) !== UNDEFINED$1) {
                    callback(fuzzyKeypath, newKeypath, subNewValue, subOldValue);
                }
            }
            diffRecursion(newKeypath, subNewValue, subOldValue, fuzzyKeypaths, fuzzyKeypathLength, callback);
        }
    };
    diffString(newValue, oldValue, diff)
        || diffArray(newValue, oldValue, diff)
        || diffObject(newValue, oldValue, diff);
}

function diffWatcher (keypath, newValue, oldValue, watcher, isRecursive, callback) {
    let fuzzyKeypaths;
    // 遍历监听的 keypath，如果未被监听，则无需触发任何事件
    for (const watchKeypath in watcher) {
        // 模糊监听，如 users.*.name
        if (isFuzzy(watchKeypath)) {
            // 如果当前修改的是 users.0 整个对象
            // users.0 和 users.*.name 无法匹配
            // 此时要知道设置 users.0 到底会不会改变 users.*.name 需要靠递归了
            // 如果匹配，则无需递归
            if (matchFuzzy(keypath, watchKeypath) !== UNDEFINED$1) {
                callback(watchKeypath, keypath, newValue, oldValue);
            }
            else if (isRecursive) {
                if (fuzzyKeypaths) {
                    fuzzyKeypaths.push(watchKeypath);
                }
                else {
                    fuzzyKeypaths = [watchKeypath];
                }
            }
        }
        // 不是模糊匹配，直接通过前缀匹配
        else {
            // 比如监听的是 users.0.name，此时修改 users.0，则直接读出子属性值，判断是否相等
            const length = match(watchKeypath, keypath);
            if (length >= 0) {
                const subKeypath = slice(watchKeypath, length), subNewValue = readValue(newValue, subKeypath), subOldValue = readValue(oldValue, subKeypath);
                if (subNewValue !== subOldValue) {
                    callback(watchKeypath, watchKeypath, subNewValue, subOldValue);
                }
            }
        }
    }
    // 存在模糊匹配的需求
    // 必须对数据进行递归
    // 性能确实会慢一些，但是很好用啊，几乎可以监听所有的数据
    if (fuzzyKeypaths) {
        diffRecursion(keypath, newValue, oldValue, fuzzyKeypaths, fuzzyKeypaths.length, callback);
    }
}

// 避免频繁创建对象
const optionsHolder = {
    watcher: EMPTY_FUNCTION,
};
/**
 * 格式化 watch options
 *
 * @param options
 */
function formatWatcherOptions (options, immediate) {
    const isWatcher = func(options);
    if (isWatcher) {
        optionsHolder.watcher = options;
        optionsHolder.immediate = immediate === TRUE$1;
        return optionsHolder;
    }
    return options;
}

/**
 * 观察者有两种观察模式：
 *
 * 1. 同步监听
 * 2. 异步监听
 *
 * 对于`计算属性`这种需要实时变化的对象，即它的依赖变了，它需要立即跟着变，否则会出现不一致的问题
 * 这种属于同步监听
 *
 * 对于外部调用 observer.watch('keypath', listener)，属于异步监听，它只关心是否变了，而不关心是否是立即触发的
 */
class Observer {
    constructor(data, context, nextTask) {
        const instance = this;
        instance.data = data || {};
        instance.context = context || instance;
        instance.nextTask = nextTask || new NextTask();
        instance.syncEmitter = new Emitter();
        instance.asyncEmitter = new Emitter();
        instance.asyncOldValues = {};
        instance.asyncKeypaths = {};
    }
    /**
     * 获取数据
     *
     * @param keypath
     * @param defaultValue
     * @param depIgnore
     * @return
     */
    get(keypath, defaultValue, depIgnore) {
        const instance = this, currentComputed = Computed.current, { data, computed } = instance;
        // 传入 '' 获取整个 data
        if (keypath === EMPTY_STRING) {
            return data;
        }
        // 调用 get 时，外面想要获取依赖必须设置是谁在收集依赖
        // 如果没设置，则跳过依赖收集
        if (currentComputed && !depIgnore) {
            currentComputed.add(keypath);
        }
        let result;
        if (computed) {
            result = get(computed, keypath);
        }
        if (!result) {
            result = get(data, keypath);
        }
        return result ? result.value : defaultValue;
    }
    /**
     * 更新数据
     *
     * @param keypath
     * @param value
     */
    set(keypath, value) {
        const instance = this, { data, computed } = instance, setValue = function (keypath, newValue) {
            const oldValue = instance.get(keypath);
            if (newValue === oldValue) {
                return;
            }
            let next;
            each$1(keypath, function (key, index, lastIndex) {
                if (index === 0) {
                    if (computed && computed[key]) {
                        if (lastIndex === 0) {
                            computed[key].set(newValue);
                        }
                        else {
                            // 这里 next 可能为空
                            next = computed[key].get();
                        }
                    }
                    else {
                        if (lastIndex === 0) {
                            data[key] = newValue;
                        }
                        else {
                            next = data[key] || (data[key] = {});
                        }
                    }
                    return;
                }
                if (next) {
                    if (index === lastIndex) {
                        next[key] = newValue;
                    }
                    else {
                        next = next[key] || (next[key] = {});
                    }
                }
            });
            instance.diff(keypath, newValue, oldValue);
        };
        if (string$1(keypath)) {
            setValue(keypath, value);
        }
        else if (object$1(keypath)) {
            for (let key in keypath) {
                setValue(key, keypath[key]);
            }
        }
    }
    /**
     * 同步调用的 diff，用于触发 syncEmitter，以及唤醒 asyncEmitter
     *
     * @param keypath
     * @param newValue
     * @param oldValue
     */
    diff(keypath, newValue, oldValue) {
        let instance = this, { syncEmitter, asyncEmitter, asyncOldValues, asyncKeypaths } = instance, 
        /**
         * 我们认为 $ 开头的变量是不可递归的
         * 比如浏览器中常见的 $0 表示当前选中元素
         * DOM 元素是不能递归的
         */
        isRecursive = codeAt(keypath) !== 36;
        diffWatcher(keypath, newValue, oldValue, syncEmitter.listeners, isRecursive, function (watchKeypath, keypath, newValue, oldValue) {
            syncEmitter.fire({
                type: watchKeypath,
                ns: EMPTY_STRING,
            }, [
                newValue,
                oldValue,
                keypath,
            ]);
        });
        /**
         * 此处有坑，举个例子
         *
         * observer.watch('a', function () {})
         *
         * observer.set('a', 1)
         *
         * observer.watch('a', function () {})
         *
         * 这里，第一个 watcher 应该触发，但第二个不应该，因为它绑定监听时，值已经是最新的了
         */
        diffWatcher(keypath, newValue, oldValue, asyncEmitter.listeners, isRecursive, function (watchKeypath, keypath, newValue, oldValue) {
            // 这里是为了解决上面说的坑
            const options = asyncEmitter.listeners[watchKeypath];
            for (let i = 0, length = options.length; i < length; i++) {
                options[i].count++;
            }
            if (!asyncKeypaths[keypath]) {
                asyncOldValues[keypath] = oldValue;
                asyncKeypaths[keypath] = {};
            }
            asyncKeypaths[keypath][watchKeypath] = TRUE$1;
            if (!instance.pending) {
                instance.pending = TRUE$1;
                instance.nextTask.append(function () {
                    if (instance.pending) {
                        instance.diffAsync();
                    }
                });
            }
        });
    }
    /**
     * 异步触发的 diff
     */
    diffAsync() {
        const instance = this, { asyncEmitter, asyncOldValues, asyncKeypaths } = instance;
        instance.pending = UNDEFINED$1;
        instance.asyncOldValues = {};
        instance.asyncKeypaths = {};
        for (let keypath in asyncOldValues) {
            const args = [
                instance.get(keypath),
                asyncOldValues[keypath],
                keypath,
            ], keypaths = asyncKeypaths[keypath], hasChange = args[0] !== args[1], filterWatcher = function (event, args, options) {
                // 前面递增了 count
                // 这里要递减 count
                // count > 0 表示前面标记了该监听器需要响应此次变化
                if (options.count) {
                    // 采用计数器的原因是，同一个 options 可能执行多次
                    // 比如监听 user.*，如果同批次修改了 user.name 和 user.age
                    // 这个监听器会调用多次，如果第一次执行就把 count 干掉了，第二次就无法执行了
                    options.count--;
                    // 新旧值不相等才能触发监听器
                    return hasChange;
                }
            };
            for (let watchKeypath in keypaths) {
                asyncEmitter.fire({
                    type: watchKeypath,
                    ns: EMPTY_STRING,
                }, args, filterWatcher);
            }
        }
    }
    /**
     * 添加计算属性
     *
     * @param keypath
     * @param computed
     */
    addComputed(keypath, options) {
        let instance = this, context = instance.context, cache = TRUE$1, sync = TRUE$1, deps, getter, setter;
        // 这里用 bind 方法转换一下调用的 this
        // 还有一个好处，它比 call(context) 速度稍快一些
        if (func(options)) {
            getter = options.bind(context);
        }
        else if (object$1(options)) {
            const computedOptions = options;
            if (boolean(computedOptions.cache)) {
                cache = computedOptions.cache;
            }
            if (boolean(computedOptions.sync)) {
                sync = computedOptions.sync;
            }
            // 传入空数组等同于没传
            if (!falsy$2(computedOptions.deps)) {
                deps = computedOptions.deps;
            }
            if (func(computedOptions.get)) {
                getter = computedOptions.get.bind(context);
            }
            if (func(computedOptions.set)) {
                setter = computedOptions.set.bind(context);
            }
        }
        if (getter) {
            const computed = new Computed(keypath, sync, cache, deps, instance, getter, setter);
            if (!instance.computed) {
                instance.computed = {};
            }
            instance.computed[keypath] = computed;
            return computed;
        }
    }
    /**
     * 移除计算属性
     *
     * @param keypath
     */
    removeComputed(keypath) {
        const instance = this, { computed } = instance;
        if (computed && has(computed, keypath)) {
            delete computed[keypath];
        }
    }
    /**
     * 监听数据变化
     *
     * @param keypath
     * @param watcher
     * @param immediate
     */
    watch(keypath, watcher, immediate) {
        const instance = this, { context, syncEmitter, asyncEmitter } = instance, addWatcher = function (keypath, options) {
            const emitter = options.sync ? syncEmitter : asyncEmitter, 
            // formatWatcherOptions 保证了 options.watcher 一定存在
            listener = {
                ns: EMPTY_STRING,
                listener: options.watcher,
                ctx: context,
                count: 0,
            };
            if (options.once) {
                listener.max = 1;
            }
            emitter.on(keypath, listener);
            if (options.immediate) {
                execute(options.watcher, context, [
                    instance.get(keypath),
                    UNDEFINED$1,
                    keypath
                ]);
            }
        };
        if (string$1(keypath)) {
            addWatcher(keypath, formatWatcherOptions(watcher, immediate));
        }
        else {
            for (let key in keypath) {
                addWatcher(key, formatWatcherOptions(keypath[key]));
            }
        }
    }
    /**
     * 取消监听数据变化
     *
     * @param keypath
     * @param watcher
     */
    unwatch(keypath, watcher) {
        const filter = {
            ns: EMPTY_STRING,
            listener: watcher,
        };
        this.syncEmitter.off(keypath, filter);
        this.asyncEmitter.off(keypath, filter);
    }
    /**
     * 取反 keypath 对应的数据
     *
     * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
     *
     * @param keypath
     * @return 取反后的布尔值
     */
    toggle(keypath) {
        const value = !this.get(keypath);
        this.set(keypath, value);
        return value;
    }
    /**
     * 递增 keypath 对应的数据
     *
     * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
     *
     * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
     * @param step 步进值，默认是 1
     * @param max 可以递增到的最大值，默认不限制
     */
    increase(keypath, step, max) {
        const value = toNumber(this.get(keypath), 0) + (step || 1);
        if (!number(max) || value <= max) {
            this.set(keypath, value);
            return value;
        }
    }
    /**
     * 递减 keypath 对应的数据
     *
     * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
     *
     * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
     * @param step 步进值，默认是 1
     * @param min 可以递减到的最小值，默认不限制
     */
    decrease(keypath, step, min) {
        const value = toNumber(this.get(keypath), 0) - (step || 1);
        if (!number(min) || value >= min) {
            this.set(keypath, value);
            return value;
        }
    }
    /**
     * 在数组指定位置插入元素
     *
     * @param keypath
     * @param item
     * @param index
     */
    insert(keypath, item, index) {
        let list = this.get(keypath);
        list = array$1(list) ? list.slice() : [];
        const { length } = list;
        if (index === TRUE$1 || index === length) {
            list.push(item);
        }
        else if (index === FALSE$1 || index === 0) {
            list.unshift(item);
        }
        else if (index > 0 && index < length) {
            list.splice(index, 0, item);
        }
        else {
            return;
        }
        this.set(keypath, list);
        return TRUE$1;
    }
    /**
     * 在数组尾部添加元素
     *
     * @param keypath
     * @param item
     */
    append(keypath, item) {
        return this.insert(keypath, item, TRUE$1);
    }
    /**
     * 在数组首部添加元素
     *
     * @param keypath
     * @param item
     */
    prepend(keypath, item) {
        return this.insert(keypath, item, FALSE$1);
    }
    /**
     * 通过索引移除数组中的元素
     *
     * @param keypath
     * @param index
     */
    removeAt(keypath, index) {
        let list = this.get(keypath);
        if (array$1(list)
            && index >= 0
            && index < list.length) {
            list = list.slice();
            list.splice(index, 1);
            this.set(keypath, list);
            return TRUE$1;
        }
    }
    /**
     * 直接移除数组中的元素
     *
     * @param keypath
     * @param item
     */
    remove(keypath, item) {
        let list = this.get(keypath);
        if (array$1(list)) {
            list = list.slice();
            if (remove(list, item)) {
                this.set(keypath, list);
                return TRUE$1;
            }
        }
    }
    /**
     * 拷贝任意数据，支持深拷贝
     *
     * @param data
     * @param deep
     */
    copy(data, deep) {
        return copy(data, deep);
    }
    /**
     * 销毁
     */
    destroy() {
        const instance = this;
        instance.syncEmitter.off();
        instance.asyncEmitter.off();
        instance.nextTask.clear();
        clear(instance);
    }
}

createOneKeyCache(function (template) {
    const nodes = compile(template);
    return generate(nodes[0]);
});
class Yox {
    constructor(options) {
        const instance = this, $options = options || EMPTY_OBJECT;
        // 为了冒泡 HOOK_BEFORE_CREATE 事件，必须第一时间创建 emitter
        // 监听各种事件
        // 支持命名空间
        instance.$emitter = new Emitter(TRUE$1);
        if ($options.events) {
            instance.on($options.events);
        }
        let { data, props, vnode, propTypes, computed, methods, watchers, extensions, } = $options;
        instance.$options = $options;
        if (extensions) {
            extend(instance, extensions);
        }
        // 数据源，默认值仅在创建组件时启用
        const source = props ? copy(props) : {};
        // 先放 props
        // 当 data 是函数时，可以通过 this.get() 获取到外部数据
        const observer = instance.$observer = new Observer(source, instance, instance.$nextTask = new NextTask({
            afterTask() {
                if (instance.$isDirty) {
                    instance.$isDirty = UNDEFINED$1;
                    instance.update(instance.render(), instance.$vnode);
                }
            }
        }));
        if (computed) {
            each(computed, function (options, keypath) {
                observer.addComputed(keypath, options);
            });
        }
        const extend$1 = func(data) ? execute(data, instance, options) : data;
        if (object$1(extend$1)) {
            each(extend$1, function (value, key) {
                source[key] = value;
            });
        }
        if (methods) {
            each(methods, function (method, name) {
                instance[name] = method;
            });
        }
        if (watchers) {
            observer.watch(watchers);
        }
    }
    /**
     * 定义组件对象
     */
    static define(options) {
        return options;
    }
    /**
     * 安装插件
     *
     * 插件必须暴露 install 方法
     */
    static use(plugin) {
        plugin.install(Yox);
    }
    /**
     * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
     */
    static nextTick(task, context) {
        NextTask.shared().append(task, context);
    }
    /**
     * 编译模板，暴露出来是为了打包阶段的模板预编译
     */
    static compile(template, stringify) {
        {
            return template;
        }
    }
    /**
     * 注册全局指令
     */
    static directive(name, directive) {
    }
    /**
     * 注册全局过渡动画
     */
    static transition(name, transition) {
    }
    /**
     * 注册全局组件
     */
    static component(name, component) {
    }
    /**
     * 注册全局子模板
     */
    static partial(name, partial) {
    }
    /**
     * 注册全局过滤器
     */
    static filter(name, filter) {
    }
    /**
     * 取值
     */
    get(keypath, defaultValue) {
        return this.$observer.get(keypath, defaultValue);
    }
    /**
     * 设值
     */
    set(keypath, value) {
        // 组件经常有各种异步改值，为了避免组件销毁后依然调用 set
        // 这里判断一下，至于其他方法的异步调用就算了，业务自己控制吧
        const { $observer } = this;
        if ($observer) {
            $observer.set(keypath, value);
        }
    }
    /**
     * 监听事件，支持链式调用
     */
    on(type, listener) {
        addEvents(this, type, listener);
        return this;
    }
    /**
     * 监听一次事件，支持链式调用
     */
    once(type, listener) {
        addEvents(this, type, listener, TRUE$1);
        return this;
    }
    /**
     * 取消监听事件，支持链式调用
     */
    off(type, listener) {
        this.$emitter.off(type, listener);
        return this;
    }
    /**
     * 发射事件
     */
    fire(type, data, downward) {
        // 外部为了使用方便，fire(type) 或 fire(type, data) 就行了
        // 内部为了保持格式统一
        // 需要转成 Event，这样还能知道 target 是哪个组件
        const instance = this, { $emitter, $parent, $children } = instance;
        // 生成事件对象
        let event;
        if (CustomEvent.is(type)) {
            event = type;
        }
        else if (string$1(type)) {
            event = new CustomEvent(type);
        }
        else {
            const emitterEvent = type;
            event = new CustomEvent(emitterEvent.type);
            event.ns = emitterEvent.ns;
        }
        // 先解析出命名空间，避免每次 fire 都要解析
        if (event.ns === UNDEFINED$1) {
            const emitterEvent = $emitter.toEvent(event.type);
            event.type = emitterEvent.type;
            event.ns = emitterEvent.ns;
        }
        // 告诉外部是谁发出的事件
        if (!event.target) {
            event.target = instance;
        }
        // 事件参数列表
        let args = [event], 
        // 事件是否正常结束（未被停止冒泡）
        isComplete;
        // 比如 fire('name', true) 直接向下发事件
        if (object$1(data)) {
            push(args, data);
        }
        else if (data === TRUE$1) {
            downward = TRUE$1;
        }
        // 向上发事件会经过自己
        // 如果向下发事件再经过自己，就产生了一次重叠
        // 这是没有必要的，而且会导致向下发事件时，外部能接收到该事件，但我们的本意只是想让子组件接收到事件
        isComplete = downward && event.target === instance
            ? TRUE$1
            : $emitter.fire(event, args);
        if (isComplete) {
            if (downward) {
                if ($children) {
                    event.phase = CustomEvent.PHASE_DOWNWARD;
                    each$2($children, function (child) {
                        return isComplete = child.fire(event, data, TRUE$1);
                    });
                }
            }
            else if ($parent) {
                event.phase = CustomEvent.PHASE_UPWARD;
                isComplete = $parent.fire(event, data);
            }
        }
        return isComplete;
    }
    /**
     * 监听数据变化，支持链式调用
     */
    watch(keypath, watcher, immediate) {
        this.$observer.watch(keypath, watcher, immediate);
        return this;
    }
    /**
     * 取消监听数据变化，支持链式调用
     */
    unwatch(keypath, watcher) {
        this.$observer.unwatch(keypath, watcher);
        return this;
    }
    /**
     * 加载组件，组件可以是同步或异步，最后会调用 callback
     *
     * @param name 组件名称
     * @param callback 组件加载成功后的回调
     */
    loadComponent(name, callback) {
    }
    /**
     * 创建子组件
     *
     * @param options 组件配置
     * @param vnode 虚拟节点
     */
    createComponent(options, vnode) {
        {
            return this;
        }
    }
    /**
     * 注册当前组件级别的指令
     */
    directive(name, directive) {
    }
    /**
     * 注册当前组件级别的过渡动画
     */
    transition(name, transition) {
    }
    /**
     * 注册当前组件级别的组件
     */
    component(name, component) {
    }
    /**
     * 注册当前组件级别的子模板
     */
    partial(name, partial) {
    }
    /**
     * 注册当前组件级别的过滤器
     */
    filter(name, filter) {
    }
    /**
     * 对于某些特殊场景，修改了数据，但是模板的依赖中并没有这一项
     * 而你非常确定需要更新模板，强制刷新正是你需要的
     */
    forceUpdate(props) {
    }
    /**
     * 把模板抽象语法树渲染成 virtual dom
     */
    render() {
    }
    /**
     * 更新 virtual dom
     *
     * @param vnode
     * @param oldVnode
     */
    update(vnode, oldVnode) {
    }
    /**
     * 校验组件参数
     *
     * @param props
     */
    checkProp(key, value) {
    }
    /**
     * 销毁组件
     */
    destroy() {
        const instance = this, { $parent, $options, $emitter, $observer } = instance;
        $observer.destroy();
        // 发完 after destroy 事件再解绑所有事件
        $emitter.off();
        clear(instance);
    }
    /**
     * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
     */
    nextTick(task) {
        this.$nextTask.append(task, this);
    }
    /**
     * 取反 keypath 对应的数据
     *
     * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
     */
    toggle(keypath) {
        return this.$observer.toggle(keypath);
    }
    /**
     * 递增 keypath 对应的数据
     *
     * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
     *
     * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
     * @param step 步进值，默认是 1
     * @param max 可以递增到的最大值，默认不限制
     */
    increase(keypath, step, max) {
        return this.$observer.increase(keypath, step, max);
    }
    /**
     * 递减 keypath 对应的数据
     *
     * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
     *
     * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
     * @param step 步进值，默认是 1
     * @param min 可以递减到的最小值，默认不限制
     */
    decrease(keypath, step, min) {
        return this.$observer.decrease(keypath, step, min);
    }
    /**
     * 在数组指定位置插入元素
     *
     * @param keypath
     * @param item
     * @param index
     */
    insert(keypath, item, index) {
        return this.$observer.insert(keypath, item, index);
    }
    /**
     * 在数组尾部添加元素
     *
     * @param keypath
     * @param item
     */
    append(keypath, item) {
        return this.$observer.append(keypath, item);
    }
    /**
     * 在数组首部添加元素
     *
     * @param keypath
     * @param item
     */
    prepend(keypath, item) {
        return this.$observer.prepend(keypath, item);
    }
    /**
     * 通过索引移除数组中的元素
     *
     * @param keypath
     * @param index
     */
    removeAt(keypath, index) {
        return this.$observer.removeAt(keypath, index);
    }
    /**
     * 直接移除数组中的元素
     *
     * @param keypath
     * @param item
     */
    remove(keypath, item) {
        return this.$observer.remove(keypath, item);
    }
    /**
     * 拷贝任意数据，支持深拷贝
     *
     * @param data
     * @param deep
     */
    copy(data, deep) {
        return this.$observer.copy(data, deep);
    }
}
/**
 * core 版本
 */
Yox.version = "1.0.0-alpha.212";
/**
 * 方便外部共用的通用逻辑，特别是写插件，减少重复代码
 */
Yox.is = is;
Yox.array = array;
Yox.object = object;
Yox.string = string;
Yox.logger = logger;
Yox.Event = CustomEvent;
Yox.Emitter = Emitter;
/**
 * 外部可配置的对象
 */
Yox.config = PUBLIC_CONFIG;
function addEvent(instance, type, listener, once) {
    const { $emitter } = instance, filter = $emitter.toFilter(type, listener);
    const options = {
        listener: filter.listener,
        ns: filter.ns,
        ctx: instance,
    };
    if (once) {
        options.max = 1;
    }
    $emitter.on(filter.type, options);
}
function addEvents(instance, type, listener, once) {
    if (string$1(type)) {
        addEvent(instance, type, listener, once);
    }
    else {
        each(type, function (value, key) {
            addEvent(instance, key, value, once);
        });
    }
}

export default Yox;
//# sourceMappingURL=yox.esm.js.map
