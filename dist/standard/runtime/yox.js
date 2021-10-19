/**
 * yox.js v1.0.0-alpha.233
 * (c) 2017-2021 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Yox = factory());
}(this, (function () { 'use strict';

  var SLOT_DATA_PREFIX = '$slot_';
  var VNODE_TYPE_TEXT = 1;
  var VNODE_TYPE_COMMENT = 2;
  var VNODE_TYPE_ELEMENT = 3;
  var DIRECTIVE_MODEL = 'model';
  var DIRECTIVE_CUSTOM = 'o';
  var MODEL_PROP_DEFAULT = 'value';
  var HOOK_BEFORE_CREATE = 'beforeCreate';
  var HOOK_AFTER_CREATE = 'afterCreate';
  var HOOK_BEFORE_MOUNT = 'beforeMount';
  var HOOK_AFTER_MOUNT = 'afterMount';
  var HOOK_BEFORE_UPDATE = 'beforeUpdate';
  var HOOK_AFTER_UPDATE = 'afterUpdate';
  var HOOK_BEFORE_DESTROY = 'beforeDestroy';
  var HOOK_AFTER_DESTROY = 'afterDestroy';
  var HOOK_BEFORE_PROPS_UPDATE = 'beforePropsUpdate';

  /**
   * 为了压缩，定义的常量
   */
  var TRUE = true;
  var FALSE = false;
  var NULL = null;
  var UNDEFINED = void 0;
  var RAW_UNDEFINED = 'undefined';
  var RAW_FILTER = 'filter';
  var RAW_PARTIAL = 'partial';
  var RAW_COMPONENT = 'component';
  var RAW_DIRECTIVE = 'directive';
  var RAW_TRANSITION = 'transition';
  var RAW_FUNCTION = 'function';
  var RAW_LENGTH = 'length';
  var RAW_WILDCARD = '*';
  var RAW_DOT = '.';
  /**
   * Single instance for window in browser
   */
  var WINDOW = typeof window !== RAW_UNDEFINED ? window : UNDEFINED;
  /**
   * Single instance for document in browser
   */
  var DOCUMENT = typeof document !== RAW_UNDEFINED ? document : UNDEFINED;
  /**
   * tap 事件
   *
   * 非常有用的抽象事件，比如 pc 端是 click 事件，移动端是 touchend 事件
   *
   * 这样只需 on-tap="handler" 就可以完美兼容各端
   *
   * 框架未实现此事件，通过 Yox.dom.addSpecialEvent 提供给外部扩展
   *
   */
  var EVENT_TAP = 'tap';
  /**
   * 点击事件
   */
  var EVENT_CLICK = 'click';
  /**
   * 输入事件
   */
  var EVENT_INPUT = 'input';
  /**
   * 变化事件
   */
  var EVENT_CHANGE = 'change';
  /**
   * 唯一内置的特殊事件：model
   */
  var EVENT_MODEL = 'model';
  /**
   * Single instance for noop function
   */
  var EMPTY_FUNCTION = function () {
      /** yox */
  };
  /**
   * 空对象，很多地方会用到，比如 `a || EMPTY_OBJECT` 确保是个对象
   */
  var EMPTY_OBJECT = Object.freeze({});
  /**
   * 空数组
   */
  var EMPTY_ARRAY = Object.freeze([]);
  /**
   * 空字符串
   */
  var EMPTY_STRING = '';
  /**
   * 日志等级
   */
  var LOG_LEVEL_DEBUG = 1;
  var LOG_LEVEL_INFO = 2;
  var LOG_LEVEL_WARN = 3;
  var LOG_LEVEL_ERROR = 4;
  var LOG_LEVEL_FATAL = 5;
  /**
   * 当前是否是源码调试，如果开启了代码压缩，empty function 里的注释会被干掉
   * 源码模式默认选 INFO，因为 DEBUG 输出的日志太多，会导致性能急剧下降
   */
  var LOG_LEVEL_DEFAULT = /yox/.test(EMPTY_FUNCTION.toString()) ? LOG_LEVEL_INFO : LOG_LEVEL_WARN;
  /**
   * 外部可配置的对象
   */
  var PUBLIC_CONFIG = {
      leftDelimiter: '{',
      rightDelimiter: '}',
      uglifyCompiled: FALSE,
      minifyCompiled: FALSE,
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
      return value !== NULL && typeof value === 'object';
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
      return value === TRUE || value === FALSE;
  }
  /**
   * Check if value is numeric.
   *
   * @param value
   * @return
   */
  function numeric(value) {
      return !isNaN(value - parseFloat(value));
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
      return array$1(args)
          ? fn.apply(context, args)
          : context !== UNDEFINED
              ? fn.call(context, args)
              : args !== UNDEFINED
                  ? fn(args)
                  : fn();
  }

  var CustomEvent = function(type, originalEvent) {
      // 这里不设置命名空间
      // 因为有没有命名空间取决于 Emitter 的构造函数有没有传 true
      // CustomEvent 自己无法决定
      this.type = type;
      this.phase = CustomEvent.PHASE_CURRENT;
      if (originalEvent) {
          this.originalEvent = originalEvent;
      }
  };
  CustomEvent.is = function (event) {
      return event instanceof CustomEvent;
  };
  /**
   * 阻止事件的默认行为
   */
  CustomEvent.prototype.preventDefault = function () {
      var instance = this;
      if (!instance.isPrevented) {
          var originalEvent = instance.originalEvent;
          if (originalEvent) {
              originalEvent.preventDefault();
          }
          instance.isPrevented = TRUE;
      }
      return instance;
  };
  /**
   * 停止事件广播
   */
  CustomEvent.prototype.stopPropagation = function () {
      var instance = this;
      if (!instance.isStoped) {
          var originalEvent = instance.originalEvent;
          if (originalEvent) {
              originalEvent.stopPropagation();
          }
          instance.isStoped = TRUE;
      }
      return instance;
  };
  CustomEvent.prototype.prevent = function () {
      return this.preventDefault();
  };
  CustomEvent.prototype.stop = function () {
      return this.stopPropagation();
  };
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
      var length = array.length;
      if (length) {
          if (reversed) {
              for (var i = length - 1; i >= 0; i--) {
                  if (callback(array[i], i) === FALSE) {
                      break;
                  }
              }
          }
          else {
              for (var i$1 = 0; i$1 < length; i$1++) {
                  if (callback(array[i$1], i$1) === FALSE) {
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
      var result = -1;
      each$2(array, function (item, index) {
          if (strict === FALSE ? item == target : item === target) {
              result = index;
              return FALSE;
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
      var length = array.length;
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
      var length = array.length;
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
  function remove$6(array, target, strict) {
      var result = 0;
      each$2(array, function (item, index) {
          if (strict === FALSE ? item == target : item === target) {
              array.splice(index, 1);
              result++;
          }
      }, TRUE);
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
      var result = {};
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
    remove: remove$6,
    has: has$2,
    toArray: toArray,
    toObject: toObject,
    join: join$1,
    falsy: falsy$2
  });

  function toString (target, defaultValue) {
      return target != NULL && target.toString
          ? target.toString()
          : defaultValue !== UNDEFINED
              ? defaultValue
              : EMPTY_STRING;
  }

  function isNative (target) {
      return func(target)
          && toString(target).indexOf('[native code]') >= 0;
  }

  var createPureObject = function () {
      var obj = Object.create(NULL);
      return {
          get: function(key) {
              return obj[key];
          },
          set: function(key, value) {
              obj[key] = value;
          },
          has: function(key) {
              return key in obj;
          },
          keys: function() {
              return Object.keys(obj);
          }
      };
  };

  /**
   * 缓存一个参数的函数调用结果
   *
   * @param fn 需要缓存的函数
   * @return 带缓存功能的函数
   */
  function createOneKeyCache(fn) {
      var cache = createPureObject();
      return function (key) {
          var hit = cache.get(key);
          if (hit !== UNDEFINED) {
              return hit;
          }
          var value = fn(key);
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
      var cache = createPureObject();
      return function (key1, key2) {
          var hit1 = cache.get(key1);
          if (hit1) {
              var hit2 = hit1.get(key2);
              if (hit2) {
                  return hit2;
              }
          }
          else {
              hit1 = createPureObject();
              cache.set(key1, hit1);
          }
          var value = fn(key1, key2);
          hit1.set(key2, value);
          return value;
      };
  }

  var camelizePattern = /-([a-z])/gi, hyphenatePattern = /\B([A-Z])/g, capitalizePattern = /^[a-z]/;
  /**
   * 连字符转成驼峰
   *
   * @param str
   * @return 驼峰格式的字符串
   */
  var camelize = createOneKeyCache(function (str) {
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
  var hyphenate = createOneKeyCache(function (str) {
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
  var capitalize = createOneKeyCache(function (str) {
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
      return str.indexOf(part, start !== UNDEFINED ? start : 0);
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
      return str.lastIndexOf(part, end !== UNDEFINED ? end : str.length);
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
      var offset = str.length - part.length;
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

  var dotPattern = /\./g, asteriskPattern = /\*/g, doubleAsteriskPattern = /\*\*/g;
  /**
   * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
   *
   * @param keypath
   * @param prefix
   * @return
   */
  var match = createTwoKeyCache(function (keypath, prefix) {
      if (keypath === prefix) {
          return prefix.length;
      }
      prefix += RAW_DOT;
      return startsWith(keypath, prefix)
          ? prefix.length
          : -1;
  });
  var getKeypathTokens = createOneKeyCache(function (keypath) {
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
      var tokens = getKeypathTokens(keypath);
      for (var i = 0, lastIndex = tokens.length - 1; i <= lastIndex; i++) {
          if (callback(tokens[i], i, lastIndex) === FALSE) {
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
  var join = createTwoKeyCache(function (keypath1, keypath2) {
      return keypath1 && keypath2
          ? keypath1 + RAW_DOT + keypath2
          : keypath1 || keypath2;
  });
  /**
   * 是否模糊匹配
   *
   * @param keypath
   */
  var isFuzzy = createOneKeyCache(function (keypath) {
      return has$1(keypath, RAW_WILDCARD);
  });
  var getFuzzyPattern = createOneKeyCache(function (pattern) {
      return new RegExp(("^" + (pattern
          .replace(dotPattern, '\\.')
          .replace(asteriskPattern, '(\\w+)')
          .replace(doubleAsteriskPattern, '([\.\\w]+?)')) + "$"));
  });
  /**
   * 模糊匹配 keypath
   *
   * @param keypath
   * @param pattern
   */
  var matchFuzzy = createTwoKeyCache(function (keypath, pattern) {
      var result = keypath.match(getFuzzyPattern(pattern));
      return result
          ? result[1]
          : UNDEFINED;
  });

  /**
   * 全局 value holder，避免频繁的创建临时对象
   */
  var holder = {
      value: UNDEFINED
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
      for (var key in object) {
          if (callback(object[key], key) === FALSE) {
              break;
          }
      }
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
      var result = object;
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
      var result = object;
      each$1(keypath, function (key, index, lastIndex) {
          if (result != NULL) {
              // 先直接取值
              var value = result[key], 
              // 紧接着判断值是否存在
              // 下面会处理计算属性的值，不能在它后面设置 hasValue
              hasValue = value !== UNDEFINED;
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
                      result = UNDEFINED;
                  }
              }
              else {
                  result = value;
              }
          }
          else {
              result = UNDEFINED;
              return FALSE;
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
      var next = object;
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
              return FALSE;
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
      return object[key] !== UNDEFINED;
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
  var DEBUG = LOG_LEVEL_DEBUG;
  var INFO = LOG_LEVEL_INFO;
  var WARN = LOG_LEVEL_WARN;
  var ERROR = LOG_LEVEL_ERROR;
  var FATAL = LOG_LEVEL_FATAL;
  /**
   * 是否有原生的日志特性，没有必要单独实现
   */
  var nativeConsole = typeof console !== RAW_UNDEFINED ? console : NULL, 
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
      var ref = PUBLIC_CONFIG;
      var logLevel = ref.logLevel;
      if (logLevel >= DEBUG && logLevel <= FATAL) {
          return logLevel;
      }
      return LOG_LEVEL_DEFAULT;
  }
  function getStyle(backgroundColor) {
      return ("background-color:" + backgroundColor + ";border-radius:12px;color:#fff;font-size:10px;padding:3px 6px;");
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
          throw new Error(("[" + (tag || 'Yox fatal') + "]: " + msg));
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

  var Emitter = function(ns) {
      this.ns = ns || FALSE;
      this.listeners = {};
  };
  /**
   * 发射事件
   *
   * @param type 事件名称或命名空间
   * @param args 事件处理函数的参数列表
   * @param filter 自定义过滤器
   */
  Emitter.prototype.fire = function (type, args, filter) {
      var instance = this, event = string$1(type) ? instance.toEvent(type) : type, list = instance.listeners[event.type], isComplete = TRUE;
      if (list) {
          // 避免遍历过程中，数组发生变化，比如增删了
          list = list.slice();
          // 判断是否是发射事件
          // 如果 args 的第一个参数是 CustomEvent 类型，表示发射事件
          // 因为事件处理函数的参数列表是 (event, data)
          var customEvent = args && CustomEvent.is(args[0])
              ? args[0]
              : UNDEFINED;
          // 这里不用 array.each，减少函数调用
          for (var i = 0, length = list.length; i < length; i++) {
              var options = list[i];
              // 命名空间不匹配
              if (!matchNamespace(event.ns, options)
                  // 在 fire 过程中被移除了
                  || !has$2(list, options)
                  // 传了 filter，则用 filter 判断是否过滤此 options
                  || (filter && !filter(event, args, options))) {
                  continue;
              }
              var result = execute(options.listener, options.ctx, args);
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
                  if (result === FALSE) {
                      customEvent.prevent().stop();
                  }
                  else if (customEvent.isStoped) {
                      result = FALSE;
                  }
              }
              if (result === FALSE) {
                  isComplete = FALSE;
                  break;
              }
          }
      }
      return isComplete;
  };
  /**
   * 注册监听
   *
   * @param type
   * @param listener
   */
  Emitter.prototype.on = function (type, listener) {
      var instance = this, listeners = instance.listeners, options = func(listener)
          ? { listener: listener }
          : listener;
      if (object$1(options) && func(options.listener)) {
          if (!string$1(options.ns)) {
              var event = instance.toEvent(type);
              options.ns = event.ns;
              type = event.type;
          }
          push(listeners[type] || (listeners[type] = []), options);
      }
  };
  /**
   * 取消监听
   *
   * @param type
   * @param listener
   */
  Emitter.prototype.off = function (type, listener) {
      var instance = this, listeners = instance.listeners;
      if (type) {
          var filter = instance.toFilter(type, listener), each$1 = function (list, name) {
              each$2(list, function (item, index) {
                  if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
                      list.splice(index, 1);
                  }
              }, TRUE);
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
  };
  /**
   * 是否已监听某个事件
   *
   * @param type
   * @param listener
   */
  Emitter.prototype.has = function (type, listener) {
      var instance = this, listeners = instance.listeners, filter = instance.toFilter(type, listener), result = TRUE, each$1 = function (list) {
          each$2(list, function (item) {
              if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
                  return result = FALSE;
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
  };
  /**
   * 把事件类型解析成命名空间格式
   *
   * @param type
   */
  Emitter.prototype.toEvent = function (type) {
      // 这里 ns 必须为字符串
      // 用于区分 event 对象是否已完成命名空间的解析
      var event = {
          type: type,
          ns: EMPTY_STRING,
      };
      // 是否开启命名空间
      if (this.ns) {
          var index = indexOf(type, RAW_DOT);
          if (index >= 0) {
              event.type = slice(type, 0, index);
              event.ns = slice(type, index + 1);
          }
      }
      return event;
  };
  Emitter.prototype.toFilter = function (type, listener) {
      var filter;
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
          var event = this.toEvent(type);
          filter.type = event.type;
          filter.ns = event.ns;
      }
      return filter;
  };
  /**
   * 判断 options 是否能匹配 listener
   *
   * @param listener
   * @param options
   */
  function matchListener(listener, options) {
      return listener
          ? listener === options.listener
          : TRUE;
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
      var ns = options.ns;
      return ns && namespace
          ? ns === namespace
          : TRUE;
  }

  var nextTick;
  // IE (10+) 和 node
  if (typeof setImmediate === RAW_FUNCTION && isNative(setImmediate)) {
      nextTick = setImmediate;
  }
  // 用 MessageChannel 去做 setImmediate 的 polyfill
  // 原理是将新的 message 事件加入到原有的 dom events 之后
  // 兼容性 IE10+ 和其他标准浏览器
  if (typeof MessageChannel === RAW_FUNCTION && isNative(MessageChannel)) {
      nextTick = function (fn) {
          var channel = new MessageChannel();
          channel.port1.onmessage = fn;
          channel.port2.postMessage(1);
      };
  }
  else {
      nextTick = setTimeout;
  }
  var nextTick$1 = nextTick;

  var shared;
  var NextTask = function(hooks) {
      var instance = this;
      instance.tasks = [];
      instance.hooks = hooks || EMPTY_OBJECT;
  };
  /**
   * 全局单例
   */
  NextTask.shared = function () {
      return shared || (shared = new NextTask());
  };
  /**
   * 在队尾添加异步任务
   */
  NextTask.prototype.append = function (func, context) {
      var instance = this;
          var tasks = instance.tasks;
      push(tasks, {
          fn: func,
          ctx: context
      });
      if (tasks.length === 1) {
          nextTick$1(function () {
              instance.run();
          });
      }
  };
  /**
   * 在队首添加异步任务
   */
  NextTask.prototype.prepend = function (func, context) {
      var instance = this;
          var tasks = instance.tasks;
      unshift(tasks, {
          fn: func,
          ctx: context
      });
      if (tasks.length === 1) {
          nextTick$1(function () {
              instance.run();
          });
      }
  };
  /**
   * 清空异步队列
   */
  NextTask.prototype.clear = function () {
      this.tasks.length = 0;
  };
  /**
   * 立即执行异步任务，并清空队列
   */
  NextTask.prototype.run = function () {
      var instance = this;
          var tasks = instance.tasks;
          var hooks = instance.hooks;
          var length = tasks.length;
      if (length) {
          instance.tasks = [];
          if (hooks.beforeTask) {
              hooks.beforeTask();
          }
          for (var i = 0; i < length; i++) {
              execute(tasks[i].fn, tasks[i].ctx);
          }
          if (hooks.afterTask) {
              hooks.afterTask();
          }
      }
  };

  // vnode.data 内部使用的几个字段
  var VNODE = '$vnode';
  var LOADING = '$loading';
  var LEAVING = '$leaving';
  var MODEL = '$model';
  var EVENT$1 = '$event';

  function update$7(api, vnode, oldVNode) {
      var node = vnode.node;
      var nativeAttrs = vnode.nativeAttrs;
      var oldNativeAttrs = oldVNode && oldVNode.nativeAttrs;
      if (nativeAttrs !== oldNativeAttrs) {
          if (nativeAttrs) {
              var oldValue = oldNativeAttrs || EMPTY_OBJECT;
              for (var name in nativeAttrs) {
                  if (oldValue[name] === UNDEFINED
                      || nativeAttrs[name] !== oldValue[name]) {
                      api.setAttr(node, name, nativeAttrs[name]);
                  }
              }
          }
          if (oldNativeAttrs) {
              var newValue = nativeAttrs || EMPTY_OBJECT;
              for (var name$1 in oldNativeAttrs) {
                  if (newValue[name$1] === UNDEFINED) {
                      api.removeAttr(node, name$1);
                  }
              }
          }
      }
  }

  function update$6(api, vnode, oldVNode) {
      var node = vnode.node;
      var nativeProps = vnode.nativeProps;
      var oldNativeProps = oldVNode && oldVNode.nativeProps;
      if (nativeProps !== oldNativeProps) {
          if (nativeProps) {
              var oldValue = oldNativeProps || EMPTY_OBJECT;
              for (var name in nativeProps) {
                  if (oldValue[name] === UNDEFINED
                      || nativeProps[name] !== oldValue[name]) {
                      api.setProp(node, name, nativeProps[name]);
                  }
              }
          }
          if (oldNativeProps) {
              var newValue = nativeProps || EMPTY_OBJECT;
              for (var name$1 in oldNativeProps) {
                  if (newValue[name$1] === UNDEFINED) {
                      api.removeProp(node, name$1);
                  }
              }
          }
      }
  }

  function update$5(api, vnode, oldVNode) {
      var node = vnode.node;
      var nativeStyles = vnode.nativeStyles;
      var oldNativeStyles = oldVNode && oldVNode.nativeStyles;
      if (nativeStyles !== oldNativeStyles) {
          var nodeStyle = node.style;
          if (nativeStyles) {
              var oldValue = oldNativeStyles || EMPTY_OBJECT;
              for (var name in nativeStyles) {
                  if (oldValue[name] === UNDEFINED
                      || nativeStyles[name] !== oldValue[name]) {
                      api.setStyle(nodeStyle, name, nativeStyles[name]);
                  }
              }
          }
          if (oldNativeStyles) {
              var newValue = nativeStyles || EMPTY_OBJECT;
              for (var name$1 in oldNativeStyles) {
                  if (newValue[name$1] === UNDEFINED) {
                      api.removeStyle(nodeStyle, name$1);
                  }
              }
          }
      }
  }

  // 删除 ref 的时候，要确保是相同的节点
  // 因为模板中可能出现同一个 ref 名字，出现在不同的地方，
  // 这样就可能出现一种特殊情况，即前面刚创建了 ref1，后面又把这个这个新创建的 ref1 删除了
  function update$4(api, vnode, oldVNode) {
      var context = vnode.context;
      var ref = vnode.ref;
      var oldRef = oldVNode && oldVNode.ref;
      if (ref || oldRef) {
          var refs = context.$refs, value = vnode.component || vnode.node;
          if (ref) {
              if (!oldRef) {
                  if (!refs) {
                      refs = context.$refs = {};
                  }
                  refs[ref] = value;
              }
              else if (ref !== oldRef) {
                  if (refs) {
                      if (refs[ref] === value) {
                          delete refs[ref];
                      }
                  }
                  else {
                      refs = context.$refs = {};
                  }
                  refs[ref] = value;
              }
          }
          else if (refs && oldRef && refs[oldRef] === value) {
              delete refs[oldRef];
          }
      }
  }
  function remove$5(api, vnode) {
      var ref = vnode.ref;
      if (ref) {
          var refs = vnode.context.$refs, value = vnode.component || vnode.node;
          if (refs && refs[ref] === value) {
              delete refs[ref];
          }
      }
  }

  /**
   * 节流调用
   *
   * @param fn 需要节制调用的函数
   * @param delay 调用的时间间隔，单位毫秒
   * @param immediate 是否立即触发
   * @return 节流函数
   */
  function debounce (fn, delay, immediate) {
      var timer;
      return function () {
          if (!timer) {
              var args = toArray(arguments);
              if (immediate) {
                  execute(fn, UNDEFINED, args);
              }
              timer = setTimeout(function () {
                  timer = UNDEFINED;
                  if (!immediate) {
                      execute(fn, UNDEFINED, args);
                  }
              }, delay);
          }
      };
  }

  function addEvent$1(api, element, component, lazy, event) {
      var name = event.name;
      var listener = event.listener;
      if (lazy) {
          var value = lazy[name] || lazy[EMPTY_STRING];
          if (value === TRUE) {
              name = EVENT_CHANGE;
          }
          else if (value > 0) {
              listener = debounce(listener, value, 
              // 避免连续多次点击，主要用于提交表单场景
              // 移动端的 tap 事件可自行在业务层打补丁实现
              name === EVENT_CLICK || name === EVENT_TAP);
          }
      }
      if (component) {
          if (event.isNative) {
              var target = component.$el;
              api.on(target, name, listener);
              return function () {
                  api.off(target, name, listener);
              };
          }
          // event 有 ns 和 listener 两个字段，满足 ThisListenerOptions 的要求
          component.on(name, event);
          return function () {
              component.off(name, event);
          };
      }
      api.on(element, name, listener);
      return function () {
          api.off(element, name, listener);
      };
  }
  function update$3(api, vnode, oldVNode) {
      var data = vnode.data, lazy = vnode.lazy, events = vnode.events, oldEvents = oldVNode && oldVNode.events;
      if (events !== oldEvents) {
          var element = vnode.node, component = vnode.component, destroy = data[EVENT$1] || (data[EVENT$1] = {});
          if (events) {
              var oldValue = oldEvents || EMPTY_OBJECT;
              for (var key in events) {
                  var event = events[key], oldEvent = oldValue[key];
                  if (!oldEvent) {
                      destroy[key] = addEvent$1(api, element, component, lazy, event);
                  }
                  else if (event.value !== oldEvent.value) {
                      destroy[key]();
                      destroy[key] = addEvent$1(api, element, component, lazy, event);
                  }
                  else if (oldEvent.runtime && event.runtime) {
                      extend(oldEvent.runtime, event.runtime);
                      // 在当前节点传递 oldEvent.runtime 的引用
                      event.runtime = oldEvent.runtime;
                  }
              }
          }
          if (oldEvents) {
              var newValue = events || EMPTY_OBJECT;
              for (var key$1 in oldEvents) {
                  if (!newValue[key$1]) {
                      destroy[key$1]();
                      delete destroy[key$1];
                  }
              }
          }
      }
  }
  function remove$4(api, vnode) {
      var data = vnode.data, events = vnode.events, destroy = data[EVENT$1];
      if (events && destroy) {
          for (var key in events) {
              destroy[key]();
              delete destroy[key];
          }
      }
      data[EVENT$1] = UNDEFINED;
  }

  function debounceIfNeeded(fn, lazy) {
      // 应用 lazy
      return lazy && lazy !== TRUE
          ? debounce(fn, lazy)
          : fn;
  }
  var inputControl = {
      set: function(node, value) {
          node.value = toString(value);
      },
      sync: function(node, keypath, context) {
          context.set(keypath, node.value);
      },
      name: 'value'
  }, radioControl = {
      set: function(node, value) {
          node.checked = node.value === toString(value);
      },
      sync: function(node, keypath, context) {
          if (node.checked) {
              context.set(keypath, node.value);
          }
      },
      name: 'checked'
  }, checkboxControl = {
      set: function(node, value) {
          node.checked = array$1(value)
              ? has$2(value, node.value, FALSE)
              : !!value;
      },
      sync: function(node, keypath, context) {
          var value = context.get(keypath);
          if (array$1(value)) {
              if (node.checked) {
                  context.append(keypath, node.value);
              }
              else {
                  context.removeAt(keypath, indexOf$1(value, node.value, FALSE));
              }
          }
          else {
              context.set(keypath, node.checked);
          }
      },
      name: 'checked'
  }, selectControl = {
      set: function(node, value) {
          each$2(toArray(node.options), node.multiple
              ? function (option) {
                  option.selected = has$2(value, option.value, FALSE);
              }
              : function (option, index) {
                  if (option.value == value) {
                      node.selectedIndex = index;
                      return FALSE;
                  }
              });
      },
      sync: function(node, keypath, context) {
          var options = node.options;
          if (node.multiple) {
              var values = [];
              each$2(toArray(options), function (option) {
                  if (option.selected) {
                      push(values, option.value);
                  }
              });
              context.set(keypath, values);
          }
          else {
              context.set(keypath, options[node.selectedIndex].value);
          }
      },
      name: 'value'
  };
  function addModel(api, element, component, vnode) {
      var context = vnode.context;
      var model = vnode.model;
      var lazy = vnode.lazy;
      var nativeProps = vnode.nativeProps;
      var keypath = model.keypath;
      var value = model.value;
      var lazyValue = lazy && (lazy[DIRECTIVE_MODEL] || lazy[EMPTY_STRING]), update, destroy;
      if (component) {
          var viewBinding = component.$model, viewSyncing = debounceIfNeeded(function (newValue) {
              context.set(keypath, newValue);
          }, lazyValue);
          update = function (newValue) {
              if (update) {
                  component.set(viewBinding, newValue);
              }
          };
          destroy = function () {
              component.unwatch(viewBinding, viewSyncing);
          };
          component.watch(viewBinding, viewSyncing);
      }
      else {
          var control = vnode.tag === 'select'
              ? selectControl
              : inputControl, 
          // checkbox,radio,select 监听的是 change 事件
          eventName = EVENT_CHANGE;
          if (control === inputControl) {
              var type = nativeProps && nativeProps.type;
              if (type === 'radio') {
                  control = radioControl;
              }
              else if (type === 'checkbox') {
                  control = checkboxControl;
              }
              // 如果是输入框，则切换成 model 事件
              // model 事件是个 yox-dom 实现的特殊事件
              // 不会在输入法组合文字过程中得到触发事件
              else if (lazyValue !== TRUE) {
                  eventName = EVENT_MODEL;
              }
          }
          update = function (newValue) {
              if (update) {
                  control.set(element, newValue);
              }
          };
          var sync = debounceIfNeeded(function () {
              control.sync(element, keypath, context);
          }, lazyValue);
          destroy = function () {
              api.off(element, eventName, sync);
          };
          api.on(element, eventName, sync);
          control.set(element, value);
      }
      // 监听数据，修改界面
      context.watch(keypath, update);
      return function () {
          context.unwatch(keypath, update);
          update = UNDEFINED;
          destroy();
      };
  }
  function update$2(api, vnode, oldVNode) {
      var data = vnode.data, node = vnode.node, component = vnode.component, model = vnode.model, oldModel = oldVNode && oldVNode.model;
      if (model) {
          if (!oldModel) {
              data[MODEL] = addModel(api, node, component, vnode);
          }
          else if (model.keypath !== oldModel.keypath) {
              data[MODEL]();
              data[MODEL] = addModel(api, node, component, vnode);
          }
      }
      else if (oldModel) {
          data[MODEL]();
          delete data[MODEL];
      }
  }
  function remove$3(api, vnode) {
      var data = vnode.data;
      if (data[MODEL]) {
          data[MODEL]();
          delete data[MODEL];
      }
  }

  function update$1(api, vnode, oldVNode) {
      var directives = vnode.directives;
      var oldDirectives = oldVNode && oldVNode.directives;
      if (directives !== oldDirectives) {
          var node = vnode.component || vnode.node;
          if (directives) {
              var oldValue = oldDirectives || EMPTY_OBJECT;
              for (var name in directives) {
                  var directive = directives[name], oldDirective = oldValue[name];
                  var ref = directive.hooks;
                  var bind = ref.bind;
                  var unbind = ref.unbind;
                  if (!oldDirective) {
                      bind(node, directive, vnode);
                  }
                  else if (directive.value !== oldDirective.value) {
                      if (unbind) {
                          unbind(node, oldDirective, oldVNode);
                      }
                      bind(node, directive, vnode);
                  }
                  else if (oldDirective.runtime && directive.runtime) {
                      extend(oldDirective.runtime, directive.runtime);
                      // 在当前节点传递 oldDirective.runtime 的引用
                      directive.runtime = oldDirective.runtime;
                  }
              }
          }
          if (oldDirectives) {
              var newValue = directives || EMPTY_OBJECT;
              for (var name$1 in oldDirectives) {
                  if (!newValue[name$1]) {
                      var ref$1 = oldDirectives[name$1].hooks;
                      var unbind$1 = ref$1.unbind;
                      if (unbind$1) {
                          unbind$1(node, oldDirectives[name$1], oldVNode);
                      }
                  }
              }
          }
      }
  }
  function remove$2(api, vnode) {
      var directives = vnode.directives;
      if (directives) {
          var node = vnode.component || vnode.node;
          for (var name in directives) {
              var ref = directives[name].hooks;
              var unbind = ref.unbind;
              if (unbind) {
                  unbind(node, directives[name], vnode);
              }
          }
      }
  }

  function update(api, vnode, oldVNode) {
      var component = vnode.component;
      var props = vnode.props;
      var slots = vnode.slots;
      // 更新时才要 set
      // 因为初始化时，所有这些都经过构造函数完成了
      if (component && oldVNode) {
          var result = merge(props, slots);
          if (result) {
              component.forceUpdate(result);
          }
      }
  }
  function remove$1(api, vnode) {
      var component = vnode.component;
      if (component) {
          component.destroy();
          // 移除时，组件可能已经发生过变化，即 shadow 不是创建时那个对象了
          vnode.shadow = component.$vnode;
          vnode.component = UNDEFINED;
      }
  }

  function getFragmentHostNode(api, vnode) {
      if (vnode.isFragment || vnode.isSlot) {
          var child = vnode.children[0];
          return child
              ? getFragmentHostNode(api, child)
              : api.createComment(EMPTY_STRING);
      }
      return vnode.node;
  }
  function insertNodeNatively(api, parentNode, node, referenceNode) {
      if (referenceNode) {
          api.before(parentNode, node, referenceNode);
      }
      else {
          api.append(parentNode, node);
      }
  }
  function textVNodeUpdateOperator(api, vnode, oldVNode) {
      var node = oldVNode.node;
      vnode.node = node;
      vnode.parentNode = oldVNode.parentNode;
      if (vnode.text !== oldVNode.text) {
          api.setText(node, vnode.text, vnode.isStyle, vnode.isOption);
      }
  }
  function elementVNodeEnterOperator(vnode) {
      if (vnode.data) {
          enterVNode(vnode, vnode.node);
      }
  }
  function elementVNodeLeaveOperator(vnode, done) {
      if (vnode.data
          && leaveVNode(vnode, vnode.node, done)) {
          return;
      }
      done();
  }
  function vnodeInsertOperator(api, parentNode, vnode, before) {
      // 这里不调用 insertNodeNatively，避免判断两次
      if (before) {
          api.before(parentNode, vnode.node, before.node);
      }
      else {
          api.append(parentNode, vnode.node);
      }
  }
  function vnodeRemoveOperator(api, vnode) {
      api.remove(vnode.parentNode, vnode.node);
  }
  function vnodeLeaveOperator(vnode, done) {
      done();
  }
  function vnodeCreateChildrenOperator(api, vnode) {
      each$2(vnode.children, function (child) {
          createVNode(api, child);
      });
  }
  function vnodeUpdateChildrenOperator(api, parentNode, vnode, oldVNode) {
      updateChildren(api, parentNode, vnode.children, oldVNode.children);
  }
  function vnodeDestroyChildrenOperator(api, vnode) {
      each$2(vnode.children, function (child) {
          destroyVNode(api, child);
      });
  }
  function vnodeInsertChildrenOperator(api, parentNode, vnode, before) {
      each$2(vnode.children, function (child) {
          insertVNode(api, parentNode, child, before);
      });
  }
  function vnodeRemoveChildrenOperator(api, vnode) {
      each$2(vnode.children, function (child) {
          removeVNode(api, child);
      });
  }
  var textVNodeOperator = {
      create: function(api, vnode) {
          vnode.node = api.createText(vnode.text);
      },
      update: textVNodeUpdateOperator,
      destroy: EMPTY_FUNCTION,
      insert: vnodeInsertOperator,
      remove: vnodeRemoveOperator,
      enter: EMPTY_FUNCTION,
      leave: vnodeLeaveOperator,
  };
  var commentVNodeOperator = {
      create: function(api, vnode) {
          vnode.node = api.createComment(vnode.text);
      },
      update: textVNodeUpdateOperator,
      destroy: EMPTY_FUNCTION,
      insert: vnodeInsertOperator,
      remove: vnodeRemoveOperator,
      enter: EMPTY_FUNCTION,
      leave: vnodeLeaveOperator,
  };
  var elementVNodeOperator = {
      create: function(api, vnode) {
          var node = vnode.node = api.createElement(vnode.tag, vnode.isSvg);
          if (vnode.children) {
              addVNodes(api, node, vnode.children);
          }
          else if (vnode.text) {
              api.setText(node, vnode.text, vnode.isStyle, vnode.isOption);
          }
          else if (vnode.html) {
              api.setHtml(node, vnode.html, vnode.isStyle, vnode.isOption);
          }
          update$7(api, vnode);
          update$6(api, vnode);
          update$5(api, vnode);
          if (!vnode.isPure) {
              vnode.data = {};
              update$4(api, vnode);
              update$3(api, vnode);
              update$2(api, vnode);
              update$1(api, vnode);
          }
      },
      update: function(api, vnode, oldVNode) {
          var node = oldVNode.node;
          vnode.node = node;
          vnode.parentNode = oldVNode.parentNode;
          vnode.data = oldVNode.data;
          update$7(api, vnode, oldVNode);
          update$6(api, vnode, oldVNode);
          update$5(api, vnode, oldVNode);
          if (!vnode.isPure) {
              update$4(api, vnode, oldVNode);
              update$3(api, vnode, oldVNode);
              update$2(api, vnode, oldVNode);
              update$1(api, vnode, oldVNode);
          }
          var text = vnode.text;
          var html = vnode.html;
          var children = vnode.children;
          var isStyle = vnode.isStyle;
          var isOption = vnode.isOption;
          var oldText = oldVNode.text, oldHtml = oldVNode.html, oldChildren = oldVNode.children;
          if (string$1(text)) {
              if (oldChildren) {
                  removeVNodes(api, oldChildren);
              }
              if (text !== oldText) {
                  api.setText(node, text, isStyle, isOption);
              }
          }
          else if (string$1(html)) {
              if (oldChildren) {
                  removeVNodes(api, oldChildren);
              }
              if (html !== oldHtml) {
                  api.setHtml(node, html, isStyle, isOption);
              }
          }
          else if (children) {
              // 两个都有需要 diff
              if (oldChildren) {
                  if (children !== oldChildren) {
                      updateChildren(api, node, children, oldChildren);
                  }
              }
              // 有新的没旧的 - 新增节点
              else {
                  if (oldText || oldHtml) {
                      api.setText(node, EMPTY_STRING, isStyle);
                  }
                  addVNodes(api, node, children);
              }
          }
          // 有旧的没新的 - 删除节点
          else if (oldChildren) {
              removeVNodes(api, oldChildren);
          }
          // 有旧的 text 没有新的 text
          else if (oldText || oldHtml) {
              api.setText(node, EMPTY_STRING, isStyle);
          }
      },
      destroy: function(api, vnode) {
          if (vnode.isPure) {
              return;
          }
          remove$5(api, vnode);
          remove$4(api, vnode);
          remove$3(api, vnode);
          remove$2(api, vnode);
          if (vnode.children) {
              each$2(vnode.children, function (child) {
                  destroyVNode(api, child);
              });
          }
      },
      insert: vnodeInsertOperator,
      remove: vnodeRemoveOperator,
      enter: elementVNodeEnterOperator,
      leave: elementVNodeLeaveOperator,
  };
  var componentVNodeOperator = {
      create: function(api, vnode) {
          var data = vnode.data = {};
          var componentOptions = UNDEFINED;
          // 动态组件，tag 可能为空
          if (vnode.tag) {
              vnode.context.loadComponent(vnode.tag, function (options) {
                  if (has(data, LOADING)) {
                      // 异步组件
                      if (data[LOADING]) {
                          // 尝试使用最新的 vnode
                          if (data[VNODE]) {
                              vnode = data[VNODE];
                              // 用完就删掉
                              delete data[VNODE];
                          }
                          createComponent(api, vnode, options);
                          vnode.operator.enter(vnode);
                      }
                  }
                  // 同步组件
                  else {
                      componentOptions = options;
                  }
              });
          }
          // 不论是同步还是异步组件，都需要一个占位元素
          vnode.node = api.createComment(RAW_COMPONENT);
          if (componentOptions) {
              createComponent(api, vnode, componentOptions);
          }
          else {
              data[LOADING] = TRUE;
          }
      },
      update: function(api, vnode, oldVNode) {
          var data = oldVNode.data;
          vnode.data = data;
          vnode.node = oldVNode.node;
          vnode.parentNode = oldVNode.parentNode;
          vnode.component = oldVNode.component;
          // 组件正在异步加载，更新为最新的 vnode
          // 当异步加载完成时才能用上最新的 vnode
          if (data[LOADING]) {
              data[VNODE] = vnode;
              return;
          }
          // 先处理 directive 再处理 component
          // 因为组件只是单纯的更新 props，而 directive 则有可能要销毁
          // 如果顺序反过来，会导致某些本该销毁的指令先被数据的变化触发执行了
          update$4(api, vnode, oldVNode);
          update$3(api, vnode, oldVNode);
          update$2(api, vnode, oldVNode);
          update$1(api, vnode, oldVNode);
          update(api, vnode, oldVNode);
      },
      destroy: function(api, vnode) {
          if (vnode.component) {
              remove$5(api, vnode);
              remove$4(api, vnode);
              remove$3(api, vnode);
              remove$2(api, vnode);
              remove$1(api, vnode);
          }
          else {
              vnode.data[LOADING] = FALSE;
          }
      },
      insert: function(api, parentNode, vnode, before) {
          var shadow = vnode.shadow;
          if (shadow) {
              shadow.operator.insert(api, parentNode, shadow, before);
              shadow.parentNode = parentNode;
          }
          else {
              vnodeInsertOperator(api, parentNode, vnode, before);
          }
      },
      remove: function(api, vnode) {
          var shadow = vnode.shadow;
          if (shadow) {
              shadow.operator.remove(api, shadow);
              shadow.parentNode = UNDEFINED;
          }
          else {
              vnodeRemoveOperator(api, vnode);
          }
      },
      enter: function(vnode) {
          var shadow = vnode.shadow;
          if (shadow) {
              if (vnode.transition) {
                  enterVNode(vnode, shadow.node);
              }
              else {
                  shadow.operator.enter(shadow);
              }
          }
      },
      leave: function(vnode, done) {
          var shadow = vnode.shadow;
          if (shadow) {
              if (vnode.transition) {
                  if (leaveVNode(vnode, shadow.node, done)) {
                      return;
                  }
              }
              else {
                  shadow.operator.leave(shadow, done);
                  return;
              }
          }
          done();
      },
  };
  var fragmentVNodeOperator = {
      create: function(api, vnode) {
          vnodeCreateChildrenOperator(api, vnode);
          vnode.node = getFragmentHostNode(api, vnode);
      },
      update: function(api, vnode, oldVNode) {
          var parentNode = oldVNode.parentNode;
          vnode.node = oldVNode.node;
          vnode.parentNode = parentNode;
          vnodeUpdateChildrenOperator(api, parentNode, vnode, oldVNode);
      },
      destroy: vnodeDestroyChildrenOperator,
      insert: vnodeInsertChildrenOperator,
      remove: vnodeRemoveChildrenOperator,
      enter: EMPTY_FUNCTION,
      leave: vnodeLeaveOperator,
  };
  var portalVNodeOperator = {
      create: function(api, vnode) {
          var target = UNDEFINED;
          if (vnode.to) {
              target = api.find(vnode.to);
          }
          // 用 body 元素兜底
          if (!target) {
              target = api.getBodyElement();
          }
          vnode.target = target;
          // 用注释占用节点在模板里的位置
          // 这样删除或替换节点，才有找到它应该在的位置
          vnode.node = api.createComment(EMPTY_STRING);
          each$2(vnode.children, function (child) {
              createVNode(api, child);
              insertVNode(api, target, child);
          });
      },
      update: function(api, vnode, oldVNode) {
          var target = oldVNode.target;
          vnode.node = oldVNode.node;
          vnode.parentNode = oldVNode.parentNode;
          vnode.target = target;
          vnodeUpdateChildrenOperator(api, target, vnode, oldVNode);
      },
      destroy: function(api, vnode) {
          each$2(vnode.children, function (child) {
              destroyVNode(api, child);
              removeVNode(api, child);
          });
      },
      insert: vnodeInsertOperator,
      remove: vnodeRemoveOperator,
      enter: EMPTY_FUNCTION,
      leave: vnodeLeaveOperator,
  };
  var slotVNodeOperator = {
      create: function(api, vnode) {
          vnodeCreateChildrenOperator(api, vnode);
          vnode.data = {};
          vnode.node = getFragmentHostNode(api, vnode);
          update$4(api, vnode);
          update$3(api, vnode);
      },
      update: function(api, vnode, oldVNode) {
          var parentNode = oldVNode.parentNode;
          vnode.node = oldVNode.node;
          vnode.parentNode = parentNode;
          vnode.data = oldVNode.data;
          update$4(api, vnode, oldVNode);
          update$3(api, vnode, oldVNode);
          vnodeUpdateChildrenOperator(api, parentNode, vnode, oldVNode);
      },
      destroy: function(api, vnode) {
          remove$5(api, vnode);
          remove$4(api, vnode);
          vnodeDestroyChildrenOperator(api, vnode);
      },
      insert: vnodeInsertChildrenOperator,
      remove: vnodeRemoveChildrenOperator,
      enter: elementVNodeEnterOperator,
      leave: elementVNodeLeaveOperator,
  };
  function isPatchable(vnode, oldVNode) {
      return vnode.type === oldVNode.type
          && vnode.tag === oldVNode.tag
          && vnode.key === oldVNode.key;
  }
  function createKeyToIndex(vnodes, startIndex, endIndex) {
      var result, vnode, key;
      while (startIndex <= endIndex) {
          vnode = vnodes[startIndex];
          if (vnode && (key = vnode.key)) {
              if (!result) {
                  result = {};
              }
              result[key] = startIndex;
          }
          startIndex++;
      }
      return result || EMPTY_OBJECT;
  }
  function createComponent(api, vnode, options) {
      var data = vnode.data, child = (vnode.parent || vnode.context).createComponent(options, vnode);
      vnode.component = child;
      vnode.shadow = child.$vnode;
      data[LOADING] = FALSE;
      update$4(api, vnode);
      update$3(api, vnode);
      update$2(api, vnode);
      update$1(api, vnode);
      update(api, vnode);
      return child;
  }
  function createVNode(api, vnode) {
      if (!vnode.node) {
          vnode.operator.create(api, vnode);
      }
  }
  function addVNodes(api, parentNode, vnodes, startIndex, endIndex, before) {
      var vnode, start = startIndex || 0, end = endIndex !== UNDEFINED ? endIndex : vnodes.length - 1;
      while (start <= end) {
          vnode = vnodes[start];
          createVNode(api, vnode);
          insertVNode(api, parentNode, vnode, before);
          start++;
      }
  }
  function insertVNode(api, parentNode, vnode, before) {
      var operator = vnode.operator;
      operator.insert(api, parentNode, vnode, before);
      vnode.parentNode = parentNode;
      operator.enter(vnode);
  }
  function removeVNodes(api, vnodes, startIndex, endIndex) {
      var vnode, start = startIndex || 0, end = endIndex !== UNDEFINED ? endIndex : vnodes.length - 1;
      while (start <= end) {
          vnode = vnodes[start];
          if (vnode) {
              destroyVNode(api, vnode);
              removeVNode(api, vnode);
          }
          start++;
      }
  }
  function destroyVNode(api, vnode) {
      vnode.operator.destroy(api, vnode);
  }
  function removeVNode(api, vnode) {
      var operator = vnode.operator;
      operator.leave(vnode, function () {
          operator.remove(api, vnode);
          vnode.parentNode = UNDEFINED;
      });
  }
  function enterVNode(vnode, node) {
      var context = vnode.context;
      var transition = vnode.transition;
      var data = vnode.data, leaving = data[LEAVING];
      if (leaving) {
          leaving();
      }
      if (transition) {
          var enter = transition.enter;
          if (enter) {
              enter.call(context, node);
          }
      }
  }
  function leaveVNode(vnode, node, done) {
      var context = vnode.context;
      var transition = vnode.transition;
      var data = vnode.data, leaving = data[LEAVING];
      if (leaving) {
          leaving();
      }
      if (transition) {
          var leave = transition.leave;
          if (leave) {
              leave.call(context, node, data[LEAVING] = function () {
                  if (data[LEAVING]) {
                      done();
                      data[LEAVING] = UNDEFINED;
                  }
              });
              return TRUE;
          }
      }
  }
  function updateChildren(api, parentNode, children, oldChildren) {
      var startIndex = 0, endIndex = children.length - 1, startVNode = children[startIndex], endVNode = children[endIndex], oldStartIndex = 0, oldEndIndex = oldChildren.length - 1, oldStartVNode = oldChildren[oldStartIndex], oldEndVNode = oldChildren[oldEndIndex], oldKeyToIndex, oldIndex;
      while (oldStartIndex <= oldEndIndex && startIndex <= endIndex) {
          // 下面有设为 UNDEFINED 的逻辑
          if (!startVNode) {
              startVNode = children[++startIndex];
          }
          else if (!endVNode) {
              endVNode = children[--endIndex];
          }
          else if (!oldStartVNode) {
              oldStartVNode = oldChildren[++oldStartIndex];
          }
          else if (!oldEndVNode) {
              oldEndVNode = oldChildren[--oldEndIndex];
          }
          // 从头到尾比较，位置相同且值得 patch
          else if (isPatchable(startVNode, oldStartVNode)) {
              updateVNode(api, startVNode, oldStartVNode);
              startVNode = children[++startIndex];
              oldStartVNode = oldChildren[++oldStartIndex];
          }
          // 从尾到头比较，位置相同且值得 patch
          else if (isPatchable(endVNode, oldEndVNode)) {
              updateVNode(api, endVNode, oldEndVNode);
              endVNode = children[--endIndex];
              oldEndVNode = oldChildren[--oldEndIndex];
          }
          // 比较完两侧的节点，剩下就是 位置发生改变的节点 和 全新的节点
          // 当 endVNode 和 oldStartVNode 值得 patch
          // 说明元素被移到右边了
          else if (isPatchable(endVNode, oldStartVNode)) {
              updateVNode(api, endVNode, oldStartVNode);
              insertNodeNatively(api, parentNode, oldStartVNode.node, api.next(oldEndVNode.node));
              endVNode = children[--endIndex];
              oldStartVNode = oldChildren[++oldStartIndex];
          }
          // 当 oldEndVNode 和 startVNode 值得 patch
          // 说明元素被移到左边了
          else if (isPatchable(startVNode, oldEndVNode)) {
              updateVNode(api, startVNode, oldEndVNode);
              insertNodeNatively(api, parentNode, oldEndVNode.node, oldStartVNode.node);
              startVNode = children[++startIndex];
              oldEndVNode = oldChildren[--oldEndIndex];
          }
          // 尝试同级元素的 key
          else {
              if (!oldKeyToIndex) {
                  oldKeyToIndex = createKeyToIndex(oldChildren, oldStartIndex, oldEndIndex);
              }
              // 新节点之前的位置
              oldIndex = startVNode.key
                  ? oldKeyToIndex[startVNode.key]
                  : UNDEFINED;
              // 移动元素
              if (oldIndex !== UNDEFINED) {
                  patch(api, startVNode, oldChildren[oldIndex]);
                  oldChildren[oldIndex] = UNDEFINED;
              }
              // 新元素
              else {
                  createVNode(api, startVNode);
              }
              insertVNode(api, parentNode, startVNode, oldStartVNode);
              startVNode = children[++startIndex];
          }
      }
      if (oldStartIndex > oldEndIndex) {
          addVNodes(api, parentNode, children, startIndex, endIndex, children[endIndex + 1]);
      }
      else if (startIndex > endIndex) {
          removeVNodes(api, oldChildren, oldStartIndex, oldEndIndex);
      }
  }
  function updateVNode(api, vnode, oldVNode) {
      if (vnode !== oldVNode) {
          vnode.operator.update(api, vnode, oldVNode);
      }
  }
  function patch(api, vnode, oldVNode) {
      if (vnode === oldVNode) {
          return;
      }
      // 如果不能 patch，则删除重建
      if (!isPatchable(vnode, oldVNode)) {
          // 同步加载的组件，初始化时不会传入占位节点
          // 它内部会自动生成一个注释节点，当它的根 vnode 和注释节点对比时，必然无法 patch
          // 于是走进此分支，为新组件创建一个 DOM 节点，然后继续 createComponent 后面的流程
          var parentNode = oldVNode.parentNode;
          createVNode(api, vnode);
          if (parentNode) {
              insertVNode(api, parentNode, vnode, oldVNode);
              destroyVNode(api, oldVNode);
              removeVNode(api, oldVNode);
          }
          return;
      }
      updateVNode(api, vnode, oldVNode);
  }
  function create(api, node, context) {
      var vnode = {
          context: context,
          node: node,
          parentNode: api.parent(node),
      };
      switch (node.nodeType) {
          case 1:
              vnode.data = {};
              vnode.tag = api.tag(node);
              vnode.type = VNODE_TYPE_ELEMENT;
              vnode.operator = elementVNodeOperator;
              break;
          case 3:
              vnode.isPure = TRUE;
              vnode.text = node.nodeValue;
              vnode.type = VNODE_TYPE_TEXT;
              vnode.operator = textVNodeOperator;
              break;
          case 8:
              vnode.isPure = TRUE;
              vnode.text = node.nodeValue;
              vnode.type = VNODE_TYPE_COMMENT;
              vnode.operator = commentVNodeOperator;
              break;
      }
      return vnode;
  }
  function destroy(api, vnode, isRemove) {
      destroyVNode(api, vnode);
      if (isRemove) {
          removeVNode(api, vnode);
      }
  }
  function clone(vnode) {
      return {
          type: vnode.type,
          tag: vnode.tag,
          isComponent: vnode.isComponent,
          isFragment: vnode.isFragment,
          isSlot: vnode.isSlot,
          isSvg: vnode.isSvg,
          isStyle: vnode.isStyle,
          isOption: vnode.isOption,
          isStatic: vnode.isStatic,
          isPure: vnode.isPure,
          slots: vnode.slots,
          props: vnode.props,
          nativeProps: vnode.nativeProps,
          nativeAttrs: vnode.nativeAttrs,
          nativeStyles: vnode.nativeStyles,
          directives: vnode.directives,
          events: vnode.events,
          lazy: vnode.lazy,
          transition: vnode.transition,
          model: vnode.model,
          to: vnode.to,
          ref: vnode.ref,
          key: vnode.key,
          text: vnode.text,
          html: vnode.html,
          children: vnode.children,
          parent: vnode.parent,
          context: vnode.context,
          operator: vnode.operator,
      };
  }

  function parseStyleString(value, callback) {
      var parts = value.split(';');
      for (var i = 0, len = parts.length; i < len; i++) {
          var item = parts[i];
          var index = item.indexOf(':');
          if (index > 0) {
              var key = trim(item.substr(0, index));
              var value$1 = trim(item.substr(index + 1));
              if (key && value$1) {
                  callback(camelize(key), value$1);
              }
          }
      }
  }

  function toNumber (target, defaultValue) {
      return numeric(target)
          ? +target
          : defaultValue !== UNDEFINED
              ? defaultValue
              : 0;
  }

  function render(instance, template, dependencies, data, computed, filters, globalFilters, partials, globalPartials, directives, globalDirectives, transitions, globalTransitions) {
      var rootScope = merge(data, computed), rootKeypath = EMPTY_STRING, contextStack = [
          { scope: rootScope, keypath: rootKeypath }
      ], localPartials = {}, 
      // 模板渲染过程收集的 vnode
      children = [], 
      // 模板渲染过程收集的组件
      components = [], renderComposeVNode = function (vnode, children) {
          if (vnode.children.length) {
              children[children.length] = vnode;
          }
      }, appendAttribute = function (vnode, key, value, name) {
          if (name) {
              if (vnode[key]) {
                  vnode[key][name] = value;
              }
              else {
                  var map = {};
                  map[name] = value;
                  vnode[key] = map;
              }
          }
          else {
              vnode[key] = value;
          }
      }, renderStyleString = function (value) {
          var styles = {};
          parseStyleString(value, function (key, value) {
              styles[key] = value;
          });
          return styles;
      }, renderStyleExpr = function (value) {
          if (array$1(value)) {
              var styles = {};
              for (var i = 0, len = value.length; i < len; i++) {
                  var item = renderStyleExpr(value[i]);
                  if (item) {
                      for (var key in item) {
                          styles[key] = item[key];
                      }
                  }
              }
              return styles;
          }
          if (object$1(value)) {
              return value;
          }
          if (string$1(value)) {
              return renderStyleString(value);
          }
      }, renderTransition = function (name, transition) {
          return transition;
      }, 
      // holder 是全局共用的，这里要浅拷贝一次
      renderModel = function (holder) {
          return {
              keypath: holder.keypath,
              value: holder.value,
          };
      }, createEventNameListener = function (type, ns, isComponent) {
          return function (event, data, isNative) {
              // 监听组件事件不用处理父组件传下来的事件
              if (isComponent && event.phase === CustomEvent.PHASE_DOWNWARD) {
                  return;
              }
              if (type !== event.type || ns !== event.ns) {
                  event = new CustomEvent(type, isNative
                      ? event.originalEvent
                      : event);
                  event.ns = ns;
              }
              instance.fire(event, data);
          };
      }, createEventMethodListener = function (method, runtime, isComponent) {
          return function (event, data) {
              // 监听组件事件不用处理父组件传下来的事件
              if (isComponent && event.phase === CustomEvent.PHASE_DOWNWARD) {
                  return;
              }
              var result = execute(method, instance, runtime
                  ? runtime.args(runtime.stack, event, data)
                  : (data ? [event, data] : event));
              if (result === FALSE) {
                  event.prevent().stop();
              }
          };
      }, renderEventMethod = function (key, value, name, ns, method, runtime, isComponent, isNative) {
          if (runtime) {
              runtime.stack = contextStack;
          }
          return {
              key: key,
              value: value,
              name: name,
              ns: ns,
              isNative: isNative,
              listener: createEventMethodListener(method, runtime, isComponent),
              runtime: runtime,
          };
      }, renderEventName = function (key, value, name, ns, to, toNs, isComponent, isNative) {
          return {
              key: key,
              value: value,
              name: name,
              ns: ns,
              isNative: isNative,
              listener: createEventNameListener(to, toNs, isComponent),
          };
      }, createDirectiveGetter = function (runtime) {
          return function () {
              return runtime.expr(runtime.stack);
          };
      }, createDirectiveHandler = function (method, runtime) {
          return function () {
              execute(method, instance, runtime
                  ? runtime.args(runtime.stack)
                  : UNDEFINED);
          };
      }, renderDirective = function (key, name, modifier, value, hooks, runtime, method) {
          if (runtime) {
              runtime.stack = contextStack;
          }
          return {
              ns: DIRECTIVE_CUSTOM,
              key: key,
              name: name,
              value: value,
              modifier: modifier,
              getter: runtime && runtime.expr ? createDirectiveGetter(runtime) : UNDEFINED,
              handler: method ? createDirectiveHandler(method, runtime) : UNDEFINED,
              hooks: hooks,
              runtime: runtime,
          };
      }, renderSpread = function (vnode, key, value) {
          if (object$1(value)) {
              for (var name in value) {
                  appendAttribute(vnode, key, value[name], name);
              }
          }
      }, renderSlots = function (render) {
          var result = {};
          for (var name in render) {
              var children = [], components = [];
              render[name](children, components);
              // 就算是 undefined 也必须有值，用于覆盖旧值
              result[name] = children.length
                  ? {
                      vnodes: children,
                      components: components.length
                          ? components
                          : UNDEFINED
                  }
                  : UNDEFINED;
          }
          return result;
      }, 
      // <slot name="xx"/>
      renderSlotChildren = function (name, children) {
          dependencies[name] = children;
          var result = rootScope[name];
          if (result) {
              var vnodes = result.vnodes;
              var components = result.components;
              if (components) {
                  for (var i = 0, length = components.length; i < length; i++) {
                      components[i].parent = instance;
                  }
              }
              for (var i$1 = 0, length$1 = vnodes.length; i$1 < length$1; i$1++) {
                  children[children.length] = clone(vnodes[i$1]);
              }
              return TRUE;
          }
      }, 
      // {{> name}}
      renderPartial = function (name, scope, keypath, children, components, renderLocal, render) {
          if (renderLocal) {
              renderLocal(scope, keypath, children, components);
              return;
          }
          renderTemplate(render, scope, keypath, children, components);
      }, renderEach = function (holder, renderChildren, renderElse) {
          var keypath = holder.keypath;
          var value = holder.value;
          var length = 0, needKeypath = !!keypath, oldScopeStack = contextStack, currentKeypath = last(contextStack).keypath;
          if (array$1(value)) {
              length = value.length;
              for (var i = 0; i < length; i++) {
                  if (needKeypath) {
                      currentKeypath = keypath + RAW_DOT + i;
                      // slice + push 比直接 concat 快多了
                      contextStack = oldScopeStack.slice();
                      contextStack.push({
                          scope: value[i],
                          keypath: currentKeypath,
                      });
                  }
                  renderChildren(value[i], currentKeypath, length, i);
              }
          }
          else if (object$1(value)) {
              var keys$1 = keys(value);
              length = keys$1.length;
              for (var i$1 = 0; i$1 < length; i$1++) {
                  var key = keys$1[i$1];
                  if (needKeypath) {
                      // 这里 key 虽然可能为空，但也必须直接拼接
                      // 因为不拼接就变成了原来的 keypath，这样更是错的，
                      // 只能在使用上尽量避免 key 为空的用法
                      currentKeypath = keypath + RAW_DOT + key;
                      // slice + push 比直接 concat 快多了
                      contextStack = oldScopeStack.slice();
                      contextStack.push({
                          scope: value[key],
                          keypath: currentKeypath,
                      });
                  }
                  renderChildren(value[key], currentKeypath, length, key);
              }
          }
          if (contextStack !== oldScopeStack) {
              contextStack = oldScopeStack;
          }
          if (renderElse && length === 0) {
              renderElse();
          }
      }, renderRange = function (from, to, equal, renderChildren, renderElse) {
          var count = 0, length = 0, currentKeypath = last(contextStack).keypath;
          if (from < to) {
              length = to - from;
              if (equal) {
                  for (var i = from; i <= to; i++) {
                      renderChildren(i, currentKeypath, length, count++);
                  }
              }
              else {
                  for (var i$1 = from; i$1 < to; i$1++) {
                      renderChildren(i$1, currentKeypath, length, count++);
                  }
              }
          }
          else {
              length = from - to;
              if (equal) {
                  for (var i$2 = from; i$2 >= to; i$2--) {
                      renderChildren(i$2, currentKeypath, length, count++);
                  }
              }
              else {
                  for (var i$3 = from; i$3 > to; i$3--) {
                      renderChildren(i$3, currentKeypath, length, count++);
                  }
              }
          }
          if (renderElse && length === 0) {
              renderElse();
          }
      }, findKeypath = function (stack, index, name, lookup, isFirstCall) {
          var ref = stack[index];
          var scope = ref.scope;
          var keypath = ref.keypath;
          var currentKeypath = join(keypath, name), result = get(scope, name);
          if (result) {
              return setHolder(result.value, currentKeypath);
          }
          if (isFirstCall) {
              setHolder(UNDEFINED, currentKeypath);
          }
          if (lookup && index > 0) {
              return findKeypath(stack, index - 1, name, lookup);
          }
      }, lookupKeypath = function (getIndex, keypath, lookup, stack, filter) {
          var currentStack = stack || contextStack;
          return findKeypath(currentStack, getIndex(currentStack), keypath, lookup, TRUE) || (filter
              ? setHolder(filter)
              : holder);
      }, findProp = function (stack, index, name) {
          var ref = stack[index];
          var scope = ref.scope;
          var keypath = ref.keypath;
          var currentKeypath = keypath ? keypath + RAW_DOT + name : name;
          if (name in scope) {
              return setHolder(scope[name], currentKeypath);
          }
          if (index > 0) {
              return findProp(stack, index - 1, name);
          }
      }, lookupProp = function (name, value, stack, filter) {
          var currentStack = stack || contextStack, index = currentStack.length - 1;
          var ref = currentStack[index];
          var keypath = ref.keypath;
          var currentKeypath = keypath ? keypath + RAW_DOT + name : name;
          if (value !== UNDEFINED) {
              return setHolder(value, currentKeypath);
          }
          return index > 0 && findProp(currentStack, index - 1, name) || (filter
              ? setHolder(filter)
              : setHolder(UNDEFINED, currentKeypath));
      }, getThis = function (value, stack) {
          var currentStack = stack || contextStack;
          var ref = currentStack[currentStack.length - 1];
          var keypath = ref.keypath;
          return setHolder(value, keypath);
      }, getThisByIndex = function (getIndex, stack) {
          var currentStack = stack || contextStack;
          var ref = currentStack[getIndex(currentStack)];
          var scope = ref.scope;
          var keypath = ref.keypath;
          return setHolder(scope, keypath);
      }, getProp = function (name, value, stack) {
          var currentStack = stack || contextStack;
          var ref = currentStack[currentStack.length - 1];
          var keypath = ref.keypath;
          return setHolder(value, keypath ? keypath + RAW_DOT + name : name);
      }, getPropByIndex = function (getIndex, name, stack) {
          var currentStack = stack || contextStack;
          var ref = currentStack[getIndex(currentStack)];
          var scope = ref.scope;
          var keypath = ref.keypath;
          return setHolder(scope[name], keypath ? keypath + RAW_DOT + name : name);
      }, readKeypath = function (value, keypath) {
          var result = get(value, keypath);
          return setHolder(result ? result.value : UNDEFINED);
      }, setHolder = function (value, keypath) {
          if (value && func(value.get)) {
              value = value.get();
          }
          holder.keypath = keypath;
          holder.value = value;
          if (keypath !== UNDEFINED) {
              dependencies[keypath] = value;
          }
          return holder;
      }, renderTemplate = function (render, scope, keypath, children, components) {
          render(renderComposeVNode, appendAttribute, renderStyleString, renderStyleExpr, renderTransition, renderModel, renderEventMethod, renderEventName, renderDirective, renderSpread, renderSlots, renderSlotChildren, renderPartial, renderEach, renderRange, lookupKeypath, lookupProp, getThis, getThisByIndex, getProp, getPropByIndex, readKeypath, execute, setHolder, toString, textVNodeOperator, commentVNodeOperator, elementVNodeOperator, componentVNodeOperator, fragmentVNodeOperator, portalVNodeOperator, slotVNodeOperator, instance, filters, globalFilters, localPartials, partials, globalPartials, directives, globalDirectives, transitions, globalTransitions, scope, keypath, children, components);
      };
      renderTemplate(template, rootScope, rootKeypath, children, components);
      return children[0];
  }

  var guid = 0, 
  // 这里先写 IE9 支持的接口
  textContent = 'textContent', innerHTML = 'innerHTML', cssFloat = 'cssFloat', createEvent = function (event, node) {
      return event;
  }, findElement = function (selector) {
      var node = DOCUMENT.querySelector(selector);
      if (node) {
          return node;
      }
  }, addEventListener = function (node, type, listener) {
      node.addEventListener(type, listener, FALSE);
  }, removeEventListener = function (node, type, listener) {
      node.removeEventListener(type, listener, FALSE);
  }, 
  // IE9 不支持 classList
  addElementClass = function (node, className) {
      node.classList.add(className);
  }, removeElementClass = function (node, className) {
      node.classList.remove(className);
  };
  {
      if (DOCUMENT) {
          // 此时 document.body 不一定有值，比如 script 放在 head 里
          var testElement = DOCUMENT.documentElement;
          if (!(cssFloat in testElement.style)) {
              cssFloat = 'styleFloat';
          }
          if (!testElement.classList) {
              addElementClass = function (node, className) {
                  var classes = node.className.split(CHAR_WHITESPACE);
                  if (!has$2(classes, className)) {
                      push(classes, className);
                      node.className = join$1(classes, CHAR_WHITESPACE);
                  }
              };
              removeElementClass = function (node, className) {
                  var classes = node.className.split(CHAR_WHITESPACE);
                  if (remove$6(classes, className)) {
                      node.className = join$1(classes, CHAR_WHITESPACE);
                  }
              };
          }
          testElement = UNDEFINED;
      }
  }
  var CHAR_WHITESPACE = ' ', 
  /**
   * 绑定在 HTML 元素上的事件发射器
   */
  EVENT = '$event', 
  /**
   * 跟输入事件配套使用的事件
   */
  COMPOSITION_START = 'compositionstart', 
  /**
   * 跟输入事件配套使用的事件
   */
  COMPOSITION_END = 'compositionend', domain = 'http://www.w3.org/', namespaces = {
      svg: domain + '2000/svg',
      // xml: domain + 'XML/1998/namespace',
      // xlink: domain + '1999/xlink',
  }, nativeListenerCount = {}, nativeListeners = {}, customListeners = {}, specialEvents = {};
  specialEvents[EVENT_MODEL] = {
      on: function(node, listener) {
          var locked = FALSE;
          on(node, COMPOSITION_START, listener[COMPOSITION_START] = function () {
              locked = TRUE;
          });
          on(node, COMPOSITION_END, listener[COMPOSITION_END] = function (event) {
              locked = FALSE;
              listener(event);
          });
          addEventListener(node, EVENT_INPUT, listener[EVENT_INPUT] = function (event) {
              if (!locked) {
                  listener(event);
              }
          });
      },
      off: function(node, listener) {
          off(node, COMPOSITION_START, listener[COMPOSITION_START]);
          off(node, COMPOSITION_END, listener[COMPOSITION_END]);
          removeEventListener(node, EVENT_INPUT, listener[EVENT_INPUT]);
          listener[COMPOSITION_START] =
              listener[COMPOSITION_END] =
                  listener[EVENT_INPUT] = UNDEFINED;
      }
  };
  function getBodyElement() {
      return DOCUMENT.body;
  }
  function createElement(tag, isSvg) {
      return isSvg
          ? DOCUMENT.createElementNS(namespaces.svg, tag)
          : DOCUMENT.createElement(tag);
  }
  function createText(text) {
      return DOCUMENT.createTextNode(text);
  }
  function createComment(text) {
      return DOCUMENT.createComment(text);
  }
  function getProp(node, name) {
      return node[name];
  }
  function setProp(node, name, value) {
      node[name] = value;
  }
  function removeProp(node, name) {
      node[name] = UNDEFINED;
  }
  function getAttr(node, name) {
      var value = node.getAttribute(name);
      if (value != NULL) {
          return value;
      }
  }
  function setAttr(node, name, value) {
      node.setAttribute(name, value);
  }
  function removeAttr(node, name) {
      node.removeAttribute(name);
  }
  // 这里不传 HTMLElement 是因为外面会在循环里调用，频繁读取 node.style 挺浪费性能的
  function setStyle(style, name, value) {
      if (value == NULL) {
          style[name] = EMPTY_STRING;
          return;
      }
      style[name === 'float' ? cssFloat : name] = value;
  }
  // 这里不传 HTMLElement 是因为外面会在循环里调用，频繁读取 node.style 挺浪费性能的
  function removeStyle(style, name) {
      style[name] = EMPTY_STRING;
  }
  function before(parentNode, node, beforeNode) {
      parentNode.insertBefore(node, beforeNode);
  }
  function append(parentNode, node) {
      parentNode.appendChild(node);
  }
  function replace(parentNode, node, oldNode) {
      parentNode.replaceChild(node, oldNode);
  }
  function remove(parentNode, node) {
      parentNode.removeChild(node);
  }
  function parent(node) {
      var parentNode = node.parentNode;
      if (parentNode) {
          return parentNode;
      }
  }
  function next(node) {
      var nextSibling = node.nextSibling;
      if (nextSibling) {
          return nextSibling;
      }
  }
  var find = findElement;
  function tag(node) {
      if (node.nodeType === 1) {
          return lower(node.tagName);
      }
  }
  function getText(node) {
      return node[textContent];
  }
  function setText(node, text, isStyle, isOption) {
      {
          node[textContent] = text;
      }
  }
  function getHtml(node) {
      return node[innerHTML];
  }
  function setHtml(node, html, isStyle, isOption) {
      {
          node[innerHTML] = html;
      }
  }
  var addClass = addElementClass;
  var removeClass = removeElementClass;
  function on(node, type, listener) {
      var nativeKey = node[EVENT] || (node[EVENT] = ++guid), nativeListenerMap = nativeListeners[nativeKey] || (nativeListeners[nativeKey] = {}), customListenerMap = customListeners[nativeKey] || (customListeners[nativeKey] = {}), customListenerList = customListenerMap[type] || (customListenerMap[type] = []);
      // 一个元素，相同的事件，只注册一个 native listener
      if (!nativeListenerMap[type]) {
          // 特殊事件
          var special = specialEvents[type], 
          // 唯一的原生监听器
          nativeListener = function (event) {
              var customEvent;
              if (CustomEvent.is(event)) {
                  customEvent = event;
                  if (customEvent.type !== type) {
                      customEvent.type = type;
                  }
              }
              else {
                  customEvent = new CustomEvent(type, createEvent(event));
              }
              // 避免遍历过程中，数组发生变化，比如增删了
              var listenerList = customListenerList.slice();
              for (var i = 0, length = listenerList.length; i < length; i++) {
                  listenerList[i](customEvent, UNDEFINED, TRUE);
              }
          };
          nativeListenerMap[type] = nativeListener;
          if (nativeListenerCount[nativeKey]) {
              nativeListenerCount[nativeKey]++;
          }
          else {
              nativeListenerCount[nativeKey] = 1;
          }
          if (special) {
              special.on(node, nativeListener);
          }
          else {
              addEventListener(node, type, nativeListener);
          }
      }
      customListenerList.push(listener);
  }
  function off(node, type, listener) {
      var nativeKey = node[EVENT], nativeListenerMap = nativeListeners[nativeKey], customListenerMap = customListeners[nativeKey], customListenerList = customListenerMap && customListenerMap[type];
      if (customListenerList) {
          remove$6(customListenerList, listener);
          if (!customListenerList.length) {
              customListenerList = UNDEFINED;
              delete customListenerMap[type];
          }
      }
      // 如果注册的 type 事件都解绑了，则去掉原生监听器
      if (nativeListenerMap && nativeListenerMap[type] && !customListenerList) {
          var special = specialEvents[type], nativeListener = nativeListenerMap[type];
          if (special) {
              special.off(node, nativeListener);
          }
          else {
              removeEventListener(node, type, nativeListener);
          }
          delete nativeListenerMap[type];
          if (nativeListenerCount[nativeKey]) {
              nativeListenerCount[nativeKey]--;
          }
      }
      if (!nativeListenerCount[nativeKey]) {
          node[EVENT] = UNDEFINED;
          delete nativeListeners[nativeKey];
          delete customListeners[nativeKey];
      }
  }
  function addSpecialEvent(type, hooks) {
      specialEvents[type] = hooks;
  }

  var domApi = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getBodyElement: getBodyElement,
    createElement: createElement,
    createText: createText,
    createComment: createComment,
    getProp: getProp,
    setProp: setProp,
    removeProp: removeProp,
    getAttr: getAttr,
    setAttr: setAttr,
    removeAttr: removeAttr,
    setStyle: setStyle,
    removeStyle: removeStyle,
    before: before,
    append: append,
    replace: replace,
    remove: remove,
    parent: parent,
    next: next,
    find: find,
    tag: tag,
    getText: getText,
    setText: setText,
    getHtml: getHtml,
    setHtml: setHtml,
    addClass: addClass,
    removeClass: removeClass,
    on: on,
    off: off,
    addSpecialEvent: addSpecialEvent
  });

  /**
   * 计算属性
   *
   * 可配置 cache、deps、get、set 等
   */
  var Computed = function(keypath, sync, cache, deps, observer, getter, setter) {
      var instance = this;
      instance.keypath = keypath;
      instance.cache = cache;
      instance.deps = deps;
      instance.observer = observer;
      instance.getter = getter;
      instance.setter = setter;
      instance.watcherOptions = {
          sync: sync,
          watcher: instance.watcher = function ($0, $1, $2) {
              // 计算属性的依赖变了会走进这里
              var oldValue = instance.value, newValue = instance.get(TRUE);
              if (newValue !== oldValue) {
                  observer.diff(keypath, newValue, oldValue);
              }
          }
      };
      // 如果 deps 是空数组，Observer 会传入 undefined
      // 因此这里直接判断即可
      if (deps) {
          instance.fixed = TRUE;
          for (var i = 0, length = deps.length; i < length; i++) {
              observer.watch(deps[i], instance.watcherOptions);
          }
      }
  };
  /**
   * 读取计算属性的值
   *
   * @param force 是否强制刷新缓存
   */
  Computed.prototype.get = function (force) {
      var instance = this;
          var getter = instance.getter;
          var deps = instance.deps;
          var observer = instance.observer;
          var watcher = instance.watcher;
          var watcherOptions = instance.watcherOptions;
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
                  for (var i = deps.length - 1; i >= 0; i--) {
                      observer.unwatch(deps[i], watcher);
                  }
              }
              // 惰性初始化
              instance.unique = createPureObject();
              // 开始收集新的依赖
              var lastComputed = Computed.current;
              Computed.current = instance;
              instance.value = getter();
              // 绑定新的依赖
              var newDeps = instance.unique.keys();
              for (var i$1 = 0, length = newDeps.length; i$1 < length; i$1++) {
                  observer.watch(newDeps[i$1], watcherOptions);
              }
              instance.deps = newDeps;
              // 取值完成，恢复原值
              Computed.current = lastComputed;
          }
      }
      return instance.value;
  };
  Computed.prototype.set = function (value) {
      var ref = this;
          var setter = ref.setter;
      if (setter) {
          setter(value);
      }
  };
  /**
   * 添加依赖
   *
   * 这里只是为了保证依赖唯一
   *
   * @param dep
   */
  Computed.prototype.add = function (dep) {
      this.unique.set(dep, TRUE);
  };

  function readValue (source, keypath) {
      if (source == NULL || keypath === EMPTY_STRING) {
          return source;
      }
      var result = get(source, keypath);
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
      var newIsString = string$1(newValue), oldIsString = string$1(oldValue);
      if (newIsString || oldIsString) {
          callback(RAW_LENGTH, newIsString ? newValue.length : UNDEFINED, oldIsString ? oldValue.length : UNDEFINED);
          return TRUE;
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
      var newIsArray = array$1(newValue), oldIsArray = array$1(oldValue);
      if (newIsArray || oldIsArray) {
          var newLength = newIsArray ? newValue.length : UNDEFINED, oldLength = oldIsArray ? oldValue.length : UNDEFINED;
          callback(RAW_LENGTH, newLength, oldLength);
          for (var i = 0, length = Math.max(newLength || 0, oldLength || 0); i < length; i++) {
              callback(
              // 把 number 转成 string
              EMPTY_STRING + i, newIsArray ? newValue[i] : UNDEFINED, oldIsArray ? oldValue[i] : UNDEFINED);
          }
          return TRUE;
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
      var newIsObject = object$1(newValue), oldIsObject = object$1(oldValue);
      if (newIsObject || oldIsObject) {
          var diffed = createPureObject(), newObject = newIsObject ? newValue : EMPTY_OBJECT, oldObject = oldIsObject ? oldValue : EMPTY_OBJECT;
          if (newIsObject) {
              for (var key in newObject) {
                  var value = newObject[key];
                  if (value !== oldObject[key]) {
                      // 保证遍历 oldObject 时不会再次触发
                      diffed.set(key, TRUE);
                      callback(key, value, oldObject[key]);
                  }
              }
          }
          if (oldIsObject) {
              for (var key$1 in oldObject) {
                  var value$1 = oldObject[key$1];
                  if (diffed.get(key$1) === UNDEFINED && value$1 !== newObject[key$1]) {
                      callback(key$1, newObject[key$1], value$1);
                  }
              }
          }
      }
  }

  /**
   * 递归对比
   */
  function diffRecursion(keypath, newValue, oldValue, fuzzyKeypaths, fuzzyKeypathLength, callback) {
      var diff = function (subKey, subNewValue, subOldValue) {
          if (subNewValue !== subOldValue) {
              var newKeypath = join(keypath, subKey);
              for (var i = 0; i < fuzzyKeypathLength; i++) {
                  var fuzzyKeypath = fuzzyKeypaths[i];
                  if (matchFuzzy(newKeypath, fuzzyKeypath) !== UNDEFINED) {
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
      var fuzzyKeypaths;
      // 遍历监听的 keypath，如果未被监听，则无需触发任何事件
      for (var watchKeypath in watcher) {
          // 模糊监听，如 users.*.name
          if (isFuzzy(watchKeypath)) {
              // 如果当前修改的是 users.0 整个对象
              // users.0 和 users.*.name 无法匹配
              // 此时要知道设置 users.0 到底会不会改变 users.*.name 需要靠递归了
              // 如果匹配，则无需递归
              if (matchFuzzy(keypath, watchKeypath) !== UNDEFINED) {
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
              var length = match(watchKeypath, keypath);
              if (length >= 0) {
                  var subKeypath = slice(watchKeypath, length), subNewValue = readValue(newValue, subKeypath), subOldValue = readValue(oldValue, subKeypath);
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
  var optionsHolder = {
      watcher: EMPTY_FUNCTION,
  };
  /**
   * 格式化 watch options
   *
   * @param options
   */
  function formatWatcherOptions (options, immediate) {
      var isWatcher = func(options);
      if (isWatcher) {
          optionsHolder.watcher = options;
          optionsHolder.immediate = immediate === TRUE;
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
  var Observer = function(data, context, nextTask) {
      var instance = this;
      instance.data = data || {};
      instance.context = context || instance;
      instance.nextTask = nextTask || new NextTask();
      instance.syncEmitter = new Emitter();
      instance.asyncEmitter = new Emitter();
      instance.asyncOldValues = {};
      instance.asyncKeypaths = {};
  };
  /**
   * 获取数据
   *
   * @param keypath
   * @param defaultValue
   * @param depIgnore
   * @return
   */
  Observer.prototype.get = function (keypath, defaultValue, depIgnore) {
      var instance = this, currentComputed = Computed.current;
          var data = instance.data;
          var computed = instance.computed;
      // 传入 '' 获取整个 data
      if (keypath === EMPTY_STRING) {
          return data;
      }
      // 调用 get 时，外面想要获取依赖必须设置是谁在收集依赖
      // 如果没设置，则跳过依赖收集
      if (currentComputed && !depIgnore) {
          currentComputed.add(keypath);
      }
      var result;
      if (computed) {
          result = get(computed, keypath);
      }
      if (!result) {
          result = get(data, keypath);
      }
      return result ? result.value : defaultValue;
  };
  /**
   * 更新数据
   *
   * @param keypath
   * @param value
   */
  Observer.prototype.set = function (keypath, value) {
      var instance = this;
          var data = instance.data;
          var computed = instance.computed;
          var setValue = function (keypath, newValue) {
          var oldValue = instance.get(keypath);
          if (newValue === oldValue) {
              return;
          }
          var next;
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
          for (var key in keypath) {
              setValue(key, keypath[key]);
          }
      }
  };
  /**
   * 同步调用的 diff，用于触发 syncEmitter，以及唤醒 asyncEmitter
   *
   * @param keypath
   * @param newValue
   * @param oldValue
   */
  Observer.prototype.diff = function (keypath, newValue, oldValue) {
      var instance = this;
          var syncEmitter = instance.syncEmitter;
          var asyncEmitter = instance.asyncEmitter;
          var asyncOldValues = instance.asyncOldValues;
          var asyncKeypaths = instance.asyncKeypaths;
          var isRecursive = codeAt(keypath) !== 36;
      diffWatcher(keypath, newValue, oldValue, syncEmitter.listeners, isRecursive, function (watchKeypath, keypath, newValue, oldValue) {
          syncEmitter.fire({
              type: watchKeypath,
              ns: EMPTY_STRING,
          }, [
              newValue,
              oldValue,
              keypath ]);
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
          var options = asyncEmitter.listeners[watchKeypath];
          for (var i = 0, length = options.length; i < length; i++) {
              options[i].count++;
          }
          if (!asyncKeypaths[keypath]) {
              asyncOldValues[keypath] = oldValue;
              asyncKeypaths[keypath] = {};
          }
          asyncKeypaths[keypath][watchKeypath] = TRUE;
          if (!instance.pending) {
              instance.pending = TRUE;
              instance.nextTask.append(function () {
                  if (instance.pending) {
                      instance.diffAsync();
                  }
              });
          }
      });
  };
  /**
   * 异步触发的 diff
   */
  Observer.prototype.diffAsync = function () {
      var instance = this;
          var asyncEmitter = instance.asyncEmitter;
          var asyncOldValues = instance.asyncOldValues;
          var asyncKeypaths = instance.asyncKeypaths;
      instance.pending = UNDEFINED;
      instance.asyncOldValues = {};
      instance.asyncKeypaths = {};
      var loop = function ( keypath ) {
          var args = [
              instance.get(keypath),
              asyncOldValues[keypath],
              keypath ], keypaths = asyncKeypaths[keypath], hasChange = args[0] !== args[1], filterWatcher = function (event, args, options) {
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
          for (var watchKeypath in keypaths) {
              asyncEmitter.fire({
                  type: watchKeypath,
                  ns: EMPTY_STRING,
              }, args, filterWatcher);
          }
      };

          for (var keypath in asyncOldValues) loop( keypath );
  };
  /**
   * 添加计算属性
   *
   * @param keypath
   * @param computed
   */
  Observer.prototype.addComputed = function (keypath, options) {
      var instance = this, context = instance.context, cache = TRUE, sync = TRUE, deps, getter, setter;
      // 这里用 bind 方法转换一下调用的 this
      // 还有一个好处，它比 call(context) 速度稍快一些
      if (func(options)) {
          getter = options.bind(context);
      }
      else if (object$1(options)) {
          var computedOptions = options;
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
          var computed = new Computed(keypath, sync, cache, deps, instance, getter, setter);
          if (!instance.computed) {
              instance.computed = {};
          }
          instance.computed[keypath] = computed;
          return computed;
      }
  };
  /**
   * 移除计算属性
   *
   * @param keypath
   */
  Observer.prototype.removeComputed = function (keypath) {
      var instance = this;
          var computed = instance.computed;
      if (computed && has(computed, keypath)) {
          delete computed[keypath];
      }
  };
  /**
   * 监听数据变化
   *
   * @param keypath
   * @param watcher
   * @param immediate
   */
  Observer.prototype.watch = function (keypath, watcher, immediate) {
      var instance = this;
          var context = instance.context;
          var syncEmitter = instance.syncEmitter;
          var asyncEmitter = instance.asyncEmitter;
          var addWatcher = function (keypath, options) {
          var emitter = options.sync ? syncEmitter : asyncEmitter, 
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
              options.watcher.call(context, instance.get(keypath), UNDEFINED, keypath);
          }
      };
      if (string$1(keypath)) {
          addWatcher(keypath, formatWatcherOptions(watcher, immediate));
      }
      else {
          for (var key in keypath) {
              addWatcher(key, formatWatcherOptions(keypath[key]));
          }
      }
  };
  /**
   * 取消监听数据变化
   *
   * @param keypath
   * @param watcher
   */
  Observer.prototype.unwatch = function (keypath, watcher) {
      var filter = {
          ns: EMPTY_STRING,
          listener: watcher,
      };
      this.syncEmitter.off(keypath, filter);
      this.asyncEmitter.off(keypath, filter);
  };
  /**
   * 取反 keypath 对应的数据
   *
   * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
   *
   * @param keypath
   * @return 取反后的布尔值
   */
  Observer.prototype.toggle = function (keypath) {
      var value = !this.get(keypath);
      this.set(keypath, value);
      return value;
  };
  /**
   * 递增 keypath 对应的数据
   *
   * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
   *
   * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
   * @param step 步进值，默认是 1
   * @param max 可以递增到的最大值，默认不限制
   */
  Observer.prototype.increase = function (keypath, step, max) {
      var value = toNumber(this.get(keypath), 0) + (step || 1);
      if (!number(max) || value <= max) {
          this.set(keypath, value);
          return value;
      }
  };
  /**
   * 递减 keypath 对应的数据
   *
   * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
   *
   * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
   * @param step 步进值，默认是 1
   * @param min 可以递减到的最小值，默认不限制
   */
  Observer.prototype.decrease = function (keypath, step, min) {
      var value = toNumber(this.get(keypath), 0) - (step || 1);
      if (!number(min) || value >= min) {
          this.set(keypath, value);
          return value;
      }
  };
  /**
   * 在数组指定位置插入元素
   *
   * @param keypath
   * @param item
   * @param index
   */
  Observer.prototype.insert = function (keypath, item, index) {
      var list = this.get(keypath);
      list = array$1(list) ? list.slice() : [];
      var length = list.length;
      if (index === TRUE || index === length) {
          list.push(item);
      }
      else if (index === FALSE || index === 0) {
          list.unshift(item);
      }
      else if (index > 0 && index < length) {
          list.splice(index, 0, item);
      }
      else {
          return;
      }
      this.set(keypath, list);
      return TRUE;
  };
  /**
   * 在数组尾部添加元素
   *
   * @param keypath
   * @param item
   */
  Observer.prototype.append = function (keypath, item) {
      return this.insert(keypath, item, TRUE);
  };
  /**
   * 在数组首部添加元素
   *
   * @param keypath
   * @param item
   */
  Observer.prototype.prepend = function (keypath, item) {
      return this.insert(keypath, item, FALSE);
  };
  /**
   * 通过索引移除数组中的元素
   *
   * @param keypath
   * @param index
   */
  Observer.prototype.removeAt = function (keypath, index) {
      var list = this.get(keypath);
      if (array$1(list)
          && index >= 0
          && index < list.length) {
          list = list.slice();
          list.splice(index, 1);
          this.set(keypath, list);
          return TRUE;
      }
  };
  /**
   * 直接移除数组中的元素
   *
   * @param keypath
   * @param item
   */
  Observer.prototype.remove = function (keypath, item) {
      var list = this.get(keypath);
      if (array$1(list)) {
          list = list.slice();
          if (remove$6(list, item)) {
              this.set(keypath, list);
              return TRUE;
          }
      }
  };
  /**
   * 拷贝任意数据，支持深拷贝
   *
   * @param data
   * @param deep
   */
  Observer.prototype.copy = function (data, deep) {
      return copy(data, deep);
  };
  /**
   * 销毁
   */
  Observer.prototype.destroy = function () {
      var instance = this;
      instance.syncEmitter.off();
      instance.asyncEmitter.off();
      instance.nextTask.clear();
      instance.data = {};
  };

  var LifeCycle = function() {
      this.$emitter = new Emitter();
  };
  LifeCycle.prototype.fire = function (component, type, data) {
      this.$emitter.fire(type, [
          component,
          data ]);
  };
  LifeCycle.prototype.on = function (type, listener) {
      this.$emitter.on(type, listener);
      return this;
  };
  LifeCycle.prototype.off = function (type, listener) {
      this.$emitter.off(type, listener);
      return this;
  };
  var globalDirectives = {}, globalTransitions = {}, globalComponents = {}, globalPartials = {}, globalFilters = {}, selectorPattern = /^[#.][-\w+]+$/, lifeCycle = new LifeCycle(), markDirty = function () {
      this.$isDirty = TRUE;
  };
  var Yox = function(options) {
      var instance = this, $options = options || EMPTY_OBJECT;
      // 为了冒泡 HOOK_BEFORE_CREATE 事件，必须第一时间创建 emitter
      // 监听各种事件
      // 支持命名空间
      instance.$emitter = new Emitter(TRUE);
      if ($options.events) {
          instance.on($options.events);
      }
      {
          // 当前组件的直接父组件
          if ($options.parent) {
              instance.$parent = $options.parent;
          }
          // 建立好父子连接后，立即触发钩子
          var beforeCreateHook = $options[HOOK_BEFORE_CREATE];
          if (beforeCreateHook) {
              beforeCreateHook.call(instance, $options);
          }
          lifeCycle.fire(instance, HOOK_BEFORE_CREATE, {
              options: $options,
          });
      }
      var data = $options.data;
      var props = $options.props;
      var vnode = $options.vnode;
      var propTypes = $options.propTypes;
      var computed = $options.computed;
      var methods = $options.methods;
      var watchers = $options.watchers;
      var extensions = $options.extensions;
      instance.$options = $options;
      if (extensions) {
          extend(instance, extensions);
      }
      // 数据源，默认值仅在创建组件时启用
      var source = props ? copy(props) : {};
      {
          if (propTypes) {
              each(propTypes, function (rule, key) {
                  var value = source[key];
                  if (value === UNDEFINED) {
                      value = rule.value;
                      if (value !== UNDEFINED) {
                          source[key] = rule.type === RAW_FUNCTION
                              ? value
                              : func(value)
                                  ? value()
                                  : value;
                      }
                  }
              });
          }
      }
      // 先放 props
      // 当 data 是函数时，可以通过 this.get() 获取到外部数据
      var observer = instance.$observer = new Observer(source, instance, instance.$nextTask = new NextTask({
          afterTask: function() {
              if (instance.$isDirty) {
                  instance.$isDirty = UNDEFINED;
                  instance.update(instance.render(), instance.$vnode);
              }
          }
      }));
      if (computed) {
          each(computed, function (options, keypath) {
              observer.addComputed(keypath, options);
          });
      }
      var extend$1 = func(data) ? data.call(instance, options) : data;
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
      {
          var placeholder = UNDEFINED;
          var el = $options.el;
          var root = $options.root;
          var model = $options.model;
          var context = $options.context;
          var replace = $options.replace;
          var template = $options.template;
          var transitions = $options.transitions;
          var components = $options.components;
          var directives = $options.directives;
          var partials = $options.partials;
          var filters = $options.filters;
          var slots = $options.slots;
          if (model) {
              instance.$model = model;
          }
          // 把 slots 放进数据里，方便 get
          if (slots) {
              extend(source, slots);
          }
          // 检查 template
          if (string$1(template)) {
              // 传了选择器，则取对应元素的 html
              if (selectorPattern.test(template)) {
                  placeholder = find(template);
                  if (placeholder) {
                      template = getHtml(placeholder);
                      placeholder = UNDEFINED;
                  }
              }
          }
          // 检查 el
          if (el) {
              if (string$1(el)) {
                  var selector = el;
                  if (selectorPattern.test(selector)) {
                      placeholder = find(selector);
                  }
              }
              else {
                  placeholder = el;
              }
              if (!replace) {
                  append(placeholder, placeholder = createComment(EMPTY_STRING));
              }
          }
          // 根组件
          if (root) {
              instance.$root = root;
          }
          // 当前组件是被哪个组件渲染出来的
          // 因为有 slot 机制，$context 不一定等于 $parent
          if (context) {
              instance.$context = context;
          }
          setFlexibleOptions(instance, RAW_TRANSITION, transitions);
          setFlexibleOptions(instance, RAW_COMPONENT, components);
          setFlexibleOptions(instance, RAW_DIRECTIVE, directives);
          setFlexibleOptions(instance, RAW_PARTIAL, partials);
          setFlexibleOptions(instance, RAW_FILTER, filters);
          if (template) {
              if (watchers) {
                  observer.watch(watchers);
              }
              {
                  var afterCreateHook = $options[HOOK_AFTER_CREATE];
                  if (afterCreateHook) {
                      afterCreateHook.call(instance);
                  }
                  lifeCycle.fire(instance, HOOK_AFTER_CREATE);
              }
              // 编译模板
              // 在开发阶段，template 是原始的 html 模板
              // 在产品阶段，template 是编译后的渲染函数
              // 当然，具体是什么需要外部自己控制
              instance.$template = string$1(template)
                  ? Yox.compile(template)
                  : template;
              if (!vnode) {
                  vnode = create(domApi, placeholder, instance);
              }
              instance.update(instance.render(), vnode);
              return;
          }
      }
      if (watchers) {
          observer.watch(watchers);
      }
      {
          var afterCreateHook$1 = $options[HOOK_AFTER_CREATE];
          if (afterCreateHook$1) {
              afterCreateHook$1.call(instance);
          }
          lifeCycle.fire(instance, HOOK_AFTER_CREATE);
      }
  };
  /**
   * 定义组件对象
   */
  Yox.define = function (options) {
      return options;
  };
  /**
   * 安装插件
   *
   * 插件必须暴露 install 方法
   */
  Yox.use = function (plugin) {
      plugin.install(Yox);
  };
  /**
   * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
   */
  Yox.nextTick = function (task, context) {
      NextTask.shared().append(task, context);
  };
  /**
   * 编译模板，暴露出来是为了打包阶段的模板预编译
   */
  Yox.compile = function (template, stringify) {
      {
          return template;
      }
  };
  /**
   * 注册全局指令
   */
  Yox.directive = function (name, directive$1) {
      {
          if (string$1(name) && !directive$1) {
              return getResource(globalDirectives, name);
          }
          setResource(globalDirectives, name, directive$1);
      }
  };
  /**
   * 注册全局过渡动画
   */
  Yox.transition = function (name, transition$1) {
      {
          if (string$1(name) && !transition$1) {
              return getResource(globalTransitions, name);
          }
          setResource(globalTransitions, name, transition$1);
      }
  };
  /**
   * 注册全局组件
   */
  Yox.component = function (name, component$1) {
      {
          if (string$1(name) && !component$1) {
              return getResource(globalComponents, name);
          }
          setResource(globalComponents, name, component$1);
      }
  };
  /**
   * 注册全局子模板
   */
  Yox.partial = function (name, partial$1) {
      {
          if (string$1(name) && !partial$1) {
              return getResource(globalPartials, name);
          }
          setResource(globalPartials, name, partial$1, Yox.compile);
      }
  };
  /**
   * 注册全局过滤器
   */
  Yox.filter = function (name, filter$1) {
      {
          if (string$1(name) && !filter$1) {
              return getResource(globalFilters, name);
          }
          setResource(globalFilters, name, filter$1);
      }
  };
  /**
   * 取值
   */
  Yox.prototype.get = function (keypath, defaultValue) {
      return this.$observer.get(keypath, defaultValue);
  };
  /**
   * 设值
   */
  Yox.prototype.set = function (keypath, value) {
      // 组件经常有各种异步改值，为了避免组件销毁后依然调用 set
      // 这里判断一下，至于其他方法的异步调用就算了，业务自己控制吧
      var ref = this;
          var $observer = ref.$observer;
      if ($observer) {
          $observer.set(keypath, value);
      }
  };
  /**
   * 监听事件，支持链式调用
   */
  Yox.prototype.on = function (type, listener) {
      addEvents(this, type, listener);
      return this;
  };
  /**
   * 监听一次事件，支持链式调用
   */
  Yox.prototype.once = function (type, listener) {
      addEvents(this, type, listener, TRUE);
      return this;
  };
  /**
   * 取消监听事件，支持链式调用
   */
  Yox.prototype.off = function (type, listener) {
      this.$emitter.off(type, listener);
      return this;
  };
  /**
   * 发射事件
   */
  Yox.prototype.fire = function (type, data, downward) {
      // 外部为了使用方便，fire(type) 或 fire(type, data) 就行了
      // 内部为了保持格式统一
      // 需要转成 Event，这样还能知道 target 是哪个组件
      var instance = this;
          var $emitter = instance.$emitter;
          var $parent = instance.$parent;
          var $children = instance.$children;
      // 生成事件对象
      var event;
      if (CustomEvent.is(type)) {
          event = type;
      }
      else if (string$1(type)) {
          event = new CustomEvent(type);
      }
      else {
          var emitterEvent = type;
          event = new CustomEvent(emitterEvent.type);
          event.ns = emitterEvent.ns;
      }
      // 先解析出命名空间，避免每次 fire 都要解析
      if (event.ns === UNDEFINED) {
          var emitterEvent$1 = $emitter.toEvent(event.type);
          event.type = emitterEvent$1.type;
          event.ns = emitterEvent$1.ns;
      }
      // 告诉外部是谁发出的事件
      if (!event.target) {
          event.target = instance;
      }
      // 事件参数列表
      var args = [event], 
      // 事件是否正常结束（未被停止冒泡）
      isComplete;
      // 比如 fire('name', true) 直接向下发事件
      if (object$1(data)) {
          push(args, data);
      }
      else if (data === TRUE) {
          downward = TRUE;
      }
      // 向上发事件会经过自己
      // 如果向下发事件再经过自己，就产生了一次重叠
      // 这是没有必要的，而且会导致向下发事件时，外部能接收到该事件，但我们的本意只是想让子组件接收到事件
      isComplete = downward && event.target === instance
          ? TRUE
          : $emitter.fire(event, args);
      if (isComplete) {
          if (downward) {
              if ($children) {
                  event.phase = CustomEvent.PHASE_DOWNWARD;
                  each$2($children, function (child) {
                      return isComplete = child.fire(event, data, TRUE);
                  });
              }
          }
          else if ($parent) {
              event.phase = CustomEvent.PHASE_UPWARD;
              isComplete = $parent.fire(event, data);
          }
      }
      return isComplete;
  };
  /**
   * 监听数据变化，支持链式调用
   */
  Yox.prototype.watch = function (keypath, watcher, immediate) {
      this.$observer.watch(keypath, watcher, immediate);
      return this;
  };
  /**
   * 取消监听数据变化，支持链式调用
   */
  Yox.prototype.unwatch = function (keypath, watcher) {
      this.$observer.unwatch(keypath, watcher);
      return this;
  };
  /**
   * 加载组件，组件可以是同步或异步，最后会调用 callback
   *
   * @param name 组件名称
   * @param callback 组件加载成功后的回调
   */
  Yox.prototype.loadComponent = function (name, callback) {
      {
          if (!loadComponent(this.$components, name, callback)) {
              {
                  loadComponent(globalComponents, name, callback);
              }
          }
      }
  };
  /**
   * 创建子组件
   *
   * @param options 组件配置
   * @param vnode 虚拟节点
   */
  Yox.prototype.createComponent = function (options, vnode) {
      {
          var instance = this;
          options = copy(options);
          options.root = instance.$root || instance;
          options.parent = instance;
          options.context = vnode.context;
          options.vnode = vnode;
          options.replace = TRUE;
          var props = vnode.props;
              var slots = vnode.slots;
              var model = vnode.model;
          if (model) {
              if (!props) {
                  props = {};
              }
              var key = options.model || MODEL_PROP_DEFAULT;
              props[key] = model.value;
              options.model = key;
          }
          if (props) {
              options.props = props;
          }
          if (slots) {
              options.slots = slots;
          }
          var child = new Yox(options);
          push(instance.$children || (instance.$children = []), child);
          var node = child.$el;
          if (node) {
              vnode.node = node;
          }
          return child;
      }
  };
  /**
   * 注册当前组件级别的指令
   */
  Yox.prototype.directive = function (name, directive$1) {
      {
          var instance = this;
              var $directives = instance.$directives;
          if (string$1(name) && !directive$1) {
              return getResource($directives, name, Yox.directive);
          }
          setResource($directives || (instance.$directives = {}), name, directive$1);
      }
  };
  /**
   * 注册当前组件级别的过渡动画
   */
  Yox.prototype.transition = function (name, transition$1) {
      {
          var instance = this;
              var $transitions = instance.$transitions;
          if (string$1(name) && !transition$1) {
              return getResource($transitions, name, Yox.transition);
          }
          setResource($transitions || (instance.$transitions = {}), name, transition$1);
      }
  };
  /**
   * 注册当前组件级别的组件
   */
  Yox.prototype.component = function (name, component$1) {
      {
          var instance = this;
              var $components = instance.$components;
          if (string$1(name) && !component$1) {
              return getResource($components, name, Yox.component);
          }
          setResource($components || (instance.$components = {}), name, component$1);
      }
  };
  /**
   * 注册当前组件级别的子模板
   */
  Yox.prototype.partial = function (name, partial$1) {
      {
          var instance = this;
              var $partials = instance.$partials;
          if (string$1(name) && !partial$1) {
              return getResource($partials, name, Yox.partial);
          }
          setResource($partials || (instance.$partials = {}), name, partial$1, Yox.compile);
      }
  };
  /**
   * 注册当前组件级别的过滤器
   */
  Yox.prototype.filter = function (name, filter$1) {
      {
          var instance = this;
              var $filters = instance.$filters;
          if (string$1(name) && !filter$1) {
              return getResource($filters, name, Yox.filter);
          }
          setResource($filters || (instance.$filters = {}), name, filter$1);
      }
  };
  /**
   * 对于某些特殊场景，修改了数据，但是模板的依赖中并没有这一项
   * 而你非常确定需要更新模板，强制刷新正是你需要的
   */
  Yox.prototype.forceUpdate = function (props) {
      {
          var instance = this;
              var $options = instance.$options;
              var $vnode = instance.$vnode;
              var $nextTask = instance.$nextTask;
          if ($vnode) {
              if (props) {
                  var beforePropsUpdateHook = $options[HOOK_BEFORE_PROPS_UPDATE];
                  if (beforePropsUpdateHook) {
                      beforePropsUpdateHook.call(instance, props);
                  }
                  instance.set(props);
              }
              // 当前可能正在进行下一轮更新
              $nextTask.run();
              // 没有更新模板，强制刷新
              if (!props && $vnode === instance.$vnode) {
                  instance.update(instance.render(), $vnode);
              }
          }
      }
  };
  /**
   * 把模板抽象语法树渲染成 virtual dom
   */
  Yox.prototype.render = function () {
      {
          var instance = this;
              var $observer = instance.$observer;
              var $dependencies = instance.$dependencies;
              var oldDependencies = $dependencies || EMPTY_OBJECT, dependencies = {}, vnode = render(instance, instance.$template, dependencies, $observer.data, $observer.computed, instance.$filters, globalFilters, instance.$partials, globalPartials, instance.$directives, globalDirectives, instance.$transitions, globalTransitions);
          for (var key in dependencies) {
              if (!(key in oldDependencies)) {
                  $observer.watch(key, markDirty);
              }
          }
          if ($dependencies) {
              for (var key$1 in $dependencies) {
                  if (!(key$1 in dependencies)) {
                      $observer.unwatch(key$1, markDirty);
                  }
              }
          }
          instance.$dependencies = dependencies;
          return vnode;
      }
  };
  /**
   * 更新 virtual dom
   *
   * @param vnode
   * @param oldVNode
   */
  Yox.prototype.update = function (vnode, oldVNode) {
      {
          var instance = this;
              var $vnode = instance.$vnode;
              var $options = instance.$options;
              var afterHookName;
          if ($vnode) {
              var beforeUpdateHook = $options[HOOK_BEFORE_UPDATE];
              if (beforeUpdateHook) {
                  beforeUpdateHook.call(instance);
              }
              lifeCycle.fire(instance, HOOK_BEFORE_UPDATE);
              patch(domApi, vnode, oldVNode);
              afterHookName = HOOK_AFTER_UPDATE;
          }
          else {
              var beforeMountHook = $options[HOOK_BEFORE_MOUNT];
              if (beforeMountHook) {
                  beforeMountHook.call(instance);
              }
              lifeCycle.fire(instance, HOOK_BEFORE_MOUNT);
              patch(domApi, vnode, oldVNode);
              instance.$el = vnode.node;
              afterHookName = HOOK_AFTER_MOUNT;
          }
          instance.$vnode = vnode;
          // 跟 nextTask 保持一个节奏
          // 这样可以预留一些优化的余地
          Yox.nextTick(function () {
              if (instance.$vnode) {
                  var afterHook = $options[afterHookName];
                  if (afterHook) {
                      afterHook.call(instance);
                  }
                  lifeCycle.fire(instance, afterHookName);
              }
          });
      }
  };
  /**
   * 校验组件参数
   *
   * @param props
   */
  Yox.prototype.checkProp = function (key, value) {
  };
  /**
   * 销毁组件
   */
  Yox.prototype.destroy = function () {
      var instance = this;
          var $parent = instance.$parent;
          var $options = instance.$options;
          var $emitter = instance.$emitter;
          var $observer = instance.$observer;
      {
          var beforeDestroyHook = $options[HOOK_BEFORE_DESTROY];
          if (beforeDestroyHook) {
              beforeDestroyHook.call(instance);
          }
          lifeCycle.fire(instance, HOOK_BEFORE_DESTROY);
          var $vnode = instance.$vnode;
          if ($parent && $parent.$children) {
              remove$6($parent.$children, instance);
          }
          if ($vnode) {
              destroy(domApi, $vnode, !$parent);
          }
      }
      $observer.destroy();
      {
          var afterDestroyHook = $options[HOOK_AFTER_DESTROY];
          if (afterDestroyHook) {
              afterDestroyHook.call(instance);
          }
          lifeCycle.fire(instance, HOOK_AFTER_DESTROY);
      }
      // 发完 after destroy 事件再解绑所有事件
      $emitter.off();
      instance.$el = UNDEFINED;
  };
  /**
   * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
   */
  Yox.prototype.nextTick = function (task) {
      this.$nextTask.append(task, this);
  };
  /**
   * 取反 keypath 对应的数据
   *
   * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
   */
  Yox.prototype.toggle = function (keypath) {
      return this.$observer.toggle(keypath);
  };
  /**
   * 递增 keypath 对应的数据
   *
   * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
   *
   * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
   * @param step 步进值，默认是 1
   * @param max 可以递增到的最大值，默认不限制
   */
  Yox.prototype.increase = function (keypath, step, max) {
      return this.$observer.increase(keypath, step, max);
  };
  /**
   * 递减 keypath 对应的数据
   *
   * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
   *
   * @param keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
   * @param step 步进值，默认是 1
   * @param min 可以递减到的最小值，默认不限制
   */
  Yox.prototype.decrease = function (keypath, step, min) {
      return this.$observer.decrease(keypath, step, min);
  };
  /**
   * 在数组指定位置插入元素
   *
   * @param keypath
   * @param item
   * @param index
   */
  Yox.prototype.insert = function (keypath, item, index) {
      return this.$observer.insert(keypath, item, index);
  };
  /**
   * 在数组尾部添加元素
   *
   * @param keypath
   * @param item
   */
  Yox.prototype.append = function (keypath, item) {
      return this.$observer.append(keypath, item);
  };
  /**
   * 在数组首部添加元素
   *
   * @param keypath
   * @param item
   */
  Yox.prototype.prepend = function (keypath, item) {
      return this.$observer.prepend(keypath, item);
  };
  /**
   * 通过索引移除数组中的元素
   *
   * @param keypath
   * @param index
   */
  Yox.prototype.removeAt = function (keypath, index) {
      return this.$observer.removeAt(keypath, index);
  };
  /**
   * 直接移除数组中的元素
   *
   * @param keypath
   * @param item
   */
  Yox.prototype.remove = function (keypath, item) {
      return this.$observer.remove(keypath, item);
  };
  /**
   * 拷贝任意数据，支持深拷贝
   *
   * @param data
   * @param deep
   */
  Yox.prototype.copy = function (data, deep) {
      return this.$observer.copy(data, deep);
  };
  /**
   * core 版本
   */
  Yox.version = "1.0.0-alpha.233";
  /**
   * 方便外部共用的通用逻辑，特别是写插件，减少重复代码
   */
  Yox.is = is;
  Yox.dom = domApi;
  Yox.array = array;
  Yox.object = object;
  Yox.string = string;
  Yox.logger = logger;
  Yox.Event = CustomEvent;
  Yox.Emitter = Emitter;
  Yox.lifeCycle = lifeCycle;
  /**
   * 外部可配置的对象
   */
  Yox.config = PUBLIC_CONFIG;
  function setFlexibleOptions(instance, key, value) {
      if (func(value)) {
          instance[key](value.call(instance));
      }
      else if (object$1(value)) {
          instance[key](value);
      }
  }
  function addEvent(instance, type, listener, once) {
      var $emitter = instance.$emitter;
      var filter = $emitter.toFilter(type, listener);
      var options = {
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
  function loadComponent(registry, name, callback) {
      if (registry && registry[name]) {
          var component = registry[name];
          // 注册的是异步加载函数
          if (func(component)) {
              registry[name] = [callback];
              var componentCallback = function (result) {
                  var queue = registry[name], options = result['default'] || result;
                  registry[name] = options;
                  each$2(queue, function (callback) {
                      callback(options);
                  });
              }, promise = component(componentCallback);
              if (promise) {
                  promise.then(componentCallback);
              }
          }
          // 正在加载中
          else if (array$1(component)) {
              push(component, callback);
          }
          // 不是异步加载函数，直接同步返回
          else {
              callback(component);
          }
          return TRUE;
      }
  }
  function getResource(registry, name, lookup) {
      if (registry && registry[name]) {
          return registry[name];
      }
      else if (lookup) {
          return lookup(name);
      }
  }
  function setResource(registry, name, value, formatValue) {
      if (string$1(name)) {
          registry[name] = formatValue ? formatValue(value) : value;
      }
      else {
          each(name, function (value, key) {
              registry[key] = formatValue ? formatValue(value) : value;
          });
      }
  }
  {
      // 全局注册内置过滤器
      Yox.filter({
          hasSlot: function(name) {
              // 不鼓励在过滤器使用 this
              // 因此过滤器没有 this 的类型声明
              // 这个内置过滤器是不得不用 this
              return this.get(SLOT_DATA_PREFIX + name) !== UNDEFINED;
          }
      });
  }

  return Yox;

})));
//# sourceMappingURL=yox.js.map
