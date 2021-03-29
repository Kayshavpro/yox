## 定界符

Yox 采用了 `Mustache` 的定界符： `{{` 和 `}}`。

```html
<div>
  {{name}}
</div>
```

> 支持自定义定界符，参考 **配置**

## 注释

**推荐**使用 `HTML` 注释，天生语法高亮。

```html
<div>
  <!-- 单行注释 -->
</div>
```

```html
<div>
  <!--
      多行注释
  -->
</div>
```

有时候，你会碰到无法使用 `HTML` 注释的情况，比如注释属性，如下：

```html
<div
  id="id"

  // 下面这些想暂时注释掉，而不想删掉
  class="class"
  title="title"
>

</div>
```

这时，你可以切换到 `Mustache` 注释，如下：

```html
<div
  id="id"

  {{!

  下面这些想暂时注释掉，而不想删掉

  class="class"
  title="title"

  }}
>

</div>
```

`Mustache` 注释对格式有所要求，如下：

```html
<div>
  <!-- ! 必须紧跟空白符，比如空格 -->
  {{! visible}}

  <!-- 换行符也是空白符啦 -->
  {{!
    visible
  }}

  <!--
    如果 ! 没有紧跟空白符，这不成了取反操作嘛
    【注意】：这句不是注释
  -->
  {{!visible}}

  <!-- 最后，我们还支持了一种类似 HTML 注释的格式 -->
  {{!-- visible --}}
</div>
```

## 引用

通过 `ref` 获取模板里的 `元素节点` 或 `组件节点`，如下：

```html
<div>
  <!-- 引用 DOM 元素 -->
  <video ref="video"></video>

  <!-- 引用 Yox 组件实例 -->
  <Player ref="player" />
</div>
```

```js
{
  afterMount: function () {

    // 获取元素节点
    var video = this.$refs.video
    video.play()

    // 获取组件实例
    var player = this.$refs.player
    // 调用组件方法
    player.play()

  }
}
```

> `$refs` 在组件触发 `afterMount` 钩子函数之后可用

## 插值

顾名思义，插值表示把一个 `表达式` 的值插入到模板中，如下：

```html
<div id="{{id}}">
  {{name}}
</div>
```

插值有两个位置：**属性值** 和 **子节点**。

### 属性值

如果属性值需要从 `data` 中读取，可使用插值，如下：

```html
<input type="checkbox" checked="{{isChecked}}">
```

当 `isChecked` 为 `true` 时，`input` 会自动勾选。

#### 属性类型

Yox 会自动识别常见属性的类型，如下：

* `number`: min minlength max maxlength step width height size rows cols tabindex
* `boolean`: disabled checked required multiple readonly autofocus autoplay controls loop muted novalidate draggable hidden spellcheck
* `string`: id class name value for accesskey title style src type href target alt placeholder preload poster wrap accept pattern dir autocomplete autocapitalize

当我们为这些属性设值时，请**尊重**它们的类型。

如果这些属性的值是字面量，Yox 会自动转型，如下：

```html
<!--
  按照 HTML 的游戏规则，boolean 属性不写属性值表示 true
  作为扩展，值为字面量 true 也表示 true
-->
<input type="checkbox" disabled checked="true" required="{{true}}">
```

#### 插值数量

如果属性值只有一个插值，表达式的值会原样赋给属性值，即值的类型保持不变。

```html
<input type="checkbox" required="{{true}}">
```

如果属性值包含 `多个插值` 或 `插值与字面量混用`，Yox 会把它们的值拼接起来，形成一个字符串，再赋给属性值。

```html
<!--
  class = class1 + ' ' + class2
  title = 'hello, ' + name
-->
<div class="{{class1}} {{class2}}" title="hello, {{name}}"></div>
```

### 子节点

子节点插值有两种类型：**安全插值** 和 **危险插值**。

#### 安全插值

安全插值（`{{` 和 `}}`），表示值最终会设置到 `元素节点` 或 `文本节点` 的 `textContent` 属性上，因此它是**安全**的。

```html
<div>
  <!--
    没有加粗效果
  -->
  {{'<b>title</b>'}}
</div>
```

#### 危险插值

危险插值（`{{{` 和 `}}}`），表示值最终会设置到 `元素节点` 的 `innerHTML` 属性上，常用于渲染富文本。

```html
<div>
  <!--
    有加粗效果
  -->
  {{{'<b>title</b>'}}}
</div>
```

危险插值**必须**独享一个 `元素节点`，如下：

```html
<div>
  {{{expression}}}
</div>
```

危险插值**不支持**和普通文本混写，因为文本节点没有 `innerHTML` 属性，如下：

```html
<div>
  balabala...
  {{{expression}}}
  balabala...
</div>
```

危险插值**不支持**运行时才能确定的内容表达式，这样在模板编译阶段无法判断是否为危险插值，导致运行时的性能浪费，如下：

```html
<div>
  {{#if expression}}
    {{{expression}}}
  {{else}}
    default
  {{/if}}
</div>
```

应该改写成以下方式：

```html
<div>
  {{{expression || 'default'}}}
</div>
```

## 条件判断

`if` 或 `else if` 后面紧跟一个表达式，语法设计和判断逻辑完全照搬 `JavaScript`，上手零成本。

```html
<div>
  {{#if expression}}
      ...
  {{else if expression}}
      ...
  {{else}}
      ...
  {{/if}}
</div>
```

此外，还可以在 `元素节点` 或 `组件节点` 的**属性**层级使用条件判断，如下：

```html
<div
  {{#if id}}
    id="{{id}}"
  {{/if}}

  class="
  {{#if class}}
    {{class}}
  {{else}}
    default
  {{/if}}"
>
  xxx
</div>
```

> 例子本身没有意义，纯粹演示功能。

在 `Mustache` 的语法中，`[]` 被认为是 `false`，这个特性严重违反直觉，为了避免歧义和保持代码逻辑清晰，我们并未采用。

如何判断是否违反直觉呢？尝试执行以下 `JavaScript` 代码，你会懂的。

```js
if ([]) {
  console.log('[] is true')
}
```

Yox 判断非空数组的方式如下：

```html
<div>
  {{#if !list || !list.length}}
    没有数据
  {{else}}
    ...
  {{/if}}
</div>
```

如果觉得麻烦，可以先注册一个 `isFalsyArray` 过滤器。

```js
Yox.filter({
  isFalsyArray: Yox.array.falsy
})
```

> Yox 暴露了一些 core 用到的工具库，比如 `Yox.array`

改进版

```html
<div>
  {{#if isFalsyArray(list)}}
    没有数据
  {{else}}
    ...
  {{/if}}
</div>
```

## 循环数组

循环数组，一般有两种设计风格，一种是 `item in array`，一种是 `each`。

我们比较偏向 `each`，因为它可以省略 `item`，减少命名的脑力消耗。

```html
<div>
  {{#each array}}
    ...
  {{else}}
    ...
  {{/each}}
</div>
```

> else 自 `1.0.0-alpha.203` 版本开始支持，方便实现列表为空时的视图

### 数组下标

如果循环过程中要用到数组下标，可通过 `[array]:[index]` 语法获取，如下：

```html
<div>
  {{#each array:index}}
    ...
  {{/each}}
</div>
```

对于 Yox 来说，判断数组的最后一项非常简单，只需 `if` 一下。

```html
<div>
  {{#each array:index}}
    {{#if index === array.length - 1}}
        ...
    {{/if}}
  {{/each}}
</div>
```

这样写有一点 `瑕疵`，循环体每次都会读取 `array.length`。

为了性能考虑，我们特意提供了一个特殊变量：`$length`，改进版如下：

```html
<div>
  {{#each array:index}}
    {{#if index === $length - 1}}
        ...
    {{/if}}
  {{/each}}
</div>
```

> 关于 `$length` 参考 **模板** - **特殊变量**

### 递进上下文

有别于其他模板语法，`each` 会导致数据 `context` 递进一层，举个例子：

数据

```js
{
  list: [
    {
      name: 'Jake',
      age: 1
    },
    {
      name: 'John',
      age: 2
    }
  ]
}
```

模板

```html
<div>
  {{#each list}}
    name: {{name}}<br>
    age: {{age}}
  {{/each}}
</div>
```

进入 `each` 之后，`context` 会切换成当前正在遍历的列表项，因此我们可以直接用 `{{name}}` 获取当前项的 `name` 属性。

> 这样写会触发 `自动向上查找`，具体参考下一节。

这时你肯定会好奇，怎么获取**当前项**自身呢？

`Mustache` 原本设计了 `.` 语法获取当前 `context`，可是我们觉得不够自然，于是把 `.` 改成了 `this`。

数据

```js
{
  list: [ 1, 2, 3, 4 ]
}
```

模板

```html
<div>
  {{#each list:index}}
    {{index}} is {{this}}.
  {{/each}}
</div>
```

### 自动向上查找

先来看一个例子。

数据

```js
{
  selectedIndex: 1,
  list: [
    { name: 'Jake' },
    { name: 'John' }
  ]
}
```

模板

```html
<div>
  {{#each list:index}}
    {{#if index === selectedIndex}}
      已选中
    {{else}}
      未选中
    {{/if}}
  {{/each}}
</div>
```

我们在 `if` 条件中用到了 `selectedIndex`，但是列表项中并没有，于是会自动向上查找，发现上层的 `selectedIndex`。

向上查找，指的是数据被循环一分为二，循环的外部和内部拥有不同的 `context`。

这个例子可能表现的不够明确，为了加深印象，我们再来看一个例子。

数据

```js
{
  wrapper: {
    selectedIndex: 1,
    list: [
      { name: 'Jake' },
      { name: 'John' }
    ]
  }
}
```

模板

```html
<div>
  {{#each wrapper.list:index}}
    {{#if index === selectedIndex}}
      已选中
    {{else}}
      未选中
    {{/if}}
  {{/each}}
</div>
```

在这个例子中，数据被 `wrapper` 包了一层，且 `each` 直接用了 `wrapper.list`。

外层 `context` 只有一个 `wrapper` 对象，内层 `context` 则直接是列表项。当列表项找不到 `selectedIndex` 时，自动向上查找一层，也没有找到（因为只有一个 `wrapper` 对象）。

> 正确写法是 `index === wrapper.selectedIndex`。


### 禁止向上查找

向上查找确实好用，但它一层一层的向上尝试读取数据，必然会影响性能，甚至有时候实际读取的数据可能并不是你想要的，举个例子：

数据

```js
{
  checked: true,
  list: [
    { name: 'Jake' },
    { name: 'John' }
  ]
}
```

模板

```html
<div>
  {{#each list}}
    <input type="checkbox" model="checked">
  {{/each}}
</div>
```

需求是为每个列表项加一个双向绑定，但列表项并没有 `checked`，可能是接口忘了传吧，Yox 发现上层正好有一个 `checked`，于是所有列表项都绑定到这个 `checked`。

在这个场景中，我们应该明确告知 Yox 数据在什么位置，如下：

```html
<div>
  {{#each list}}
    <input type="checkbox" model="this.checked">
  {{/each}}
</div>
```

加上 `this` 之后，绑定目标非常明确，即当前列表项的 `checked` 属性。即使当前列表项没有 `checked` 属性，Yox 也不会向上查找。

如果你依然想为所有列表项绑定到同一个 `checked`，同样很简单，加上 `../` 即可。

```html
<div>
  {{#each list}}
    <input type="checkbox" model="../checked">
  {{/each}}
</div>
```

### 列表性能优化

我们在 `Virtual DOM` 层面为渲染列表提供了性能优化的支持，如果你的列表项包含数据的唯一标识符（常见如 `id`），建议为节点加上 `key` 属性，如下：

```html
<div>
  {{#each list}}
    <div key="{{this.id}}">
      ...
    </div>
  {{/each}}
</div>
```

这样可以最大程度复用已有的 DOM 元素，减少 DOM API 的调用。

## 循环对象

循环对象和循环数组的逻辑完全一致。

```html
<div>
  {{#each object:key}}
    ...
  {{else}}
    ...
  {{/each}}
</div>
```

> else 自 `1.0.0-alpha.203` 版本开始支持，方便实现对象为空时的视图

## 循环区间

区间，表示从一个数到另一个数，比如从 5 到 10，或者反过来，从 10 到 5。

```html
<div>
  // 包含 to（有等号当然表示包含啦）
  {{#each from => to:index}}
    ...
  {{else}}
    ...
  {{/each}}

  // 不包含 to
  {{#each from -> to:index}}
    ...
  {{else}}
    ...
  {{/each}}
</div>
```

> else 自 `1.0.0-alpha.203` 版本开始支持，方便实现 `from === to` 时的视图（虽然没人会这么用...）

`from` 是起始的数字，`to` 是结束的数字，如果 `from` 大于 `to`，则递减循环，如果 `from` 小于 `to`，则递增循环。

**注意**：`from` 和 `to` 仅支持整数，因为内部实现为 `for` 循环配合 `i++` 或 `i--`，强用小数出现浮点精度问题请自己背锅。

当我们遇到一些特殊需求，循环区间比循环数组更加自然 ，举个例子：

创建 5 颗星星，如果没有循环区间，只能先创建一个数组，再循环该数组。

数据

```js
{
  stars: new Array(5)
}
```

模板

```html
<div>
  {{#each stars:index}}
    <Star value="{{index + 1}}" />
  {{/each}}
</div>
```

使用循环区间则简单的多，不需要创建数组，直接开始写模板，如下：

```html
<div>
  {{#each 1 => 5}}
    <Star value="{{this}}" />
  {{/each}}
</div>
```

同样创建了 5 颗星星，还把当前值传给了 `value`。


## 延展属性

Yox 专门为 `组件` 的传值实现了延展属性，如下：

```html
<div>
  <Component {{...props}} />
</div>
```

> 不支持延展 HTML 元素属性，没必要

为了给组件传递大量的数据，也许你曾经写过这样的代码：

```html
<Component
  name="{{props.name}}"
  age="{{props.age}}"
  email="{{props.email}}"
  gender="{{props.gender}}"
  address="{{props.address}}"
/>
```

逐个传值，看起来只是体力劳动，它的风险在于，如果写错一个字母，`debug` 分分钟让你怀疑人生。

为了彻底消灭这个隐患，我们有情怀地实现了延展属性。


## 定义子模板

如果要在多个地方使用相同的模板，最好不要复制粘贴，而是应该使用子模板。

### 全局注册

对于复用性比较高的子模板，建议全局注册，如下：

```js
// 单个注册
Yox.partial('name', '<div>...</div>')

// 批量注册
Yox.partial({
  name1: '<div>...</div>',
  name2: '<div>...</div>',
  ...
})
```

### 本地注册

仅限于当前组件使用的子模板，建议本地注册，如下：

```js
{
  partials: {
    name1: '<div>...</div>',
    name2: '<div>...</div>',
  }
}
```

### 用时定义

如果觉得 `本地注册` 比较麻烦，也可以直接在组件模板里定义子模板，如下：

```html
<div>
  {{#partial name}}
    <div>
      ...
    </div>
  {{/partial}}
</div>
```

注意，用时定义的子模板，不会注册到组件实例中。

也就是说，用时定义和本地注册不是一回事。


## 导入子模板

查找子模板的顺序是 `用时定义` => `本地注册` => `全局注册`，三次尝试如果依然找不到子模板，则报错。

```html
<div>
  {{> partialName}}
</div>
```

## 过滤器

Yox 的过滤器采用了 `函数调用` 的方式，如下：

```html
<div>
  生日：{{formatDate(birthday)}}
  性别：{{formatGender(gender)}}
</div>
```

```js
{
  filters: {
    formatDate: function (value) {
      // 写吐了，自己写吧
      return 'balabala'
    },
    formatGender: function (value) {
      return value === 1 ? '男' : '女'
    }
  }
}
```

> 更多内容，参考 **表达式** - **函数调用** - **过滤器**

### 全局注册

对于比较常用的过滤器，建议全局注册，如下：

```js
// 单个注册
Yox.filter('formatDate', function (date) {
  return 'x'
})

// 批量注册
Yox.filter({
  formatDate1: function (date) {
    return 'x1'
  },
  formatDate2: function (date) {
    return 'x2'
  }
})
```

如果项目用了 `lodash`，甚至可以注册整个库，如下：

```js
Yox.filter(_)
```

> 全局注册非常容易出现命名冲突，请自己保证不会发生这种事。

### 本地注册

对于比较冷门，通用性不强的过滤器，建议本地注册，如下：

```js
{
  filters: {
    formatName: function (name) {
      return 'balabala'
    }
  }
}
```


## Keypath

在前面介绍循环数组时，提到了 `each` 会递进数据上下文，其实质就是修改了 `keypath`。

如果没有使用 `each`，`keypath` 始终是 `""`，只有 `each` 会把 `keypath` 切换成当前正在遍历的列表项，举个例子：

数据

```js
{
  data: {
    users: [
      {
        name: 'Jack'
      },
      {
        name: 'John'
      },
      {
        name: 'Mike'
      }
    ]
  },
  methods: {
    select: function (keypath, user) {
      console.log(keypath, user)
    }
  }
}
```

模板

```html
<div>
  {{#each users}}
    <div>
      {{name}}
    </div>
    <button on-click="select($keypath, this)">
      Select
    </button>
  {{/each}}
</div>
```

> 关于 `$keypath`，参考 **模板** - **特殊变量**

渲染用户列表，我们给每个用户添加一个按钮，希望点击按钮能知道点击的是哪个用户。

当我们点击第二个用户时，打印如下：

```js
users.1 Object {name: "John"}
```

`users.1` 正是渲染第二个用户时的 `keypath`。


## 特殊变量

### $event

触发事件时，通过 `$event` 获取当前的事件对象，如下：

```html
<button on-click="submit($event)">
  Submit
</button>
```

> 调用方法如果没有参数，默认会把事件对象传进来，因此这里写与不写 `$event` 是一样的。
>
> 加上这个特性主要是方便多个参数时修改 event 参数的位置。

### $data

触发 `组件事件` 时，通过 `$data` 获取当前的事件数据，如下：

```html
<Button on-click="submit($event, $data)">
  Submit
</Button>
```

> 调用方法如果没有参数，默认会把事件对象和事件数据传进来，因此这里写与不写 `$event, $data` 是一样的。
>
> 加上这个特性主要是方便多个参数时修改 event 和 data 参数的位置，或只需要 data 参数。

### $keypath

在模板的任何位置，通过 `$keypath` 获取当前 `keypath`，如下：

```html
<div>
  {{$keypath}}

  {{#each list}}
    {{$keypath}}
  {{/each}}
</div>
```

### $length

在 `each` 内部，通过 `$length` 获取当前遍历数组的长度，如下：

```html
<div>
  {{#each list}}
    {{$length}}
  {{/each}}
</div>
```

`each` 会预先读取数组的长度，并存在 `$length` 变量中，就像下面这样：

```js
for (var i = 0, $length = list.length; i < $length; i++) {
  // 读取 $length
}
```


