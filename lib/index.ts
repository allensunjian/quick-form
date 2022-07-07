/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* tslint:disable */
import Dires from "./utils/directives";
import {
  h,
  withDirectives,
  resolveDirective,
  reactive,
  RendererElement,
  RendererNode,
  VNode,
} from "vue";
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElSelect,
  ElOption,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElCheckbox,
  ElUpload,
  ElIcon,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
} from "element-plus";

import { CirclePlus, Download, Delete } from "@element-plus/icons-vue";

type statuBase =
  | ""
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "danger";

type sizeBase = "" | "default" | "small" | "large";

interface IFunction<T = void> {
  (...items: any): T;
}
interface IObject<T = any> {
  [x: string]: T;
}

type FromElmentBase = {
  type?: statuBase;
  size?: sizeBase;
  formElementType: string;
  formElementLabel: string;
  key: string;
};

type fromItemType = {
  tirrgerEvents?: string[];
  options?: any[];
  placeholder?: string;
  textValue?: string;
  children?: any[];
  currentPropPath?: any[];
  itemStyle?: IObject;
  accept?: string[];
  preventDefaultEvent?: boolean;
  label?: any;
  directives?: any;
  component?: any;
  slotOptions?: any;
  optionLabelKey?: string;
  optionValueKey?: string;
  redundantKeys?: string[] | [];
  mountModelValue?: string;
  alias?: IObject<any>;
};

type fromItemMergeType = FromElmentBase & fromItemType & ReturnCombType;

type ReturnCombType = {
  mainType: string;
  subType?: CreatorType;
};

type LayoutType = {
  labelWidth?: number;
};
type eventMapType = {
  getEvents: IFunction<any>;
  getDefaultEvent: IFunction<any>;
};

type lifecricle = {
  onCreated?: IFunction<void>;
  onMounted?: IFunction<void>;
  onBeforeCreate?: IFunction<void>;
  onBeforeUpdate?: IFunction<void>;
};

type imgDataType = {
  src: string;
  name: string;
};

type cpropType = Array<{ prop: string; value: any }>;

type creceiverType = Array<string>;

type cOptType = {
  props: cpropType;
  receiver: creceiverType;
};

type UT = {
  scope: any;
  emit: IFunction<any>;
  getModelValue: IFunction<any>;
  eventMap: eventMapType;
  createEventMap: IFunction<IObject>;
  GetCombinationType: IFunction<ReturnCombType>;
  GetLayout: IFunction<LayoutType>;
  upDateFromData: IFunction<void>;
  getMountModelValue: IFunction<any>;
  createElementDeep: IFunction<any[]>;
  GetParentModelVal: IFunction<any>;
  emitEvent: IFunction<void>;
  parseDirective: IFunction<any>;
  renderComponents: IFunction<any>;
  clearHandleProps: IFunction<any>;
  getComponentDeps: IFunction<any>;
  parseTempSyntax: IFunction<any>;
  getGlobalOptions: IFunction<any>;
  rulesState: IObject<any>;
};

let _app: any = null;

const _EVENT_ = "formChange";

const _FROM_EVENT_ = "formEvent";

const EVENT_CHANGE = "change";

const TEXT_EL = "span";

const FROM_INS = "_quickFrom";

const FROM_C = "quick-form__label--container";

const FROM_C_EL = "div";

const FORM_EL_IMG = "img";

// const reviewControlls = ["preview", "download", "delete"]

const HandleProps /* 忽略属性 */ = [
  "children",
  "options",
  "directives",
  "formElementType",
  "formElementLabel",
  "key",
  "tirrgerEvents",
  "textValue",
  "currentPropPath",
  "itemStyle",
  "preventDefaultEvent",
  "component",
  "slotOptions",
  "optionLabelKey",
  "optionValueKey",
  "mainType",
  "subType",
  "mountModelValue",
  "showControll",
  "childrenOptions",
];

const TemplateReg = /\{\{.*?\}\}/g;

const emitVal: any =
  (scope: any) =>
  (type: string, key: string) =>
  (val: any, mergeObject: IObject | void = {}) => {
    scope.$emit(_EVENT_, { type, key, val, ...mergeObject });
  };

const emitEvent: any =
  (scope: any) => (type: string, key: string) => (val: any) => {
    scope.$emit(_FROM_EVENT_, { type, key, val });
  };

export const Throttling = function (dely: number, fn: IFunction) {
  let timer: any = null;
  return function (...argus: any[]) {
    let scope: any;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(scope, argus);
      clearTimeout(timer);
    }, dely);
  };
};

const VnodeImg = {
  props: {
    imgOption: {
      type: Object,
      default: () => ({}),
    },
    imgData: {
      type: Object,
      default: () => ({}),
    },
    imgControll: {
      type: Array,
      default: () => [],
    },
    showControll: {
      type: Boolean,
      default: true,
    },
    currentIndex: {
      type: Number,
      default: null,
    },
  },
  render() {
    const myThis = this as any;
    const option = myThis.imgOption;
    const controll = myThis.imgControll;
    const showC = myThis.showControll;
    const currentIndex = myThis.currentIndex;
    const controllMap = {
      preview: () =>
        ElementCreator.icon({
          children: [CirclePlus],
          ...iconConf,
          onClick: eventClick("preview"),
        } as unknown as fromItemMergeType),
      download: () =>
        ElementCreator.icon({
          children: [Download],
          ...iconConf,
          onClick: eventClick("download"),
        } as unknown as fromItemMergeType),
      delete: () =>
        ElementCreator.icon({
          children: [Delete],
          ...iconConf,
          onClick: eventClick("delete"),
        } as unknown as fromItemMergeType),
    };
    const GetControllELs = (): any[] =>
      Array.isArray(controll)
        ? controll.map((controlStr: "preview" | "download" | "delete") =>
            controlStr in controllMap ? controllMap[controlStr]() : ""
          )
        : [];
    const vnode: any = () =>
      h(FORM_EL_IMG, {
        src: myThis.imgData.url,
        height: 100,
        ...option,
        class: "quick-form__imglist--item",
      });
    const iconConf = {
      size: 16,
      color: "#fff",
    };

    const eventClick = (type: string) => () => {
      myThis.$emit("imgEvent", type, currentIndex);
    };
    const imgModalVnode: any = () =>
      h(
        FROM_C_EL,
        {
          class: "quick-form__imglist--itemModal",
        },
        GetControllELs()
      );

    let wVnode: any = null;
    wVnode = h(
      FROM_C_EL,
      {
        class: "quick-form__imglist--itemwarp",
        style: "height: 100px",
      },
      showC && controll.length > 0 ? [vnode(), imgModalVnode()] : [vnode()]
    );
    return wVnode;
  },
};

const VnodeImgList = {
  props: {
    listOption: {
      type: Object,
      default: () => ({}),
    },
    imgList: {
      type: Array,
      default: () => [],
    },
  },
  render() {
    const myThis = this as any;
    const option = myThis.listOption;
    let List = myThis.imgList;
    if (!Array.isArray(List)) {
      List = [];
      console.error("传入的图片数据结构不是个数组！");
    }
    const event = function (type: string, index: number) {
      myThis.$emit(type, index);
    };
    return h(
      FROM_C_EL,
      {
        class: FROM_C,
      },
      List.map
        ? List.map((imgObj: imgDataType, index: number) => {
            return h(VnodeImg, {
              imgData: imgObj,
              imgOption: option.itemStyle || {},
              imgControll: option.controll,
              showControll:
                typeof option.showControll == "boolean"
                  ? option.showControll
                  : true,
              currentIndex: index,
              onImgEvent: event,
            });
          })
        : []
    );
  },
};

type CreatorType =
  | "switch"
  | "time"
  | "date"
  | "imgList"
  | "upload"
  | "icon"
  | "text"
  | "container"
  | "inputNumber"
  | "radio"
  | "checkbox"
  | "input"
  | "select"
  | "button";

const ElementCreator = {
  switch: (option: fromItemMergeType, utils: UT) => {
    const EmitEvent: any = utils.emit("change", option.key);
    const HandleProps = utils.clearHandleProps(option);
    return utils.parseDirective(
      h(ElSwitch, {
        ...HandleProps,
        ...utils.createEventMap(option, utils),
        modelValue: utils.getModelValue(option),
      }),
      option,
      utils
    );
  },
  time: (option: fromItemMergeType, utils: UT) => {
    const EmitEvent: any = utils.emit("change", option.key);
    const HandleProps = utils.clearHandleProps(option);
    return utils.parseDirective(
      h(ElTimePicker, {
        ...HandleProps,
        ...utils.createEventMap(option, utils),
        modelValue: utils.getModelValue(option),
        "onUpdate:modelValue": Throttling(50, function (val) {
          utils.upDateFromData(val, option.mountModelValue || option.key);
          EmitEvent(val);
        }),
      }),
      option,
      utils
    );
  },
  date: (option: fromItemMergeType, utils: UT) => {
    const HandleProps = utils.clearHandleProps(option);
    const EmitEvent: any = utils.emit("change", option.key);
    return utils.parseDirective(
      h(ElDatePicker, {
        ...HandleProps,
        ...utils.createEventMap(option, utils),
        modelValue: utils.getModelValue(option),
        "onUpdate:modelValue": Throttling(50, function (val) {
          utils.upDateFromData(val, option.mountModelValue || option.key);
          EmitEvent(val);
        }),
      }),
      option,
      utils
    );
    // return utils.parseDirective(h(ElDatePicker, {
    //     ...HandleProps,
    //     ...utils.createEventMap(option, utils),
    //     modelValue: utils.getModelValue(option),
    //     "onUpdate:modelValue": Throttling(50, function (val) {
    //         utils.upDateFromData(val, option.mountModelValue || option.key);
    //         EmitEvent(val)
    //     })
    // }), option, utils)
  },
  imgList: (option: fromItemMergeType, utils: UT) => {
    const Emit: any = utils.emitEvent("formEvent", option.formElementType);
    // const HandleProps = utils.clearHandleProps(option);
    return utils.parseDirective(
      h(VnodeImgList, {
        imgList: utils.GetParentModelVal(option.currentPropPath),
        listOption: option,
        ...option,
        onPreview: function (index: number) {
          Emit({ type: "preview", key: option.key, index });
        },
        onDelete: function (index: number) {
          Emit({ type: "delete", key: option.key, index });
        },
        onDownload: function (index: number) {
          Emit({ type: "download", key: option.key, index });
        },
      }),
      option,
      utils
    );
  },
  upload: (option: fromItemMergeType, utils: UT) => {
    // @ts-ignore
    const IsDetail = option.subType == "detail";
    const HandleProps = utils.clearHandleProps(option);
    let _accept: any = option.accept;
    if (_accept) {
      if (Array.isArray(_accept)) {
        delete option.accept;
        _accept = _accept.join(",");
      }
    }

    const mountFileList = function (option: fromItemMergeType) {
      const fileListDepend = option.mountModelValue || option.key;
      const { name, url } = option.alias || { name: "name", url: "url" };
      (utils.scope.formData[fileListDepend] || []).forEach((item: IObject) => {
        if (!("name" in item) || !("url" in item)) {
          item.name = item[name];
          item.url = item[url];
        }
      });
      const getFileList = () => {
        if (fileListDepend in utils.scope.formData) {
          try {
            return utils.scope.formData[fileListDepend];
          } catch (error) {
            console.warn("invalid depend key " + fileListDepend);
            return [];
          }
        } else {
          console.warn("invalid depend key " + fileListDepend);
          return [];
        }
      };
      return {
        fileList: getFileList(),
      };
    };

    const mountObject = IsDetail
      ? {
          class: "quick-form__upload--detail",
          ...mountFileList(option),
          ...utils.createEventMap(option, utils),
        }
      : {
          ...utils.createEventMap(option, utils),
          // ...utils.getMountModelValue(option),
          ...mountFileList(option),
          ...HandleProps,
        };
    return utils.parseDirective(
      h(
        ElUpload,
        {
          ...mountObject,
          accept: _accept,
        },
        () => (IsDetail ? [] : utils.createElementDeep(option))
      ),
      option,
      utils
    );
  },
  icon: (option: fromItemMergeType) => {
    let children: any[] = [];
    const handleProps = ClearHandleProps(option);
    try {
      children = (option.children || []).map((vnodeRender: any) => {
        return h(vnodeRender);
      }) as any[];
    } catch (error) {
      /* error block */
      children = [];
    }
    return h(ElIcon, { ...handleProps }, () => children);
  },
  text: (option: fromItemMergeType, utils: UT) => {
    let modelValue, EventMap;
    if (utils && utils.getModelValue) {
      modelValue = utils && utils.getModelValue(option);
      EventMap = utils.createEventMap(option, utils);
    }
    const handleProps = utils.clearHandleProps(option);
    return utils.parseDirective(
      h(
        TEXT_EL,
        {
          ...EventMap,
          ...handleProps,
        },
        [utils.parseTempSyntax(option.textValue) || modelValue || ""]
      ),
      option,
      utils
    );
  },
  container: (options: fromItemMergeType, utils: UT): any => {
    // const children = utils.createElementDeep(options);
    // delete options.children
    const HandleProps = utils.clearHandleProps(options);
    return utils.parseDirective(
      h(
        "div",
        {
          ...utils.createEventMap(options, utils),
          ...HandleProps,
        },
        utils.createElementDeep(options)
      ),
      options,
      utils
    );
  },
  inputNumber: (option: fromItemMergeType, utils: UT) => {
    return utils.parseDirective(
      h(ElInputNumber, {
        modelValue: utils.getModelValue(option),
        ...utils.createEventMap(option, utils),
        ...option,
      }),
      option
    );
  },
  radio: (option: fromItemMergeType, utils: UT) => {
    const textChilren = option.children;
    delete option.children;
    return utils.parseDirective(
      h(
        ElRadio,
        {
          modelValue: utils.getModelValue(option),
          // ...utils.createEventMap(option, utils),
          onClick: Throttling(50, () => {
            utils.upDateFromData(
              option.label,
              option.mountModelValue || option.key
            );
          }),
          ...option,
        },
        () => textChilren
      ),
      option,
      utils
    );
  },
  checkbox: (option: fromItemMergeType, utils: UT) => {
    const textChilren = option.children;
    delete option.children;
    return utils.parseDirective(
      h(
        ElCheckbox,
        {
          modelValue: Array.isArray(utils.getModelValue(option))
            ? utils.getModelValue(option).indexOf(option.label) >= 0
            : false,
          // ...utils.createEventMap(option, utils),
          onClick: Throttling(50, function () {
            const ModelData = utils.getModelValue(option);
            const hasIndex = ModelData.indexOf(option.label);
            if (hasIndex >= 0) {
              ModelData.splice(hasIndex, 1);
            } else {
              ModelData.push(option.label);
            }
          }),
          ...option,
        },
        () => textChilren
      ),
      option,
      utils
    );
  },
  input: (option: fromItemMergeType, utils: UT) => {
    // 兼容el-input-number
    if (option.subType == "number") {
      return ElementCreator.inputNumber(option, utils);
    }

    const handleProps = utils.clearHandleProps(option);
    return utils.parseDirective(
      h(ElInput, {
        modelValue: utils.getModelValue(option),
        // props: {
        //   modelValue: utils.getModelValue(option),
        // },

        // onInput: (() => {
        //   let start: number | null = null;
        //   return (val) => {
        //     console.log(val);
        //     if (window.event && window.event.target) {
        //       if (start !== null) {
        //         // window.event.target.setSelectionRange(start, start);
        //       }
        //       start = window.event.target.selectionStart;
        //       console.log(window.event.target.selectionStart);
        //       utils.upDateFromData(val, option.key);
        //     }
        //   };
        // })(),
        ...utils.createEventMap(option, utils),
        placeholder: option.placeholder,
        type: option.subType ? option.subType : "text",
        ...handleProps,
      }),
      option,
      utils
    );
  },
  select: (option: fromItemMergeType, utils: UT) => {
    const handlerPorps = utils.clearHandleProps(option);
    const options = option.options;
    const optEls: any[] = [];
    const lableKey = option.optionLabelKey || "label";
    const valueKey = option.optionValueKey || "value";
    const getEls = (arr: Array<any> | undefined = []) => {
      (arr || []).forEach((item) => {
        const optionVnode = h(ElOption, {
          value: item[valueKey],
          label: item[lableKey],
        });
        optEls.push(optionVnode);
      });
    };
    getEls(utils.getComponentDeps(options));

    return utils.parseDirective(
      h(
        ElSelect,
        {
          modelValue: utils.getModelValue(option),
          ...utils.createEventMap(option, utils),
          ...handlerPorps,
        },
        () => optEls
      ),
      option,
      utils
    );
  },
  button: (options: fromItemMergeType, utils: UT) => {
    const handleProps = utils.clearHandleProps(options);
    return utils.parseDirective(
      h(ElButton, handleProps, () => utils.createElementDeep(options)),
      options,
      utils
    );
  },
  formFrame: (options: Array<fromItemMergeType>, utils: UT) => {
    const FormChildren: any[] = [];
    // utils.scope._formData = JSON.parse(JSON.stringify(utils.scope.formData));
    const Layout = utils.GetLayout();
    options.forEach((item, index) => {
      FormChildren.push(ElementCreator.formItemFrame(item, utils, index));
    });
    return h(
      ElForm,
      {
        // onselectstart: () => {
        //   return false;
        // },
        rules: utils.scope.rules,
        model: utils.scope.formData,
        ref: FROM_INS,
        // validateOnRuleChange: false,
        ...Layout,
      },
      () =>
        FormChildren.length == 0
          ? h(
              "div",
              {
                class: "quick-form__state--align--center quick-form__fc--light",
              },
              ["请设置表单元素"]
            )
          : FormChildren
    );
  },
  formItemFrame: (option: fromItemMergeType, utils: UT, index): any => {
    if (!option.formElementType) return "";
    const formElementType = option.formElementType || "container";
    const formElementLabel = option.formElementLabel;
    const key = option.key;
    const getTypes = utils.GetCombinationType(formElementType);
    if (getTypes.mainType == "slot") {
      if (getTypes.subType && getTypes.subType in ElementCreator) {
        /* 有插槽 */
        ElementCreator[getTypes.subType](option, utils);
      } else {
        /* 没有子类型则需要传自定义组件 */
        if (!getTypes.subType) {
          if (option.component) {
            return utils.renderComponents(option);
          }
        }
        return ElementCreator.container(
          {
            children: [
              getTypes.subType
                ? "无法找到插槽：" + getTypes.subType
                : "请传入自定义组件",
            ],
          } as unknown as fromItemMergeType,
          utils
        );
      }
    }

    const GetItemChildren = (
      eltype: string,
      options: any,
      utils: {
        scope?: any;
        emit?: IFunction<any>;
        getModelValue?: IFunction<any>;
        eventMap?: eventMapType;
        createEventMap?: IFunction<IObject<any>>;
        GetCombinationType: any;
        GetLayout?: IFunction<LayoutType>;
        GetDrag?: IFunction<boolean>;
        upDateFromData?: IFunction<void>;
        getMountModelValue?: IFunction<any>;
        createElementDeep?: IFunction<any[]>;
        GetParentModelVal?: IFunction<any>;
        emitEvent?: IFunction<void>;
        parseDirective?: IFunction<any>;
        renderComponents?: IFunction<any>;
        clearHandleProps?: IFunction<any>;
        getComponentDeps?: IFunction<any>;
        parseTempSyntax?: IFunction<any>;
        rulesState?: IObject<any>;
        positionChanger?: IFunction<any>;
      }
    ) => {
      if (eltype in ElementCreator) {
        // const isCallSelf = eltype == "formItemFrame";
        const retChildVnodes: any[] = [];
        const vnodeOptions = options.childrenOptions;
        if (Array.isArray(vnodeOptions) && eltype !== "text") {
          delete options.childrenOptions;
          vnodeOptions.forEach((option) => {
            const getTypes = option.formElementType
              ? utils.GetCombinationType(option.formElementType)
              : {};
            if (option.formElementType) {
              // 正常多组件
              eltype = getTypes.mainType;
            } else {
              // 兼容 select option的情况
            }
            retChildVnodes.push(
              ElementCreator[eltype](
                { key: options.key, ...option, ...getTypes },
                utils
              )
            );
          });

          return retChildVnodes;
        }
        return [ElementCreator[eltype]({ ...options, ...getTypes }, utils)];
      } else {
        /* error block */
        return [];
      }
    };

    const handleProps = utils.clearHandleProps(option);
    const mergeHandlerProps = (handler1, handler2) => {
      Object.keys(handler2).forEach((key) => {
        if (key == "class") {
          handler1[key] = (handler1[key] || "") + ` ${handler2[key]}`;
        }
      });
      return handler1;
    };
    return utils.parseDirective(
      h(
        ElFormItem,
        mergeHandlerProps(
          {
            ...mountDrag(utils, index),
            prop: key,
            label: utils.parseTempSyntax(formElementLabel),
            ...handleProps,
          },
          utils.GetDrag() ? { class: "el-form-item__drag" } : {}
        ),
        () => [
          GetItemChildren(getTypes.mainType, { ...option, ...getTypes }, utils),
        ]
      ),
      option,
      utils
    );
  },
};

const mountDrag = (() => {
  let start_index = -1;
  let end_index = -1;
  let start_drag = false;
  const dragClass = "quick-form__state--drag_here";
  const setEffect = (e) => {
    e.dataTransfer.dropEffect = "move";
  };
  return (utils: UT, index: number) => {
    const drag = utils.GetDrag();
    const dragProps = {
      style: `${drag ? "position: relative" : ""}`,
      draggable: true,
      onDrag: (e) => {
        setEffect(e);
        start_drag = true;
        start_index = index;
        return e.preventDefault();
      },
      onDragover: (e) => {
        setEffect(e);
        e.target.classList.add(dragClass);
        return e.preventDefault();
      },
      ondragleave: (e) => {
        e.target.classList.remove(dragClass);
        if (!start_drag) return false;
        return e.preventDefault();
      },
      onDrop: (e) => {
        e.target.classList.remove(dragClass);
        start_drag = false;
        end_index = index;
        utils.positionChanger(start_index, end_index);
        start_index = -1;
        end_index = -1;
      },
    };
    const defaultProps = {};
    return drag ? dragProps : defaultProps;
  };
})();

const UperHelper = (etype: string): string => {
  const etypeArr: any = etype.split("");
  const start = etypeArr.shift().toUpperCase();
  return `on${start}${etypeArr.join("")}`;
};

const ClearHandleProps = (options: fromItemMergeType) => {
  const OriginalProps = {};
  Object.keys(options).forEach((curKey: string) => {
    if (!HandleProps.includes(curKey)) OriginalProps[curKey] = options[curKey];
  });
  return OriginalProps;
};

const eventMap: eventMapType = (() => {
  const inputEvents: any = [
    "input",
    "change",
    "blur",
    "mouseover",
    "mouseenter",
  ];
  inputEvents.default = "input";
  const selectEvents: any = ["change"];
  selectEvents.default = "change";
  const textEvents: any = ["click"];
  textEvents.default = "click";
  const uploadEvents: any = [
    "preview",
    "remove",
    "success",
    "error",
    "progress",
    "change",
    "exceed",
    "upload",
    "remove",
  ];
  uploadEvents.default = "change";
  const containerEvents: any = ["click", "mouseover", "mouseenter"];
  containerEvents.default = "click";
  const checkboxEvents: any = ["click", "mouseover", "mouseenter", "change"];
  checkboxEvents.default = "change";
  const radioEvents: any = ["click", "mouseover", "mouseenter", "change"];
  radioEvents.default = "click";
  const dateEvents: any = [
    "click",
    "mouseover",
    "mouseenter",
    "change",
    "blur",
    "focus",
    "calendarChange",
    "panelChange",
    "visibleChange",
  ];
  dateEvents.default = "change";
  const timeEvents: any = [
    "click",
    "mouseover",
    "mouseenter",
    "change",
    "blur",
    "focus",
    "calendarChange",
    "panelChange",
    "visibleChange",
  ];
  timeEvents.default = "change";
  const switchEvents: any = ["click", "mouseover", "mouseenter", "change"];
  switchEvents.default = "change";
  const LIB = {
    input: inputEvents,
    select: selectEvents,
    text: textEvents,
    upload: uploadEvents,
    container: containerEvents,
    checkbox: checkboxEvents,
    radio: radioEvents,
    date: dateEvents,
    time: timeEvents,
    switch: switchEvents,
  };
  const getEvents = (
    elType: any,
    etype: string | string[]
  ): any | undefined[] => {
    if (elType in LIB) {
      if (Array.isArray(etype)) {
        const retEvents: IObject[] = [];
        const defaultEvent = LIB[elType].default;
        const defaultEventMap = {
          originalEvent: defaultEvent,
          mountEvent: UperHelper(defaultEvent),
        };
        etype.forEach((strEvents) => {
          if (strEvents == defaultEvent) return;
          if (LIB[elType].includes(strEvents)) {
            retEvents.push({
              originalEvent: strEvents,
              mountEvent: UperHelper(strEvents),
            });
          } else {
            console.warn("未在元素类型：" + elType + "找到：" + etype + "方法");
          }
        });
        retEvents.push(defaultEventMap);
        return retEvents;
      } else {
        if (!LIB[elType].default) {
          console.warn("can not found default event in " + elType);
        }
        return [
          {
            originalEvent: LIB[elType].default,
            mountEvent: UperHelper(LIB[elType].default),
          },
        ];
      }
    } else {
      console.warn("未定义:" + elType + "元素类型");
      return [];
    }
  };
  const getDefaultEvent = (elType: string | number) => {
    return LIB[elType]?.default;
  };
  return {
    getEvents,
    getDefaultEvent,
  };
})();

const Methods = {
  methods: {
    getFrom() {
      const myThis = this as any;
      return myThis.$refs[FROM_INS];
    },
    addItem(item: any) {
      const myThis = this as any;
      myThis.quickOptions.formOptions.push(item);
      myThis._updateComponents();
    },
    _updateComponents() {
      const myThis = this as any;
      myThis.$nextTick(() => {
        myThis.$forceUpdate();
      });
    },
    resetRules(resourceRules: IObject<any>) {
      const myThis = this as any;
      const libKey = "StateLib" + myThis._raw;
      if (libKey in window) {
        const hideItemKeys = window["StateLib" + myThis._raw].getDeleteKey();
        const newRules = Object.keys(resourceRules).reduce(
          (ref: IObject, cur: string) => {
            if (hideItemKeys.indexOf(cur) == -1) ref[cur] = resourceRules[cur];
            return ref;
          },
          {}
        );
        myThis.$emit("ruleChange", newRules);
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("");
        }, 200);
      });
    },
  },
};

const _Data = {
  data: () => ({
    _quickOptions: {},
    defaultValue: "未匹配到key",
    _raw: new Date().getTime(),
  }),
};

const Props = {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    quickOptions: {
      type: Object,
      default: () => ({}),
    },
    depOptions: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
};

const MountMainUtils = function (myThis: any): UT {
  const _emitVal = emitVal(myThis);
  const _emitEvent = emitEvent(myThis);
  const _UTILS: any = {};
  const GetCombinationType = (type: string): ReturnCombType => {
    const typeArr = type.split(":");
    const mainType = typeArr[0];
    const subType = typeArr[1] as CreatorType;
    return {
      mainType,
      subType,
    };
  };
  const getModelValue = (key: string | fromItemMergeType | undefined) => {
    let _key: string | null = null;
    let _mountValue: string | undefined = undefined;
    if (!key) return null;
    if (typeof key == "string") {
      _key = key;
    } else {
      _key = key.key;
      _mountValue = key.mountModelValue;
    }

    if (_mountValue && _mountValue in myThis.formData) {
      _key = _mountValue;
    }

    if (_key in myThis.formData) {
      return myThis.formData[_key];
    } else {
      // return myThis.defaultValue
      return null;
    }
  };
  const createEventMap = (
    option: {
      formElementType: string;
      tirrgerEvents: any;
      key: any;
      preventDefaultEvent: any;
      mountModelValue: any;
      optionValueKey: string;
      optionLabelKey: string;
      redundantKeys: never[];
      options: any;
    },
    utils: UT
  ) => {
    if (!option.formElementType) return {};
    const mainType = GetCombinationType(option.formElementType).mainType;
    const eventList = eventMap.getEvents(mainType, option.tirrgerEvents);

    const events = {};

    eventList.forEach(
      ({
        mountEvent,
        originalEvent,
      }: {
        mountEvent: string;
        originalEvent: string;
      }) => {
        const EmitEvent: any = _emitVal(originalEvent, option.key);
        const defaultEvent = eventMap.getDefaultEvent(mainType);
        if (originalEvent == defaultEvent) {
          // @ts-ignore
          events[mountEvent] = (val, e) => {
            if (!option.preventDefaultEvent) {
              utils.upDateFromData(val, option.mountModelValue || option.key);
            } else {
              /* 开启了响应赋值 */
            }
            if (option.formElementType == "select") {
              const valueKey = option.optionValueKey || "value";
              const lableKey = option.optionLabelKey || "label";
              const redundantKeys = option.redundantKeys || [];
              const selectItem = utils
                .getComponentDeps(option.options)
                .filter((option: IObject) => option[valueKey] == val)
                .map((option: IObject) => ({
                  value: option[valueKey],
                  label: option[lableKey],
                  ...redundantKeys.reduce(
                    (ref: { [x: string]: any }, cur: string | number) => {
                      ref[cur] = option[cur];
                      return ref;
                    },
                    {}
                  ),
                }));
              return EmitEvent(val, { option: selectItem[0] });
            }
            EmitEvent(val);
          };
        } else {
          // @ts-ignore
          events[mountEvent] = EmitEvent;
        }
      }
    );
    return events;
  };

  const GetLayout = (): LayoutType => {
    return myThis.quickOptions.layout;
  };

  const GetDrag = (): boolean => {
    return Boolean(myThis.quickOptions.drag);
  };

  const upDateFromData = (val: any, key: string) => {
    if (key in myThis.formData) {
      if (val instanceof Event) return;
      myThis.formData[key] = val;
    }
  };

  const getMountModelValue = (option: {
    mountModelValue: any;
    key: string | number;
  }): IObject => {
    const retMap = {};
    const key = option.mountModelValue;
    if (typeof key == "string") {
      // @ts-ignore
      retMap[key] = myThis.formData[option.key];
    }
    return retMap;
  };

  const createElementDeep = (options: fromItemMergeType) => {
    const children = options.children || [];
    const targetProp = options.key;
    const currentPropPath = [...(options.currentPropPath || []), targetProp];
    const retMap: any[] = [];
    if (!Array.isArray(children)) return;
    children.forEach((child) => {
      if (typeof child == "string") {
        return retMap.push(
          ElementCreator.text(
            { textValue: child } as unknown as fromItemMergeType,
            _UTILS
          )
        );
      }
      const elType = child.formElementType;
      if (elType in ElementCreator) {
        child.currentPropPath = currentPropPath;
        retMap.push(
          // @ts-ignore
          ElementCreator[elType]({ ...child, key: targetProp }, _UTILS)
        );
      } else {
        console.warn("validate child option:" + JSON.stringify(child));
      }
    });
    return retMap;
  };

  const GetParentModelVal = (path: string[]) => {
    const parentModelProp = path.shift();
    const propValue = getModelValue(parentModelProp);
    if (propValue == myThis.defaultValue) {
      console.warn("can not found parent prop " + parentModelProp);
    }
    return propValue;
  };

  const ParseDirective = (
    vnode: any,
    options: fromItemMergeType,
    utils: UT
  ): any => {
    const directives = options.directives;
    // 删除当前指令 防止继续往下传
    // delete options.directives;
    if (Array.isArray(directives)) {
      const s: any = directives.map((ds: any[]) => {
        const directive = ds[0];
        const QueryString = "_UTILS.scope.formData";
        const QueryDepString = "_UTILS.scope.depOptions";
        const condition = ds[1]
          .replace(new RegExp("scope", "g"), QueryString)
          .replace(new RegExp("depScope", "g"), QueryDepString);
        return [
          resolveDirective(directive),
          eval(condition),
          utils,
          options.key,
        ];
      });

      vnode = withDirectives(vnode, s);
    }
    return vnode;
  };
  const RenderComponents = (options: fromItemMergeType) => {
    const slotOptions: cOptType = options.slotOptions || {};
    const props: cpropType = slotOptions.props || [];
    const receiver: creceiverType = slotOptions.receiver || [];
    const createPorps = props.reduce((ref, cur, index) => {
      try {
        // @ts-ignore
        ref[cur.prop] = {
          ..._UTILS.scope.formData,
          ..._UTILS.scope.depOptions,
        }[cur.value];
      } catch (error) {
        console.log(error);
      }
      return ref;
    }, {});

    const Emit = _UTILS.emitEvent("formEvent", options.formElementType);
    const CreateReceiver = receiver.reduce((ref, cur, index) => {
      // @ts-ignore
      ref[UperHelper(cur)] = function (value: any) {
        Emit({ type: cur, key: options.key, value });
      };
      return ref;
    }, {});
    return ParseDirective(
      h(options.component, { ...createPorps, ...CreateReceiver }),
      options,
      _UTILS
    );
  };

  const GetComponentDeps = (depName: string | Array<any>) => {
    if (typeof depName == "string") {
      if (depName in myThis.depOptions) {
        return myThis.depOptions[depName];
      } else {
        console.warn("invalid depName:" + depName);
        return [];
      }
    } else if (Array.isArray(depName)) {
      return depName;
    } else {
      console.warn(
        "invalid depName type:" + typeof depName + ", must be Array or String"
      );
    }
  };

  const ParseTempSyntax = function (val: any) {
    if (typeof val == "string") {
      const parseArr = val.match(TemplateReg);
      if (parseArr && parseArr.length > 0) {
        parseArr.map((parseString: string) => {
          const str = parseString.replace("{{", "").replace("}}", "");
          const mergeObject = Object.assign(
            {},
            _UTILS.scope.formData,
            _UTILS.scope.depOptions
          );
          const parsedVal = mergeObject[str];
          val = val.replace(parseString, parsedVal);
        });
      }
    }
    return val;
  };
  const RulesState = (() => {
    const rules: any = null;
    const deleteKeys: string[] = [];
    return {
      // setRules(_rules: any) {
      //   // rules = JSON.parse(JSON.stringify(_rules));
      // },
      resetState(key: string, state: boolean) {
        const index = deleteKeys.indexOf(key);
        if (state) {
          index >= 0 && deleteKeys.splice(index, 1);
        } else {
          index == -1 && deleteKeys.push(key);
        }
      },
      getDeleteKey() {
        return deleteKeys;
      },
      resetRules(type: string) {
        // const emit = _UTILS.emitEvent("directiveEvent", type);
        // @ts-ignore
        window["StateLib" + myThis._raw] = this as any;
      },
    };
  })();

  const PositionChanger = function (start, end) {
    const QuickFormItemOptions = myThis.quickOptions.formOptions;
    if (start >= 0 && end >= 0 && start !== end) {
      const StartConf = QuickFormItemOptions.splice(start, 1)[0];
      if (start > end) {
        QuickFormItemOptions.splice(end, 0, StartConf);
      } else {
        QuickFormItemOptions.splice(end - 1, 0, StartConf);
      }
      _emitEvent("optionChange")({
        targetOption: StartConf,
        start,
        end,
        currentOptions: JSON.stringify(_UTILS.getGlobalOptions()),
      });
      myThis.$forceUpdate();
    }
  };
  _UTILS.scope = myThis;
  _UTILS.emit = _emitVal;
  _UTILS.getModelValue = getModelValue;
  _UTILS.eventMap = eventMap;
  _UTILS.createEventMap = createEventMap;
  _UTILS.GetCombinationType = GetCombinationType;
  _UTILS.GetLayout = GetLayout;
  _UTILS.GetDrag = GetDrag;
  _UTILS.upDateFromData = upDateFromData;
  _UTILS.getMountModelValue = getMountModelValue;
  _UTILS.createElementDeep = createElementDeep;
  _UTILS.GetParentModelVal = GetParentModelVal;
  _UTILS.emitEvent = _emitEvent;
  _UTILS.parseDirective = ParseDirective;
  _UTILS.renderComponents = RenderComponents;
  _UTILS.clearHandleProps = ClearHandleProps;
  _UTILS.getComponentDeps = GetComponentDeps;
  _UTILS.parseTempSyntax = ParseTempSyntax;
  _UTILS.rulesState = RulesState;
  _UTILS.positionChanger = PositionChanger;
  _UTILS.getGlobalOptions = () => myThis.quickOptions;
  return _UTILS;
};

const MainRender = function () {
  return {
    render() {
      const myThis = this as any;
      const formOptions = myThis.quickOptions.formOptions || [];
      const depOptions = myThis.depOptions;
      const UTILS = MountMainUtils(myThis);
      // UTILS.rulesState.setRules(myThis.quickOptions.rules);
      const FromVnode = ElementCreator.formFrame(formOptions, UTILS);
      return FromVnode;
    },
  };
};

const _QuickForm = {
  ...Props,
  ..._Data,
  ...Methods,
  ...Dires,
  ...MainRender(),
};

export const QuickForm = function (argus) {
  return h(_QuickForm, argus);
};

export const HasDirective = (dir: string) => {
  return Boolean(Dires.directives[dir]);
};

const mount = function (app: {
  component: (
    arg0: string,
    arg1: {
      render(): VNode<RendererNode, RendererElement, { [key: string]: any }>;
      directives: { sif: { updated: (el: any, argus: any) => void } };
      methods: {
        getFrom(): any;
        addItem(item: any): void;
        _updateComponents(): void;
        resetRules(resourceRules: IObject<any>): Promise<unknown>;
      };
      data: () => { _quickOptions: {}; defaultValue: string; _raw: number };
      props: {
        formData: { type: ObjectConstructor; default: () => {} };
        quickOptions: { type: ObjectConstructor; default: () => {} };
        depOptions: { type: ObjectConstructor; default: () => {} };
        rules: { type: ObjectConstructor; default: () => {} };
      };
    }
  ) => void;
}) {
  app.component("quick-form", _QuickForm);
  _app = app;
};

export default {
  install: mount,
};
