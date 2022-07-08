import { componentSizes } from "element-plus";
import {
  defineComponent,
  ref,
  Ref,
  nextTick,
  h,
  reactive,
  getCurrentInstance,
} from "vue";
// import { QuickForm } from "../../build/index.js";
import { QuickForm, HasDirective } from "../../build/index.js";
const dragViewClasses = {
  dragLayout: {
    height: "800px",
  },
  dragTitle: {
    padding: "40px 0 80px 0",
    color: "#fff",
    fontSize: "22px",
    textAlign: "center",
  },
  dragContent: {
    display: "flex",
    height: "600px",
    background: "#fff",
    // border: "1px solid var(--el-color-primary)",
    boxSizing: "border-box",
  },
  toolbar: {
    flex: "0 0 80px",
    borderRight: "3px solid rgb(158,204,171)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
    boxSizing: "border-box",
    height: "100%",
    overflow: "hidden",
    "overflow-y": "auto",
  },
  dragView: {
    display: "flex",
    flex: 1,
  },
  toolbarItem: {
    flex: " 0 0 60px",
    width: "60px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    border: "1px dashed var(--el-border-color);",
    cursor: "pointer",
    marginBottom: "10px",
  },
  dragElementView: {
    padding: "20px",
    display: "flex",
    flex: 1,
    border: "2px dashed var(--el-color-primary-dark-2)",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    height: "100%",
    color: "var(--el-menu-border-color)",
    boxSizing: "border-box",
  },
  stateOver: {
    border: "1px solid var(--el-color-success)",
    boxSizing: "border-box",
  },
  dragIntro: {
    padding: "10px",
    color: "#fff",
  },
};
const toolClasses = {
  toolTip: {
    display: "flex",
    width: "100%",
    height: "100%",
    color: "var(--el-menu-border-color)",
    alignItems: "center",
    "justify-content": "center",
    "font-size": "20px",
    "pointer-events": "none",
  },
  "toolTip__state--danger": {
    color: "var(--el-color-danger)",
  },
  "toolTip__state--warn": {
    color: "var(--el-color-warning)",
  },
  "toolTip__state--success": {
    color: "var(--el-color-success)",
  },
};
enum toolTipState {
  warn = "toolTip__state--warn",
  danger = "toolTip__state--danger",
  success = "toolTip__state--success",
}

const state_over_class = "quick-form__state--element-over";

type TToolState = "danger" | "warn" | "success";

type Tshotcut =
  | "shotcut-view"
  | "shotcut-input"
  | "shotcut-button"
  | "shotcut-text"
  | "shotcut-select"
  | "shotcut-radio"
  | "shotcut-checkbox"
  | "shotcut-textarea"
  | "shotcut-upload"
  | "shotcut-switch";

type Tcontainer = "container-view";

type TAtomicts = Tshotcut | Tcontainer;
// 视图类型 component真实视图组件| shotcut快照（拖拽组件工具类）| container (主容器)
type TView = "component" | "shotcut" | "container";

type VnodeInfo = {
  elementType: TAtomicts;
  viewType: string;
  componentName: string;
  target: HTMLElement | null;
  children: VnodeInfo[];
  title?: string;
};

type TregisterData = {
  elementType: TAtomicts;
  title: string;
};
interface IFunction<T = void> {
  (...items: any): T;
}

const Throttling = function (dely: number, fn: IFunction) {
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

export default defineComponent({
  setup: () => {
    let Ins: any = getCurrentInstance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(dragViewClasses);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const utilClasses = window._createStyleSheet(toolClasses);

    // 快捷配置
    const elementShotAbstractGen_default = (
      registerInfo: any,
      title,
      children: any[]
    ) => {
      const events = dragEvent(
        registerInfo.elementType,
        registerInfo.viewType,
        registerInfo.componentName
      );
      const vnode = (
        <div
          draggable="true"
          class={classes.toolbarItem}
          onDrag={events.drag}
          onDragleave={events.dragleave}
          onDragover={events.dragover}
        >
          {children.length > 0 ? children : title}
        </div>
      );

      nextTick(() => {
        RegisterIns.setEl(registerInfo.componentName, vnode);
      });

      return vnode;
    };
    const elementShotcutGen = {
      "shotcut-view": elementShotAbstractGen_default,
      "shotcut-input": elementShotAbstractGen_default,
      "shotcut-button": elementShotAbstractGen_default,
      "shotcut-text": elementShotAbstractGen_default,
      "shotcut-select": elementShotAbstractGen_default,
      "shotcut-radio": elementShotAbstractGen_default,
      "shotcut-checkbox": elementShotAbstractGen_default,
      "shotcut-textarea": elementShotAbstractGen_default,
      "shotcut-upload": elementShotAbstractGen_default,
      "shotcut-switch": elementShotAbstractGen_default,
    };
    // 主画布 元素
    const elementComponentGen = {
      "container-view": (registerInfo: any, title, children: any[]) => {
        //
        const events = dragEvent(
          registerInfo.elementType,
          registerInfo.viewType,
          registerInfo.componentName
        );
        const vnode = (
          <div
            draggable="true"
            class={classes.dragElementView}
            onDrag={events.drag}
            onDragleave={events.dragleave}
            onDragover={events.dragover}
            onMousemove={events.mousemove}
          >
            {children.length > 0
              ? children
              : handleElementGen.getQuickForm(registerInfo)}
          </div>
        );
        nextTick(() => {
          RegisterIns.setEl(registerInfo.componentName, vnode);
        });
        return vnode;
      },
    };
    // form 基础信息
    const option_temp = {
      formOptions: [],
      layout: {
        labelWidth: 100,
        size: "default",
        labelPosition: "right",
      },
      edit: true,
    };
    const FormQuickOptionsLib = reactive({});

    const FormQuickDataLib = reactive({});

    const FormQuickEventLisb = {};
    // 自定义事件
    const handleElementGen = {
      getQuickForm: function (registerInfo: any) {
        if (!FormQuickOptionsLib[registerInfo.componentName]) {
          FormQuickOptionsLib[registerInfo.componentName] = JSON.parse(
            JSON.stringify(option_temp)
          );
        }
        if (!FormQuickDataLib[registerInfo.componentName]) {
          FormQuickDataLib[registerInfo.componentName] = {};
        }
        if (!FormQuickEventLisb[registerInfo.componentName]) {
          FormQuickEventLisb[registerInfo.componentName] = {
            FormChange: (e) => {
              //
            },
            FormEvent: (e) => {
              if (!e.key && e.val.type == "delete_option") {
                const index = e.val.pos;
                const resouce = e.val.resouce;
                const option = e.val.value;
                const key = option.key;
                resouce.splice(index, 1);
                if (
                  FormQuickDataLib[registerInfo.componentName][key] !==
                  undefined
                ) {
                  delete FormQuickDataLib[registerInfo.componentName][key];
                }
              }

              if (!e.key && e.val.type == "edit_option") {
                const index = e.val.pos;
                const resouce = e.val.resouce;
                const option = e.val.value;
                const key = option.key;
                handlerFormItemEvent.parseCurrentFormOptions(option);
              }
            },
          };
        }
        const form: any = h("div", { class: "dragFormWrap" }, [
          h(
            "div",
            {
              class:
                "quick-form__state--align--center quick-form__state--mb--20 quick-form__fc--default",
            },
            [`表单${registerInfo.componentName}`]
          ),
          h(QuickForm, {
            ref: registerInfo.componentName,
            formData: FormQuickDataLib[registerInfo.componentName],
            quickOptions: FormQuickOptionsLib[registerInfo.componentName],
            onFormEvent:
              FormQuickEventLisb[registerInfo.componentName].FormEvent,
            onFormChange:
              FormQuickOptionsLib[registerInfo.componentName].FormChange,
          }),
        ]);
        return form;
      },
      itemGenFac: function (elementType: TAtomicts) {
        // input 配置表
        // button 配置表
        return (
          <el-dialog modelValue={showConfig.value} title="Tips" width="30%">
            <span>This is a message</span>
          </el-dialog>
        );
      },
    };

    // 工具类视图元素
    const elementUtilsGen = {
      "utils-tooltip": (text: string, type: TToolState) => {
        return (
          <div
            class={[
              utilClasses.classes[toolTipState[type]],
              utilClasses.classes.toolTip,
            ]}
          >
            {text}
          </div>
        );
      },
    };

    // 表单元素配置事件
    const showConfig = ref(false);
    const handlerFormItemEvent = (() => {
      const FormItemState = reactive({
        formItemData: {},
        titleType: "",
      });
      const defaultEventTypeForForm = {
        input: (
          name: string,
          key: string,
          placeholder?: string,
          format?: (val) => any
        ) =>
          Object.assign(
            {
              formElementLabel: name || "input",
              key,
              placeholder: placeholder ? placeholder : "请输入" + name,
              formElementType: "input",
            },
            format ? { format } : {}
          ),
        select: (
          name: string,
          key: string,
          options: any[],
          format?: (val) => any
        ) =>
          Object.assign(
            {
              formElementLabel: name || "select",
              key,
              // placeholder: placeholder ? placeholder : "请输入" + name,
              placeholder: "请选择",
              options,
              formElementType: "select",
            },
            format ? { format } : {}
          ),
        radios: (name: string, key: string, options: any[]) => ({
          formElementType: "radio",
          formElementLabel: name || "radio",
          key,
          childrenOptions: options,
        }),
      };

      // 表单配置字段构建规则
      const rule_gen_formitem = {
        formElementLabel: defaultEventTypeForForm.input(
          "列名",
          "formElementLabel"
        ),
        key: defaultEventTypeForForm.input("主键", "key"),

        placeholder: defaultEventTypeForForm.input("占位符", "placeholder"),
        directives: defaultEventTypeForForm.input(
          "指令",
          "directives",
          "请输入指令如sif=scope.state == 1 && scope.name == ''",
          function (val) {
            let ret: any = "";
            const reg = /(?<!=)=(?!=)/;
            if (!val) return "";
            try {
              ret = val.split(",").reduce((ref, cur) => {
                const orginDerictives = cur.split(reg);
                if (!HasDirective(orginDerictives[0]))
                  throw `未定义的指令${orginDerictives[0]}`;
                ref.push([orginDerictives[0], orginDerictives[1]]);
                return ref;
              }, []);
            } catch (error) {
              console.error("quick-form 表单指令格式错误", error);
              ret = "";
            }
            return ret;
          }
        ),
        children: defaultEventTypeForForm.input(
          "子属性",
          "children",
          "请输入子属性多个属性用逗号隔开",
          function (val) {
            return val.split(",");
          }
        ),
        defaultValue: defaultEventTypeForForm.input("默认值", "defaultValue"),
        type: defaultEventTypeForForm.input("元素类型", "type"),
        textValue: defaultEventTypeForForm.input("默认值", "textValue"),
        // multiple: defaultEventTypeForForm.select("是否多选", "multiple",
        //[
        //   { label: "是", value: true },
        //   { label: "否", value: false },
        // ]),
        options: defaultEventTypeForForm.input(
          "选项设置",
          "options",
          "请输入选项如；label=男&value=0,label=女&value=1",
          function (val) {
            try {
              return val.split(",").reduce((ref, cur) => {
                const lableAnVal = cur.split("&").reduce((lvref, lvstr) => {
                  const lv = lvstr.split("=");
                  lvref[lv[0]] = lv[1];
                  return lvref;
                }, {});
                ref.push(lableAnVal);
                return ref;
              }, []);
            } catch (error) {
              console.error("quick-form 选项解析错误", error);
              return [];
            }
          }
        ),
        childrenOptions: defaultEventTypeForForm.input(
          "选项设置",
          "childrenOptions",
          "请输入选项如；label=男&value=0,label=女&value=1",
          function (val) {
            try {
              return val.split(",").reduce((ref, cur) => {
                const lableAnVal = cur.split("&").reduce((lvref, lvstr) => {
                  const lv = lvstr.split("=");
                  // radio选择映射 label == children[]
                  // radio选择映射 value == label
                  if (lv[0] == "label") {
                    lvref.children = [lv[1]];
                  } else if (lv[0] == "value") {
                    lvref.label = lv[1];
                  }
                  return lvref;
                }, {});
                ref.push(lableAnVal);
                return ref;
              }, []);
            } catch (error) {
              console.error("quick-form 选项解析错误", error);
              return [];
            }
          }
        ),
        action: defaultEventTypeForForm.input(
          "请求 URL",
          "action",
          "请填写请求URL，如果手动填写#"
        ),
        multiple: defaultEventTypeForForm.radios("", "multiple", [
          { label: false, children: ["单选"] },
          { label: true, children: ["多选"] },
        ]),
        listType: defaultEventTypeForForm.select("文件类型", "listType", [
          { label: "text", value: "text" },
          { label: "picture", value: "picture" },
          { label: "picture-card", value: "picture-card" },
        ]),
      };
      // 表单元素动态 配置项
      const shotview_conifg = {
        "shotcut-switch": ["formElementType:switch", "formElementLabel", "key"],
        "shotcut-input": [
          "formElementType:input",
          "formElementLabel",
          "key",
          "placeholder",
          "directives",
          "defaultValue",
        ],
        "shotcut-textarea": [
          "formElementType:input:textarea",
          "formElementLabel",
          "key",
          "placeholder",
          "directives",
          "defaultValue",
        ],
        "shotcut-button": [
          "formElementType:button",
          "formElementLabel",
          "type",
          "children",
          "directives",
        ],
        "shotcut-text": [
          "formElementType:text",
          "formElementLabel",
          "textValue",
          "directives",
        ],
        "shotcut-select": [
          "clearable:true",
          "formElementType:select",
          "formElementLabel",
          "key",
          "options",
          "defaultValue",
          "multiple",
          "directives",
        ],
        "shotcut-radio": [
          "formElementType:radio",
          "formElementLabel",
          "key",
          "childrenOptions",
          "defaultValue",
          "directives",
        ],
        "shotcut-checkbox": [
          "formElementType:checkbox",
          "formElementLabel",
          "key-array", // 数组类型的默认值
          "childrenOptions",
          "defaultValue",
          "directives",
        ],
        // action: "#",
        // listType: "picture-card",
        // autoUpload: false,
        // children: [
        //   {
        //     formElementType: "icon",
        //     children: ['上传']
        //   },
        // ],
        "shotcut-upload": [
          "formElementType:upload",
          "formElementLabel",
          "key-array",
          "directives",
          "action:#",
          "multiple:true",
          "defaultValue:false",
          "autoUpload:false",
          "listType",
          "listType:text",
        ],
      };
      // 仓库用于保存 运行时的 format
      let currentValueFormat = {};
      // 暂存值得类型
      let currentKeyTypes = {};

      const createConigForShotview = (arr: string[]) => {
        const resetBooleanOrDefault = (str: string) => {
          if (str == "true") return true;
          if (str == "false") return false;
          return str;
        };
        return arr.map((textConfig) => {
          const keyAndVal = textConfig.split(":");
          const keyAndVal_types = textConfig.split("-");
          if (keyAndVal_types.length == 2) {
            const type = keyAndVal_types[1];
            const key = keyAndVal_types[0];
            currentKeyTypes[key] = type;
            FormItemState.formItemData[key] = "";
            // console.log(rule_gen_formitem[key], type, key);
            return rule_gen_formitem[key];
          }
          if (keyAndVal.length == 2) {
            // keyAndVal 两个参数则 已经有默认值  直接赋值即可
            FormItemState.formItemData[keyAndVal[0]] = resetBooleanOrDefault(
              keyAndVal[1]
            );
            return {};
          } else if (keyAndVal.length == 3) {
            FormItemState.formItemData[
              keyAndVal[0]
            ] = `${keyAndVal[1]}:${keyAndVal[2]}`;
            return {};
          }

          FormItemState.formItemData[textConfig] = "";
          if (textConfig in rule_gen_formitem) {
            const target = rule_gen_formitem[textConfig];
            if ("format" in target) {
              currentValueFormat[target.key] = target.format;
              // delete target.format;
            }
            return rule_gen_formitem[textConfig];
          }
        });
      };
      const copy = (val) => JSON.parse(JSON.stringify(val));

      const createQuickFormRealItem = (): any => {
        // 这里应该存在校验
        return copy(FormItemState.formItemData);
      };
      const cancel = () => {
        showConfig.value = false;
        currentElementInfo = null;
        _reject("user cancel");
        FormItemState.formItemData = {};
        currentValueFormat = {};
      };

      const parseCurrentFormOptions = (options: any) => {
        console.log(options);
      };

      let currentElementInfo: any = null;
      let _reslove: any = null;
      let _reject: any = null;

      return {
        parseCurrentFormOptions,
        getCurrentKeyTypes: (key: string) => {
          return currentKeyTypes[key];
        },
        clearCurrentKeyTypes: () => (currentKeyTypes = {}),
        genConifgForm(info: any) {
          currentElementInfo = info;
          FormItemState.titleType = currentElementInfo;
          const FromConfig = createConigForShotview(
            shotview_conifg[currentElementInfo]
          );
          configQuickForm.formOptions = FromConfig;
          showConfig.value = true;
          return new Promise((resolve, reject) => {
            _reslove = resolve;
            _reject = reject;
          });
        },
        submitFormItem() {
          const conifg = createQuickFormRealItem();
          Object.keys(conifg).forEach((formatKey) => {
            if (currentValueFormat[formatKey]) {
              conifg[formatKey] = currentValueFormat[formatKey](
                conifg[formatKey]
              );
            }
          });
          _reslove(conifg);
          cancel();
        },
        cancel,
        getFormState() {
          return FormItemState.formItemData;
        },
        getTitleType: () => FormItemState.titleType,
      };
    })();

    let _draging_component_name: string | undefined = "";
    const _overed_components = {
      viewType: "",
      elementType: "",
      componentName: "",
    };
    const RootComponent: any = ref([]);
    // 拖动状态快捷设置
    const short_getDom = (fn: (dom?: any, e?: any) => void) => (e?: any) =>
      fn(e?.target, e);
    const elementState = (() => {
      let overedDom: any = null;
      return {
        setOver: short_getDom((dom, e) => {
          // const clientWidth = dom.clientWidth;
          // const clientHeight = dom.clientHeight;
          // const offsetX = e.clientX - dom.clientLeft;
          // const offsetY = e.clientY - dom.clientTop;
          // console.log(offsetX, offsetY);
          if (dom) {
            overedDom = dom;
            dom.classList.add(state_over_class);
          }
        }),
        setDefault: short_getDom((dom, e) => {
          if (dom) {
            dom.classList.remove(state_over_class);
          }
          if (overedDom) {
            overedDom.classList.remove(state_over_class);
          }
        }),
      };
    })();

    const RegisterCache = (() => {
      const counterMap: { TView: number } | {} = {};
      // 緩存了 dom信息
      const cache = {};
      // 映射了 dom信息
      const RegisterMap = {};
      // view层的子父映射关系
      const cacheViewPostionMap = {};
      let defaultKeys: TView[] = [];
      const createElementInfo = (
        viewType: TView,
        elementType: TAtomicts,
        postion: number,
        title?: string
      ): VnodeInfo => {
        // 注冊 只注冊信息 不負責渲染
        const componentName = `${elementType}-${postion}`;
        const children = [];
        const target = null;
        return {
          viewType,
          elementType,
          componentName,
          children,
          target,
          title,
        };
      };

      const getRegisterInfo = (componentName?: string) => {
        return !componentName ? RegisterMap : RegisterMap[componentName];
      };

      const setEl = (componentName: string, vnode: any) => {
        let timer: any = null;
        let counter = 0;
        timer = setInterval(() => {
          if (counter == 20) {
            clearInterval(timer);
          }
          if (vnode.el) {
            RegisterMap[componentName].target = vnode.el;
            clearInterval(timer);
          } else {
            counter++;
          }
        }, 50);
      };

      const swap = (name1, name2) => {
        return new Promise((resolve, reject) => {
          try {
            const parentPosition1 = cacheViewPostionMap[name1];
            const parentPosition2 = cacheViewPostionMap[name2];

            const parentInfo1 = RegisterMap[parentPosition1].children;
            const parentInfo2 = RegisterMap[parentPosition2].children;

            const name1_postion = parentInfo1.findIndex(
              (o) => o.componentName == name1
            );
            const name2_postion = parentInfo2.findIndex(
              (o) => o.componentName == name2
            );
            const name1_target = parentInfo1.splice(
              name1_postion,
              1,
              parentInfo2[name2_postion]
            );
            parentInfo2.splice(name2_postion, 1, name1_target[0]);
            cacheViewPostionMap[name1] = parentPosition2;
            cacheViewPostionMap[name2] = parentPosition1;
            resolve(1);
          } catch (error) {
            reject(0);
          }
        });
      };

      const Render = (renderObject: any) => ({
        render: () => {
          return renderObject.map((info) => {
            if (info.viewType == "shotcut") {
              return elementShotcutGen[info.elementType](
                info,
                info.title ? info.title : info.componentName,
                info.children
              );
            }
            if (info.viewType == "component") {
              return elementComponentGen[info.elementType](
                info,
                info.title ? info.title : info.componentName,
                info.children
              );
            }
          });
        },
      });
      const renderVNodeFromElementInfo = (vnodeInfo: any) => {
        if (!vnodeInfo) return "";
        const retVnodeList: any[] = [];
        const viewType = vnodeInfo.viewType;
        const elementType = vnodeInfo.elementType;
        const options = vnodeInfo.option;

        if (viewType == "component") {
          return elementComponentGen[elementType](
            vnodeInfo,
            vnodeInfo.title,
            vnodeInfo.children.map((info) => renderVNodeFromElementInfo(info))
          );
        }

        if (viewType == "utils") {
          return elementUtilsGen[elementType]("请首先放置容器元素", "warn");
        }
        return retVnodeList;
      };
      const getInfos = (viewType: TView): { render: any } => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        getInfos.cachce = cache[viewType];
        return {
          ...cache[viewType],
          ...Render(cache[viewType]),
        };
      };

      const remove = (viewType: TView, componentName: string) => {
        if (componentName in RegisterMap) {
          delete RegisterMap[componentName];
          const index = cache[viewType].findIndex(
            (info) => info.componentName == componentName
          );
          if (index == -1) return;
          cache[viewType].splice(index, 1);
        }
      };

      class Factor {
        constructor(Obj: {}) {
          Object.keys(Obj).forEach((key) => (this[key] = Obj[key]));
        }
        setPosition(parentName: string | null | undefined) {
          const myThis: any = this;
          if (!parentName) {
            // 挂在到page 作为根节点
            parentName = "page";
          }
          const childName = myThis.componentName;
          cacheViewPostionMap[childName] = parentName;
          return this;
        }
      }

      const register = (
        viewType: TView,
        elementType: TAtomicts,
        title?: string
      ) => {
        let ret: any = {};

        if (defaultKeys.indexOf(viewType) >= 0) {
          // 注冊
          counterMap[viewType]++;
          const pos = counterMap[viewType];
          const vnodeInfo = createElementInfo(
            viewType,
            elementType,
            pos,
            title
          );
          cache[viewType].push(vnodeInfo);
          RegisterMap[vnodeInfo.componentName] = ret = new Factor(vnodeInfo);
        }
        return ret;
      };
      const init = (arr: TView[]) => {
        defaultKeys = arr;
        arr.forEach((type) => {
          cache[type] = [];
          counterMap[type] = 0;
        });
        return {
          register,
          getInfos,
          setEl,
          getRegisterInfo,
          renderVNodeFromElementInfo,
          remove,
          swap,
        };
      };
      return {
        init,
      };
    })();

    const RegisterIns = RegisterCache.init([
      "component",
      "container",
      "shotcut",
    ]);

    // RootComponent.value = [RegisterIns.register("component", "container-view")];

    const dragEvent = (() => {
      return (
        elementType: TAtomicts,
        viewType: TView,
        componentName?: string
      ) => {
        const EventRansit = (eventType: string, fn: (e: any) => void) => {
          return function (e) {
            // console.log(eventType, viewType, componentName);
            if (viewType == "component") {
              // console.log("組件觸發事件");
            } else if (viewType == "container") {
              // console.log("容器觸發時間");
            } else if (viewType == "shotcut") {
              // console.log("快捷方式觸發事件");
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            fn.call(this, e);
          };
        };
        const registerToCache = (eventType: string, fn: (e: any) => void) => {
          return EventRansit(eventType, fn);
        };
        const drag = registerToCache("drag", (e) => {
          //
          // _droped_components_name = "";
          if (componentName) {
            _draging_component_name = componentName;
          }
          e.stopPropagation();
          // return e.preventDefault();
        });
        const dragleave = registerToCache("dragleave", (e) => {
          elementState.setDefault();
          e.stopPropagation();
          return e.preventDefault();
        });

        const dragover = registerToCache("dragover", (e) => {
          if (componentName && componentName?.indexOf("shotcut") >= 0) return;
          _overed_components.componentName = componentName || "";
          _overed_components.elementType = elementType;
          _overed_components.viewType = viewType;
          if (componentName) {
            const info = RegisterIns.getRegisterInfo(componentName);
            elementState.setOver({ target: info.target });
          }

          e.stopPropagation();
          return e.preventDefault();
        });
        const mousemove = registerToCache("mousemove", (e) => {
          // const offsetX = e.clientX - e.target.clientLeft;
          // const offsetY = e.clientY - e.target.clientTop;
          // console.log(componentName, offsetX, offsetY);
        });
        const drop = registerToCache("drop", (e) => {
          // 容器渲染
          if (_overed_components.viewType == "container") {
            if (!_draging_component_name) return;
            const currentDraggingElement = RegisterIns.getRegisterInfo(
              _draging_component_name
            );
            // 空的容器 只有 放置快捷 一種
            if (currentDraggingElement.viewType == "shotcut") {
              // 拖拽到容器中的是 快捷
              // 快捷 只有容器类型可被首次创建
              if (currentDraggingElement.elementType !== "shotcut-view") {
                RootComponent.value = {
                  viewType: "utils",
                  elementType: "utils-tooltip",
                  option: { title: "请首先放置容器", type: "warn" },
                };
              } else {
                // 説明 放在的容器裏
                // 創建 view-container
                // 保存根節點
                RootComponent.value = RegisterIns.register(
                  "component",
                  elementType
                ).setPosition();
                // RegisterIns.setRegisterPostionMap();
                // dragSlot.value = RegisterIns.getInfos("component").render();
                // dragSlot.value = [RegisterIns.renderVNodeFromElementInfo(RootComponent)]
              }
            }
          } else {
            // 其他渲染
            const FatherInfo = RegisterIns.getRegisterInfo(
              _overed_components.componentName
            );
            const childInfo = RegisterIns.getRegisterInfo(
              _draging_component_name as string
            );
            // 子 來自 shotcut 需要 注冊一個
            if (childInfo.viewType == "shotcut") {
              if (childInfo.elementType == "shotcut-view") {
                FatherInfo.children.push(
                  // 這裏先寫死
                  // 需要 動態 根據 shotcut類型來創建 注冊類型
                  RegisterIns.register(
                    "component",
                    "container-view"
                  ).setPosition(FatherInfo.componentName)
                );
                // RootComponent.value = RootComponent.value;
                Ins.$forceUpdate();
                // RootComponent.value = RegisterIns.renderVNodeFromElementInfo(RootComponent);
                // dragSlot.value = [
                //   RegisterIns.renderVNodeFromElementInfo(RootComponent),
                // ];
              } else {
                handlerFormItemEvent
                  .genConifgForm(childInfo.elementType)
                  .then((config: any) => {
                    // 设置动态依赖
                    if (config.key) {
                      const type =
                        handlerFormItemEvent.getCurrentKeyTypes("key");
                      // const defaultValue = handlerFormItemEvent.getCurrentKeyTypes("defaultValue")
                      FormQuickDataLib[FatherInfo.componentName][config.key] =
                        type == "array"
                          ? config.defaultValue
                            ? config.defaultValue.split(",")
                            : []
                          : config.defaultValue;
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    window.FormQuickDataLib = FormQuickDataLib;
                    FormQuickOptionsLib[
                      FatherInfo.componentName
                    ].formOptions.push(config);
                  })
                  .catch((e) => {
                    console.log(e);
                  });

                // dragSlot.value = RegisterIns.getInfos("component").render();
              }
            } else {
              //其他情況 如 容器内的子容器互換位置等
              RegisterIns.swap(
                _draging_component_name,
                _overed_components.componentName
              )
                .then(() => {
                  Ins.$forceUpdate();
                })
                .catch(() => {
                  console.log("交换失败， 不要与根节点交换");
                });
            }
          }

          elementState.setDefault();
          _overed_components.componentName = "";
          _overed_components.elementType = "";
          _overed_components.viewType = "";

          e.stopPropagation();
          return e.preventDefault();
        });
        return { drag, dragleave, dragover, drop, mousemove };
      };
    })();

    let short_cut_inited = false;
    const createItemShortcut = (registerList: TregisterData[]) => {
      !short_cut_inited &&
        registerList.forEach((registerInfo) => {
          RegisterIns.register(
            "shotcut",
            registerInfo.elementType,
            registerInfo.title
          );
        });
      short_cut_inited = true;
      return RegisterIns.getInfos("shotcut").render();
    };

    // 注册拖拽元素
    const dragEventRegister = dragEvent("container-view", "container");

    const configQuickForm: any = reactive({
      formOptions: [],
      layout: {
        labelWidth: 100,
        size: "default",
        labelPosition: "right",
      },
    });

    const StartEdit = () => {
      Object.keys(FormQuickOptionsLib).forEach((info) => {
        FormQuickOptionsLib[info].drag = !FormQuickOptionsLib[info].drag;
      });
    };
    return function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // console.log(1111, this.$forceUpdate);
      Ins = this;
      return (
        <div class={classes.dragLayout}>
          <div class={classes.dragTitle}>
            拖拽布局
            <el-button
              style="float: right"
              onClick={StartEdit}
              size="small"
              type="primary"
            >
              开始/结束编辑
            </el-button>
          </div>
          <div class={classes.dragIntro}>
            <p>
              使用説明:
              <br />
              ①创建表单之前需要首先进行页面布局
              <br />
              ②拖拽表单元素到布局好的容器中 <br />
              ③设置表单元素属性 <br />
              ④表单元素创建完成
            </p>
            <p>
              如何布局： <br />
              1 拖动【容器】到空白页面 创建根节点 <br />
              2 拖动【容器】到空白页面创建好的【容器视图】中， 创建子布局
              <br />3 拖动【容器】到空白页面创建好的【容器视图】中，
              如果该【容器视图】已经有创建好的子【容器视图】那么该【容器】（拖动中的【容器】）将被创建为兄弟【容器视图】
            </p>
            <p>
              如何创建表单：
              <br />
              1 拖动表单元素（目前除了容器 都属于表单元素）至
              【最上层视图】（最上层视图带有标题）中
              <br />
              2 出现配置表单元素的弹窗
              <br />3 点击确定 创建完成 点击取消 创建取消
            </p>
            <p>
              主要表单属性解释：
              <br />1 列名 表单的列名 <br />
              2 主键 该列名对应的key 如 列名为 “姓名” 主键为 "name"
              <br />3 指令 目前支持的指令为 sif （控制该列的显示与隐藏）格式为
              【指令】=【表达式】 如： sif = scope.state == 1 && scope.name !==
              ""。 scope.name 格式为【固定字段】.【主键】
            </p>
          </div>
          <div class={classes.dragContent}>
            <div class={[classes.toolbar, "reset__scrollbar"]}>
              {createItemShortcut([
                { elementType: "shotcut-view", title: "容器" },
                { elementType: "shotcut-input", title: "输入" },
                { elementType: "shotcut-button", title: "按钮" },
                { elementType: "shotcut-text", title: "文本" },
                { elementType: "shotcut-select", title: "选择" },
                { elementType: "shotcut-radio", title: "单选" },
                { elementType: "shotcut-checkbox", title: "多选" },
                { elementType: "shotcut-textarea", title: "文本域" },
                { elementType: "shotcut-upload", title: "上传" },
                { elementType: "shotcut-switch", title: "开关" },
              ])}
            </div>
            <div
              draggable="false"
              class={classes.dragView}
              onDrop={dragEventRegister.drop}
              onDragover={dragEventRegister.dragover}
            >
              {/* {RootComponent.value} */}
              {[RegisterIns.renderVNodeFromElementInfo(RootComponent.value)]}
            </div>
          </div>
          <el-dialog
            modelValue={showConfig.value}
            title={handlerFormItemEvent.getTitleType() + "类型设置"}
            showClose={false}
            beforeClose={handlerFormItemEvent.cancel}
            width="600px"
          >
            <quick-form
              ref="configQuickForm"
              quickOptions={configQuickForm}
              form-data={handlerFormItemEvent.getFormState()}
            ></quick-form>
            <div style="text-align: right">
              <el-button
                type="warning"
                size="small"
                onClick={handlerFormItemEvent.cancel}
              >
                取消
              </el-button>
              <el-button
                type="primary"
                size="small"
                onClick={handlerFormItemEvent.submitFormItem}
              >
                保存
              </el-button>
            </div>
          </el-dialog>
        </div>
      );
    };
  },
});
