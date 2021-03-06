import { componentSizes, ElButton } from "element-plus";
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
// ???????????? component??????????????????| shotcut?????????????????????????????????| container (?????????)
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

    // ????????????
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
    // ????????? ??????
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
    // form ????????????
    const option_temp = {
      formOptions: [],
      layout: {
        labelWidth: 100,
        size: "default",
        labelPosition: "right",
      },
      edit: false,
    };
    const FormQuickOptionsLib = reactive({});

    const FormQuickDataLib = reactive({});

    const FormQuickEventLisb = {};
    // ???????????????
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

                handlerFormItemEvent.parseCurrentFormOptions(
                  option,
                  registerInfo.componentName
                );
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
            [
              `??????${registerInfo.componentName}`,
              h(
                ElButton,
                {
                  style: "float: right",
                  type: `${
                    FormQuickOptionsLib[registerInfo.componentName].edit
                      ? "success"
                      : "primary"
                  }`,
                  size: "small",
                  onClick: () => {
                    const currentEdit =
                      FormQuickOptionsLib[registerInfo.componentName].edit;
                    FormQuickOptionsLib[registerInfo.componentName].edit =
                      !currentEdit;
                  },
                },
                () => [
                  `${
                    FormQuickOptionsLib[registerInfo.componentName].edit
                      ? "??????"
                      : "??????"
                  }`,
                ]
              ),
            ]
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
        // input ?????????
        // button ?????????
        return (
          <el-dialog modelValue={showConfig.value} title="Tips" width="30%">
            <span>This is a message</span>
          </el-dialog>
        );
      },
    };

    // ?????????????????????
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

    // ????????????????????????
    const showConfig = ref(false);

    enum ViewConifgEnum {
      "input" = "shotcut-input",
      "switch" = "shotcut-switch",
      "textarea" = "shotcut-textarea",
      "button" = "shotcut-button",
      "text" = "shotcut-text",
      "select" = "shotcut-select",
      "radio" = "shotcut-radio",
      "checkbox" = "shotcut-checkbox",
      "upload" = "shotcut-upload",
    }
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
              placeholder: placeholder ? placeholder : "?????????" + name,
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
              // placeholder: placeholder ? placeholder : "?????????" + name,
              placeholder: "?????????",
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

      // ??????????????????????????????
      const rule_gen_formitem = {
        formElementLabel: defaultEventTypeForForm.input(
          "??????",
          "formElementLabel"
        ),
        key: defaultEventTypeForForm.input("??????", "key"),

        placeholder: defaultEventTypeForForm.input("?????????", "placeholder"),
        directives: defaultEventTypeForForm.input(
          "??????",
          "directives",
          "??????????????????sif=scope.state == 1 && scope.name == ''",
          function (val) {
            let ret: any = "";
            const reg = /(?<!=)=(?!=)/;
            if (!val) return "";
            try {
              ret = val.split(",").reduce((ref, cur) => {
                const orginDerictives = cur.split(reg);
                if (!HasDirective(orginDerictives[0]))
                  throw `??????????????????${orginDerictives[0]}`;
                ref.push([orginDerictives[0], orginDerictives[1]]);
                return ref;
              }, []);
            } catch (error) {
              console.error("quick-form ????????????????????????", error);
              ret = "";
            }
            return ret;
          }
        ),
        children: defaultEventTypeForForm.input(
          "?????????",
          "children",
          "?????????????????????????????????????????????",
          function (val) {
            return val.split(",");
          }
        ),
        defaultValue: defaultEventTypeForForm.input("?????????", "defaultValue"),
        type: defaultEventTypeForForm.input("????????????", "type"),
        textValue: defaultEventTypeForForm.input("?????????", "textValue"),
        // multiple: defaultEventTypeForForm.select("????????????", "multiple",
        //[
        //   { label: "???", value: true },
        //   { label: "???", value: false },
        // ]),
        options: defaultEventTypeForForm.input(
          "????????????",
          "options",
          "?????????????????????label=???&value=0,label=???&value=1",
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
              console.error("quick-form ??????????????????", error);
              return [];
            }
          }
        ),
        childrenOptions: defaultEventTypeForForm.input(
          "????????????",
          "childrenOptions",
          "?????????????????????label=???&value=0,label=???&value=1",
          function (val) {
            try {
              return val.split(",").reduce((ref, cur) => {
                const lableAnVal = cur.split("&").reduce((lvref, lvstr) => {
                  const lv = lvstr.split("=");
                  // radio???????????? label == children[]
                  // radio???????????? value == label
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
              console.error("quick-form ??????????????????", error);
              return [];
            }
          }
        ),
        action: defaultEventTypeForForm.input(
          "?????? URL",
          "action",
          "???????????????URL?????????????????????#"
        ),
        multiple: defaultEventTypeForForm.radios("", "multiple", [
          { label: false, children: ["??????"] },
          { label: true, children: ["??????"] },
        ]),
        listType: defaultEventTypeForForm.select("????????????", "listType", [
          { label: "text", value: "text" },
          { label: "picture", value: "picture" },
          { label: "picture-card", value: "picture-card" },
        ]),
      };
      // ?????????????????? ?????????
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
          "key-array", // ????????????????????????
          "childrenOptions",
          "defaultValue",
          "directives",
        ],
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
      // ?????????????????? ???????????? format
      let currentValueFormat = {};
      // ??????????????????
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
            // keyAndVal ??????????????? ??????????????????  ??????????????????
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
        // ????????????????????????
        return copy(FormItemState.formItemData);
      };
      const cancel = () => {
        showConfig.value = false;
        currentElementInfo = null;
        _reject("user cancel");
        FormItemState.formItemData = {};
        currentValueFormat = {};
      };

      const parseCurrentFormOptions = (options: any, componentName: string) => {
        const type = options.formElementType;
        handlerFormItemEvent
          .genConifgForm(ViewConifgEnum[type], options)
          .then((config) => {
            // console.log(config);
            Object.keys(config as {}).forEach((key) => {
              options[key] = (config as {})[key];
            });
          });
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
        genConifgForm(info: any, defaultInfo?: {}) {
          if (defaultInfo) {
            FormItemState.formItemData = copy(defaultInfo);
          } else {
            currentElementInfo = info;
            FormItemState.titleType = currentElementInfo;
            const FromConfig = createConigForShotview(
              shotview_conifg[currentElementInfo]
            );
            configQuickForm.formOptions = FromConfig;
          }

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
    // ????????????????????????
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
      // ????????? dom??????
      const cache = {};
      // ????????? dom??????
      const RegisterMap = {};
      // view????????????????????????
      const cacheViewPostionMap = {};
      let defaultKeys: TView[] = [];
      const createElementInfo = (
        viewType: TView,
        elementType: TAtomicts,
        postion: number,
        title?: string
      ): VnodeInfo => {
        // ?????? ??????????????? ???????????????
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
          return elementUtilsGen[elementType]("???????????????????????????", "warn");
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
            // ?????????page ???????????????
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
          // ??????
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
              // console.log("??????????????????");
            } else if (viewType == "container") {
              // console.log("??????????????????");
            } else if (viewType == "shotcut") {
              // console.log("????????????????????????");
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
          // ????????????
          if (_overed_components.viewType == "container") {
            if (!_draging_component_name) return;
            const currentDraggingElement = RegisterIns.getRegisterInfo(
              _draging_component_name
            );
            // ???????????? ?????? ???????????? ??????
            if (currentDraggingElement.viewType == "shotcut") {
              // ???????????????????????? ??????
              // ?????? ????????????????????????????????????
              if (currentDraggingElement.elementType !== "shotcut-view") {
                RootComponent.value = {
                  viewType: "utils",
                  elementType: "utils-tooltip",
                  option: { title: "?????????????????????", type: "warn" },
                };
              } else {
                // ?????? ??????????????????
                // ?????? view-container
                // ???????????????
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
            // ????????????
            const FatherInfo = RegisterIns.getRegisterInfo(
              _overed_components.componentName
            );
            const childInfo = RegisterIns.getRegisterInfo(
              _draging_component_name as string
            );
            // ??? ?????? shotcut ?????? ????????????
            if (childInfo.viewType == "shotcut") {
              if (childInfo.elementType == "shotcut-view") {
                FatherInfo.children.push(
                  // ???????????????
                  // ?????? ?????? ?????? shotcut??????????????? ????????????
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
                    console.log(config);
                    // ??????????????????
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
              //???????????? ??? ????????????????????????????????????
              RegisterIns.swap(
                _draging_component_name,
                _overed_components.componentName
              )
                .then(() => {
                  Ins.$forceUpdate();
                })
                .catch(() => {
                  console.log("??????????????? ????????????????????????");
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

    // ??????????????????
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
            ????????????
            <el-button
              style="float: right"
              onClick={StartEdit}
              size="small"
              type="primary"
            >
              ??????/????????????
            </el-button>
          </div>
          <div class={classes.dragIntro}>
            <p>
              ????????????:
              <br />
              ???????????????????????????????????????????????????
              <br />
              ????????????????????????????????????????????? <br />
              ??????????????????????????? <br />
              ???????????????????????????
            </p>
            <p>
              ??????????????? <br />
              1 ????????????????????????????????? ??????????????? <br />
              2 ????????????????????????????????????????????????????????????????????? ???????????????
              <br />3 ?????????????????????????????????????????????????????????????????????
              ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            </p>
            <p>
              ?????????????????????
              <br />
              1 ??????????????????????????????????????? ???????????????????????????
              ?????????????????????????????????????????????????????????
              <br />
              2 ?????????????????????????????????
              <br />3 ???????????? ???????????? ???????????? ????????????
            </p>
            <p>
              ???????????????????????????
              <br />1 ?????? ??????????????? <br />
              2 ?????? ??????????????????key ??? ????????? ???????????? ????????? "name"
              <br />3 ?????? ???????????????????????? sif ?????????????????????????????????????????????
              ????????????=??????????????? ?????? sif = scope.state == 1 && scope.name !==
              ""??? scope.name ???????????????????????????.????????????
            </p>
          </div>
          <div class={classes.dragContent}>
            <div class={[classes.toolbar, "reset__scrollbar"]}>
              {createItemShortcut([
                { elementType: "shotcut-view", title: "??????" },
                { elementType: "shotcut-input", title: "??????" },
                { elementType: "shotcut-button", title: "??????" },
                { elementType: "shotcut-text", title: "??????" },
                { elementType: "shotcut-select", title: "??????" },
                { elementType: "shotcut-radio", title: "??????" },
                { elementType: "shotcut-checkbox", title: "??????" },
                { elementType: "shotcut-textarea", title: "?????????" },
                { elementType: "shotcut-upload", title: "??????" },
                { elementType: "shotcut-switch", title: "??????" },
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
            title={handlerFormItemEvent.getTitleType() + "????????????"}
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
                ??????
              </el-button>
              <el-button
                type="primary"
                size="small"
                onClick={handlerFormItemEvent.submitFormItem}
              >
                ??????
              </el-button>
            </div>
          </el-dialog>
        </div>
      );
    };
  },
});
