import { defineComponent, ref, Ref, nextTick } from "vue";
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
const state_over_class = "quick-form__state--element-over";

type Tshotcut = "shotcut-view";
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

const elementGen = {
  // container: () => {},
  // containerView: () => {},
};
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(dragViewClasses);
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
    };
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
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              // <QuickForm
              //   form-data={FromData}
              //   quickOptions={QuickFormOptions}
              // ></QuickForm>
              title
              ? title
              : registerInfo.componentName}
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

    const FromData = {
      inputValue1: "",
      inputValue2: "",
    };
    const QuickFormOptions = {
      formOptions: [
        {
          formElementLabel: "text",
          formElementType: "input",
          key: "inputValue",
          placeholder: "placeholder",
        },
        {
          formElementLabel: "number",
          formElementType: "input:number",
          key: "inputValue1",
          placeholder: "placeholder",
        },
        {
          formElementLabel: "textarea",
          formElementType: "input:textarea",
          key: "inputValue2",
          placeholder: "placeholder",
        },
        {
          formElementLabel: "maxlengh",
          formElementType: "input:textarea",
          key: "inputValue2",
          maxlength: "100",
          showWordLimit: true,
          placeholder: "placeholder",
        },
      ],
      layout: {
        labelWidth: 100,
        size: "default",
        labelPosition: "right",
      },
    };

    const dragSlot: Ref<any[]> = ref([]);

    let _draging_component_name: string | undefined = "";
    const _overed_components = {
      viewType: "",
      elementType: "",
      componentName: "",
    };
    let RootComponent: any = null;
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

      const register = (
        viewType: TView,
        elementType: TAtomicts,
        title?: string
      ) => {
        let ret: any = {};
        if (defaultKeys.indexOf(viewType) >= 0) {
          console.log("注冊", defaultKeys, viewType);
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
        console.log("開始注冊", viewType, "類名", elementType);

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
            console.log("放在了容器裏");
            // 説明 放在的容器裏
            // 創建 view-container
            // 保存根節點
            RootComponent = RegisterIns.register("component", elementType);

            dragSlot.value = RegisterIns.getInfos("component").render();
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
              FatherInfo.children.push(
                // 這裏先寫死
                // 需要 動態 根據 shotcut類型來創建 注冊類型
                RegisterIns.register("component", "container-view")
              );

              dragSlot.value = [
                RegisterIns.renderVNodeFromElementInfo(RootComponent),
              ];
            }

            console.log(childInfo, FatherInfo);
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
    return () => (
      <div class={classes.dragLayout}>
        <div class={classes.dragTitle}>拖拽布局</div>
        <div class={classes.dragContent}>
          <div class={classes.toolbar}>
            {createItemShortcut([
              { elementType: "shotcut-view", title: "容器" },
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
      </div>
    );
  },
});
