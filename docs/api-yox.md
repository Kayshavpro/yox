## 全局 API

### Yox.version

* **类型**: `string`

`Yox` 版本号。

这对社区的插件和组件来说非常有用，你可以根据不同的版本号采取不同的策略。

### Yox.nextTick

* **参数**: `(task: Function, context?: any)`
* **返回值**: 无

通过 [NextTask](https://github.com/yoxjs/yox-common/blob/master/src/util/NextTask.ts) 的共享单例，插入执行一次异步任务。

### Yox.compile

* **参数**: `(template: string, stringify?: boolean)`
* **返回值**: 经过编译的 `Function` 或 `string`

在项目打包部署时，调用 `Yox.compile('html', true)` 把模板转成经过编译的字符串，这样你就可以使用 `runtime` 版本了。

### Yox.use

* **参数**: `(plugin: Plugin)`
* **返回值**: 无

安装 Yox 插件。

`plugin` 对象必须提供 `install` 方法，`Yox` 类会作为唯一的参数传入。

> 此方法需要在调用 `new Yox()` 之前调用。

### Yox.filter

注册全局过滤器。

> 更多内容，参考 **模板** - **过滤器**

### Yox.directive

注册全局指令。

> 更多内容，参考 **自定义指令** - **全局注册**

### Yox.transition

注册全局过渡动画。

> 更多内容，参考 **过渡动画** - **全局注册**

### Yox.component

注册全局组件。

> 更多内容，参考 **组件** - **注册组件**

## 实例属性

### $el

* **类型**: `Element`
* **只读**

Yox 实例的根元素。

### $options

* **类型**: `Object`
* **只读**

用于当前 Yox 实例的初始化选项。

### $root

* **类型**: `Yox | void`
* **只读**

根组件。

如果当前组件是根组件，则 `$root` 为空。

### $parent

* **类型**: `Yox`
* **只读**

如果不是根组件，可通过 `$parent` 获取父组件实例。

### $context

* **类型**: `Yox`
* **只读**

当前组件是被哪一个组件渲染出来的，如果当前组件是根组件，则 `$context` 为空。

大部分情况下，`$context` 和 `$parent` 相同，当组件被当做 `slot` 传入到其他组件时，二者不一定相同。

### $children

* **类型**: `Array<Yox>`
* **只读**

Yox 实例的直接子组件。

### $refs

* **类型**: `Object`
* **只读**

持有设置过 `ref` 的所有 DOM 元素和组件实例。

> `afterMount` 之后可用。

## 实例方法 / 数据

### get

读取数据。

> 更多内容，参考 **数据操作** - **get**

### set

设置数据。

> 更多内容，参考 **数据操作** - **set**

### watch

监听数据变化。

> 更多内容，参考 **数据监听** - **调用 watch()**

### unwatch

取消监听数据变化。

> 更多内容，参考 **数据监听** - **取消监听**

### toggle

* **参数**: `(keypath: string)`
* **返回值**: 取反后的值

取反 `keypath` 的值。

```js
this.toggle('visible')
```

### increase

* **参数**: `(keypath: string, step?: number, max?: number)`
* **返回值**: 递增后的值

递增 `keypath` 对应的数据。

注意，最好是整型的加法，如果涉及浮点型，不保证计算正确。

```js
// 默认递增 1，不限制最大值
this.increase('count')
// 递增 2，不限制最大值
this.increase('count', 2)
// 递增 2，限制最大值为 100
this.increase('count', 2, 100)
```

### decrease

* **参数**: `(keypath: string, step?: number, min?: number)`
* **返回值**: 递减后的值

递减 `keypath` 对应的数据。

注意，最好是整型的减法，如果涉及浮点型，不保证计算正确。

```js
// 默认递减 1，不限制最小值
this.decrease('count')
// 递减 2，不限制最小值
this.decrease('count', 2)
// 递减 2，限制最小值为 0
this.decrease('count', 2, 0)
```

## 实例方法 / 事件

### on

绑定事件。

> 更多内容，参考 **事件处理** - **绑定事件**

### once

绑定事件，响应一次事件后解绑。

> 使用方式和 `on` 相同

### off

解绑事件。

> 更多内容，参考 **事件处理** - **解绑事件**

### fire

发射事件。

> 更多内容，参考 **事件处理** - **发射事件**

## 实例方法 / 工具

### copy

* **参数**: `(value: any, deep?: boolean)`
* **返回值**: 拷贝的新数据

拷贝数据。

## 实例方法 / 生命周期

### forceUpdate

* **参数**: 无
* **返回值**: 无

强制 Yox 实例重新渲染视图。

### nextTick

* **参数**: `(task: Function)`
* **返回值**: 无

将 `task` 延迟到下次 DOM 更新循环之后执行。

它跟全局方法 `Yox.nextTick` 有两处不同：

* `task` 的 `this` 会自动绑定到当前 Yox 实例
* 每个 Yox 实例有自己独立的 `NextTask` 实例，`Yox.nextTick` 共享一个 `NextTask` 实例

### destroy

* **参数**: 无
* **返回值**: 无

销毁一个实例。清理它与其它实例的连接，解绑指令、数据监听和事件监听。

会触发 `beforeDestroy` 和 `afterDestroy` 的钩子。

> 在大多数场景中你不应该调用这个方法，最好使用 `if` 模板语法以数据驱动的方式控制子组件的生命周期。