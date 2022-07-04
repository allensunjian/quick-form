import { AnyColumns } from "element-plus/lib/components/table-v2/src/types.js";
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
import { QuickForm } from "../../build/index.js";
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

type Tshotcut = "shotcut-view" | "shotcut-input" | "shotcut-button";
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
    const elementShotcutGen = {
      "shotcut-view": (registerInfo: any, title, children: any[]) => {
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
          RegisterIns.setEl(
            registerInfo.componentName,
            vnode.el as HTMLElement
          );
        });

        return vnode;
      },
      "shotcut-input": (registerInfo: any, title, children: any[]) => {
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
            {title}
          </div>
        );
        nextTick(() => {
          RegisterIns.setEl(
            registerInfo.componentName,
            vnode.el as HTMLElement
          );
        });

        return vnode;
      },
      "shotcut-button": (registerInfo: any, title, children: any[]) => {
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
            {title}
          </div>
        );
        nextTick(() => {
          RegisterIns.setEl(
            registerInfo.componentName,
            vnode.el as HTMLElement
          );
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
    };
    const FormQuickOptionsLib = reactive({});

    const FormQuickDataLib = reactive({});
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
        console.log(
          "表单绑定",
          FormQuickDataLib,
          FormQuickDataLib[registerInfo.componentName]
        );
        const form: any = h(QuickForm, {
          ref: registerInfo.componentName,
          formData: FormQuickDataLib[registerInfo.componentName],
          quickOptions: FormQuickOptionsLib[registerInfo.componentName],
        });
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
        console.log(vnode);
        nextTick(() => {
          RegisterIns.setEl(
            registerInfo.componentName,
            vnode.el as HTMLElement
          );
        });
        return vnode;
      },
    };
    // 工具类视图元素
    const elementUtilsGen = {
      tooltip: (text: string, type: TToolState) => {
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
              formElementLabel: name,
              key,
              placeholder: placeholder ? placeholder : "请输入" + name,
              formElementType: "input",
            },
            format ? { format } : {}
          ),
      };

      // 表单配置字段构建规则
      const rule_gen_formitem = {
        formElementLabel: defaultEventTypeForForm.input(
          "名称",
          "formElementLabel"
        ),
        key: defaultEventTypeForForm.input("主键", "key"),
        placeholder: defaultEventTypeForForm.input("占位符", "placeholder"),
        diretives: defaultEventTypeForForm.input("指令", "diretives"),
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
      };
      // 表单元素动态 配置项
      const shotview_conifg = {
        "shotcut-input": [
          "formElementType:input",
          "formElementLabel",
          "key",
          "placeholder",
          "diretives",
          "defaultValue",
        ],
        "shotcut-button": [
          "formElementType:button",
          "formElementLabel",
          "type",
          "children",
        ],
      };
      // 仓库用于保存 运行时的 format
      let currentValueFormat = {};

      const createConigForShotview = (arr: string[]) => {
        return arr.map((textConfig) => {
          const keyAndVal = textConfig.split(":");
          if (keyAndVal.length == 2) {
            // keyAndVal 两个参数则 已经有默认值  直接赋值即可
            FormItemState.formItemData[keyAndVal[0]] = keyAndVal[1];
            return {};
          }
          FormItemState.formItemData[textConfig] = "";
          if (textConfig in rule_gen_formitem) {
            const target = rule_gen_formitem[textConfig];
            if ("format" in target) {
              currentValueFormat[target.key] = target.format;
              delete target.format;
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

      let currentElementInfo: any = null;
      let _reslove: any = null;
      let _reject: any = null;

      return {
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

    const dragSlot: Ref<any[]> = ref([]);

    let _draging_component_name: string | undefined = "";
    const _overed_components = {
      viewType: "",
      elementType: "",
      componentName: "",
    };
    let RootComponent: any = null;
    // 拖动状态快捷设置
    const short_getDom = (fn: (dom: any, e: any) => void) => (e) =>
      fn(e.target, e);
    const elementState = {
      setOver: short_getDom((dom, e) => {
        // const clientWidth = dom.clientWidth;
        // const clientHeight = dom.clientHeight;
        // const offsetX = e.clientX - dom.clientLeft;
        // const offsetY = e.clientY - dom.clientTop;
        // console.log(offsetX, offsetY);
        dom.classList.add(state_over_class);
      }),
      setDefault: short_getDom((dom, e) => {
        dom.classList.remove(state_over_class);
      }),
    };

    // 表单元素 固定配置项
    // const formCommonConig = {
    //   formElementLabel: {
    //     text: {},
    //     placeholder: "请输入行名称",
    //     key: "formElementLabel",
    //     directives: [],
    //     // 默认值
    //     defaultValue: "",
    //   },
    // };

    const RegisterCache = (() => {
      const counterMap: { TView: number } | {} = {};
      // 緩存了 dom信息
      const cache = {};
      // 映射了 dom信息
      const RegisterMap = {};
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

      const getRegisterInfo = (componentName: string) => {
        return RegisterMap[componentName];
      };

      const setEl = (componentName: string, vnode: HTMLElement) => {
        RegisterMap[componentName].target = vnode;
      };

      const Render = (renderObject: any) => ({
        render: () => {
          console.log("開始渲染", renderObject, cache);
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
        const retVnodeList: any[] = [];
        const viewType = vnodeInfo.viewType;
        const elementType = vnodeInfo.elementType;

        if (viewType == "component") {
          return elementComponentGen[elementType](
            vnodeInfo,
            vnodeInfo.title,
            vnodeInfo.children.map((info) => renderVNodeFromElementInfo(info))
          );
        }

        // setArr.forEach((info) => {
        //   console.log(3333, info);
        //   // const type = info.type;
        //   // const children = info.children;
        //   // if (elementMap[type]) {
        //   //   retVnodeList.push(elementMap[type](info.elementType, children));
        //   //   return retVnodeList;
        //   // } else {
        //   //   return [];
        //   // }
        // });
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
          console.log(cache, RegisterMap);
        }
      };

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
          RegisterMap[vnodeInfo.componentName] = ret = vnodeInfo;
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
          // return e.preventDefault();
        });
        const dragleave = registerToCache("dragleave", (e) => {
          elementState.setDefault(e);
          console.log("leave", componentName);
          //
          e.stopPropagation();
          return e.preventDefault();
        });

        const dragover = registerToCache("dragover", (e) => {
          if (componentName && componentName?.indexOf("shotcut") >= 0) return;
          _overed_components.componentName = componentName || "";
          _overed_components.elementType = elementType;
          _overed_components.viewType = viewType;
          elementState.setOver(e);
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
                dragSlot.value = [
                  elementUtilsGen.tooltip("请首先放置容器元素", "warn"),
                ];
              } else {
                // 説明 放在的容器裏
                // 創建 view-container
                // 保存根節點
                RootComponent = RegisterIns.register("component", elementType);

                dragSlot.value = RegisterIns.getInfos("component").render();
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
                  RegisterIns.register("component", "container-view")
                );
                dragSlot.value = [
                  RegisterIns.renderVNodeFromElementInfo(RootComponent),
                ];
              } else {
                handlerFormItemEvent
                  .genConifgForm(childInfo.elementType)
                  .then((config: any) => {
                    console.log(config);
                    // 设置动态依赖
                    if (config.key) {
                      FormQuickDataLib[FatherInfo.componentName][config.key] =
                        config.defaultValue;
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    window.FormQuickDataLib = FormQuickDataLib;
                    console.log("初始值", FormQuickDataLib);
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
            }
          }
          _overed_components.componentName = "";
          _overed_components.elementType = "";
          _overed_components.viewType = "";
          elementState.setDefault(e);
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
          <div class={classes.dragContent}>
            <div class={classes.toolbar}>
              {createItemShortcut([
                { elementType: "shotcut-view", title: "容器" },
                { elementType: "shotcut-input", title: "输入" },
                { elementType: "shotcut-button", title: "按钮" },
              ])}
            </div>
            <div
              draggable="false"
              class={classes.dragView}
              onDrop={dragEventRegister.drop}
              onDragover={dragEventRegister.dragover}
            >
              {dragSlot.value}
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
