## Quick Form

### A Form dynamic build tools

##### --- for Vue 3.2.x and Element-Plus

##### 动态表单快速构建工具 基于 vue 3.2.x 和 Element-plus
#### demo: https://allensunjian.github.io/quick-form-example/

#### demo: https://allensunjian.github.io/quick-form-example/

## Getting Start

```
npm install quick-form

```

##### Certified components

```
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";
import "../lib/quickFromInsideSty.scss";
import "../lib/quickFromOutsideSty.scss";
createApp(App).use(ElementPlus).use(QuickFrom).mount('#app')
```

```

import { createApp } from 'vue'
  import App from './App.vue'
  import router from './router'
  import ElementPlus from 'element-plus'
  import Authories from "./util/authories"
  import QuickFrom from '@/components/quick-form/index' //引入文件
 
  createApp(App)
    .use(ElementPlus)
    .use(QuickFrom) // 注册组件
    .use(Authories({
      post,
      get
    }, (App) => {
      App.use(router)
      App.mount('#app')
    }, router));
```

## Introduce Type 介绍

##### 支持 Form 元素类型：

- 1 text 文本类型类型
- 2 container 容器类型
- 3 icon 图标类型
- 4 input 输入类型
- 5 inputNumber 数字输入类型
- 5 select 选择器类型
- 6 button 按钮类型
- 7 checkbox 复选类型
- 8 radio 单选类型
- 9 upload 上传类型
- 10 imgList 图片列表类型
- 12 date 日期类型
- 13 time 时间类型
- 14 slot 插槽类型

##### 支持的指令：

- sif 控制显示隐藏

##### 支持字符串类型的模板语法

- {{value}}

##### 支持异步依赖

- depOptions

#### 简单示例

```

<template>
  <quick-form :form-data="FromData" :quickOptions="QuickForm" :rules="Rules" @form-change="FromChange"
    @form-event="FormEvent" ref="QuickFrom">
  </quick-form>
  <el-button @click="submit">提交</el-button>
</template>
<script lang="ts" >
import { Plus, Calendar } from "@element-plus/icons-vue";
import { defineComponent, reactive, getCurrentInstance } from "vue";
const setup = function () {
  const Ins: any = getCurrentInstance();
  // 表单数据依赖
  const FromData = reactive({
    account: "",
    bankType: null,
    othersAccount: "",
    amount: 0,
    remark: 1111,
    date: "2022-05-25",
    timeData: new Date(2000, 1, 1, 12, 0, 0),
    daterangeData: ["2022-05-01", "2022-05-05"],
    state: 2,
    checkboxData: [2],
    fileList: [],
    switchData: false
  });
  // 表单验证规则依赖
  const Rules = reactive({
    bankType: [
      { required: true, message: "请选择申请类型", trigger: "change" },
    ],
    account: [
      { required: true, message: "请输入金额", trigger: "blur" },
    ]
  })
  // 表单配置依赖，不要用 reactive | ref 进行代理 可以使用shadow 或者 raw 或者 一个原生对象， 否则会导致响应更新栈溢出
  const QuickForm: any = {
    // 表单 条目 配置项
    formOptions: [
      {
        formElementLabel: "开户行",
        formElementType: "select",
        key: "bankType",
        placeholder: "请选择银行",
        options: [
          { label: "中国银行", value: 1 },
          { label: "建设银行", value: 2 },
          { label: "农业银行", value: 3 },
          { label: "建设银行", value: 4 },
        ],
      },
      {
        tirrgerEvents: ["mouseover"],
        formElementLabel: "账号：",
        formElementType: "input",
        key: "account",
        placeholder: "请填写银行账号",
      },
      {
        formElementLabel: "对方账号：",
        formElementType: "input",
        key: "othersAccount",
        placeholder: "请填写对方账号",
      },
      {
        formElementLabel: "转账金额：",
        // formElementType: "container", // 如果没有第一层级的 type 那么默认是container
        childrenOptions: [
          {
            formElementType: "input:number",
            key: "amount", // mountModelValue: "amount", mountModelValue 绑定优先级大于 key
          },
          {
            formElementType: "text",
            textValue: "元",
            style: "margin-left: 10px; color:red",
          },
        ],
      },
      {
        formElementLabel: "备注",
        formElementType: "input:textarea",
        placeholder: "请填写备注",
        key: "remark",
      },
      {
        formElementLabel: "到账类型",
        formElementType: "radio",
        key: "state",
        childrenOptions: [
          { label: 1, children: ["立即"] },
          { label: 2, children: ["延时"] },
        ],
      },
      {
        formElementLabel: "日期",
        directives: [["sif", "scope.state == 2"]],
        childrenOptions: [
          {
            formElementType: "date",
            key: "date",
            type: "date",
            placeholder: "预约日期",
            format: "YYYY/MM/DD",
            valueFormat: "YYYY-MM-DD",
          },
          {
            formElementType: "time",
            key: "timeData",
            type: "time",
            placeholder: "时间",
          },
        ],
      },
      {
        formElementLabel: "日期",
        formElementType: "text",
        textValue: "{{date}}   {{timeData}}",
      },
      {
        formElementLabel: "通知类型",
        formElementType: "checkbox",
        key: "checkboxData",
        childrenOptions: [
          { label: 1, children: ["电话通知"] },
          { label: 2, children: ["短信通知"] },
          { label: 3, children: ["邮件通知"] },
        ],
      },
      {
        formElementLabel: "上传凭证",
        formElementType: "upload",
        key: "fileList",
        action: "#",
        listType: "picture-card",
        autoUpload: false,
        children: [
          {
            formElementType: "icon",
            children: [Plus]
          },
        ],
      },
      {
        formElementLabel: "开关",
        formElementType: "switch",
        key: "switchData"
      }
    ],
    // form配置项 与 element-plus 配置一致
    layout: {
      labelWidth: 100,
      size: "default",
      labelPosition: "right",
    },
  };
  // FromChange 事件--表单数据发生改变 或 抛出改变时 会执行该事件
  const FromChange = (opt: any) => {
    console.log(44, opt);
    // console.log(55, FromData);s
  };
  // FormEvent 主动监听的表单事件会执行这里
  const FormEvent = (e) => {
    console.log("FormEvent", e);
  }
  const submit = () => {
    // 拿到表单示例
    const From = Ins.refs.QuickFrom;
    // 调用 验证
    From.getFrom().validate((valid, fields) => {
      if (valid) {
        console.log("submit!");
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  return {
    QuickForm,
    FromData,
    FromChange,
    FormEvent,
    Rules,
    submit,
  };
};
export default defineComponent({
  setup,
});
</script>


```

##### 配置

- :form-data -- 表单数据 需要 reactive 或者 ref 代理
- :quickOptions -- 表单配置 注意不要用 reactive 或 ref 代理 否则性能会出现严重的问题
  1 formOptions 表单元素配置
  2 layout 表达全局布局 属性同 element-plus el-form 的全局属性 写法 如：label-width 属性 需要写成 labelWidth 小驼峰格式
- depOptions 外部依赖

##### formOptions 配置

- formElementType 表单元素类型（见 form 元素类型）
- formElementLabel 表单 label
- key 元素的 key 一般情况下用于 与 formdata 中的值进行绑定所有该值尽可能保证存在于 formdata 中， 还用于事件反回时的识别 KEY
- mountModelValue 与 key 类似， 用与主动绑定的值， 绑定级别高于 key, 与 key 同时存在时优先绑定 mountModelValue
- tirrgerEvents 接收一个数组 传入事件名称如["click", "change"] , 特殊的组件如 upload 等有自己的事件 可参阅 element-plus 的事件文档， 都可以被支持， 一般 FORM 元素的默认事件是 change，text 类型默认事件是 click.
- options 配合 formElementType 为 select 时使用， 接收 一个数组 作为 option 的选项，或者接收一个字符串 作为依赖映射到 depOptions 中的 相应值 作为 异步依赖让插件动态加载。
- placeholder 占位文字 在 input input:textarea select 等 INPUT 类型元素生效
- textValue 在元 formElementType 类型是 text 时生效， 用于定义文本内容， 支持模板语法， 但是依赖必须存在于 formdata 或 depOptions 中。
- children 内层嵌套元素， 可以是一个组件 可以是文本 抑或是一段元素配置。 代表的是子元素
- itemStyle 元素的内联样式 对象格式
- accept 用于 upload 上传时限制文件类型
- preventDefaultEvent 阻止默认事件， 如自动更新表单数据
- directives 自定义指令， 目前只有一个指令 sif 用户动态展示隐藏元素
  写法： directives: [["sif", "scope.key == 1 && ture"]] 支持联合判断 scope.为固定写法 key 必须存在与 formdata 或者 depOptions 中 否则 始终为 false
- component formElementType 为 slot 时 需要传入自定义组件， 组件为任意 可被 vue3.2.x 版本编译的组件。
- slotOptions 对插槽中 自定义组件 值绑定 的描述
  包含：
  1 props 接收一个数组 [{prop: "data", value: "depData"}] 表示在 component 上绑定一个 data 值 使用 formdata 或 depOptions 中的 depData, 数组代表的可以绑定多个值
  2 receiver 表示要侦听 自定义 component 的某个事件 如： receiver： ["preview"] 如果自定义的 component 中有 preview 事件， 那么一旦触发会被转发到 formEvent 中
- optionLabelKey formElementType 为 select 时 option 中 label 的别名
- optionValueKey formElementType 为 select 时 option 中 value 的别名
- alias formElementType 为 upload 时 文件列表的别名{name: "fileName", url: "fileUrl"}} 把 name 映射到 fileName 上 把 url 映射到 fileUrl 上， 默认展示的列表 格式只包含 name, url 字段。 如果是其他字段 可用 alias 来配置别名映射

##### 事件

- formChange 表单数据变化或者用户主动监听的事件（tirrgerEvents）
- formEvent 表单事件

##### 子类型

###### 在表单元素中部分类型格式是 父类型：子类型 中间使用:分割 父类型和子类型 广义上是一类 但是行为和样式上有所区别。

- input 子类型 number, textarea, text 默认 text 写法为： input | input:number | input:textarea
- upload 子类型 detail， 写法 upload:detail

##### 元素类型配置--input 类型

```
{
    formElementType: "input", // 同 input:number / input:textarea
    formElementLabel: "输入类型",
    key: "inputvalue",
    placeholder: "xxxxxxx",
    size: "small",
}
```

##### 元素类型配置--select 类型

```
// 写法一： 用于 固定option
{
    formElementType: "select",
    formElementLabel: "选择类型",
    key: "selectValue",
    options: [
          { label: "中国银行", value: 1 },
          { label: "建设银行", value: 2 },
          { label: "农业银行", value: 3 },
          { label: "建设银行", value: 4 }
     ]
}
// 写法二： 用于动态或异步option

首先在depOption中定义一个options字段（名字随便起）
{
    options: [
          { label1: "中国银行", value2: 1 },
          { label1: "建设银行", value2: 2 },
          { label1: "农业银行", value2: 3 },
          { label1: "建设银行", value2: 4 }
    ]
}

{
    formElementType: "select",
    formElementLabel: "选择类型",
    key: "selectValue",
    options: "options",   // 传入一个字符串 确保与 depOptions中的字段一致
    optionLabelKey: "name1",
    optionValueKey: "value2"
}

```

##### 元素类型配置--radio 类型

```
{
    formElementType: "radio",
    formLabel: "radioGroup",
    key: "raidoValue",
    childrenOptions: [
          { label: 1, children: ["立即"] },
          { label: 2, children: ["延时"] },
        ]
}

// childrenOptions 用于定义 radio / checkbox 的组
```

##### 元素类型配置--checkbox 类型

```
{
    formElementType: "checkbox",
    formLabel: "radioGroup",
    key: "checkboxValue",  // 初始值必须是数组 否则会报错
    childrenOptions: [
          { label: 1, children: ["立即"] },
          { label: 2, children: ["延时"] },
        ]
}

// childrenOptions 用于定义 radio / checkbox 的组
```

##### 元素类型配置-- upload 类型

1 upload 类型 用于解决 上传 文件和图片 配置 同 element-plus upload

{
formElementType: "upload",
key: "fileList", // 指定了 key， 会自动绑定生成文件|图片列表
fomElementLabel; "上传",
action: "#", // 不设置上传路径
autoUpload: false, // 手动上传
tirrgerEvents: ["preview"], // 侦听 upload 的 preview 事件 当图片发生改变则在 formChange 进行触发
children: [
{ formElementType: "icon", children: [Plus]} // 填入一个自定义 svgicon 这里是引用 element-plus 的 icon
]
}

。。。未完
