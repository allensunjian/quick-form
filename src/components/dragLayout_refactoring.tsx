import { defineComponent, ref, Ref } from "vue";
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
    display: "flex",
    flex: 1,
    border: "2px dashed var(--el-color-primary-dark-2)",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    color: "var(--el-menu-border-color)",
  },
  stateOver: {
    border: "1px solid var(--el-color-success)",
    boxSizing: "border-box",
  },
};
const state_over_class = "quick-form__state--element-over";
type TAtomicts = "view" | "container" | "radio" | "container-view";
type TLayoutAtomic = {
  type: TAtomicts;
  text: string;
  isQuickShort?: boolean;
};
type IObject<T, U> = {
  T: U;
};
export default defineComponent({
  setup: () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(dragViewClasses);

    const elementMap: any = {
      container: (text: string, children: any[] = []) => {
        // console.log("1创建", "container");
        const containerDragRegister = dragEvent("container-view");
        return (
          <div
            draggable="true"
            class={classes.dragElementView}
            onDrag={containerDragRegister.drag}
            onDragleave={containerDragRegister.dragleave}
            onDragover={containerDragRegister.dragover}
          >
            {children.length > 0 ? children : text}
          </div>
        );
        return [];
      },
    };

    const dragSlot: Ref<any[]> = ref([]);

    const dragEvent = (() => {
      const setEffect = (e) => {
        e.dataTransfer.dropEffect = "move";
      };
      const GetRegisterElementType = (() => {
        const typeCounterMap: { TAtomicts: number } | {} = {};
        return (type: TAtomicts): string => {
          if (typeCounterMap[type] > 0) {
            typeCounterMap[type]++;
          } else {
            typeCounterMap[type] = 1;
          }
          return `${type}-${typeCounterMap[type]}`;
        };
      })();

      const resgisterList: IObject<string, string> | {} = {};

      const configItemsInfo = {};
      const ViewSet: any[] = [];
      const ViewPostionMap = {};

      const short_getDom = (fn: (dom: any) => void) => (e) => fn(e.target);
      const elementState = {
        setOver: short_getDom((dom) => {
          dom.classList.add(state_over_class);
        }),
        setDefault: short_getDom((dom) => {
          dom.classList.remove(state_over_class);
        }),
      };

      const renderVNodeFromElementInfo = (setArr: any[]) => {
        const retVnodeList: any[] = [];
        setArr.forEach((info) => {
          const type = info.type;
          const children = info.children;
          if (elementMap[type]) {
            retVnodeList.push(elementMap[type](info.elementType, children));
            return retVnodeList;
          } else {
            return [];
          }
        });
        return retVnodeList;
      };
      const defaultEvents = {
        view: (currentDropView: string) => {
          // console.log(
          //   _dragElementType + "在view:" + currentDropView + "中释放了";
          //   if ()
          // );
          const currentDropViewInfo = resgisterList[currentDropView];
          if (currentDropViewInfo) {
            currentDropViewInfo.children &&
              currentDropViewInfo.children.push(_dragElementType);
            // console.log(currentDropViewInfo);
            const currentDragTar = resgisterList[_dragElementType];
            const orginType = currentDragTar.type;
            dragSlot.value.push(elementMap[orginType](_dragElementType));
            console.log(dragSlot);
          }
        },
      };
      // cache current dragging elementType;
      let _dragElementType = "";
      // current drag overed elementType
      let _dragElementOveredType = "";

      let RootElementInfo: any = null;

      // second resgister element doc dep on event tirrger only once
      const registerSecondDocElement = (
        elementType: string,
        type: TAtomicts,
        isRoot: boolean,
        isQuickShort?: boolean,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fn: (e: any) => void
      ) => {
        return function (e: any) {
          setEffect(e);
          const { target } = e;
          const elementInfo = {
            elementType,
            target,
            type,
            children: [],
          };
          if (isQuickShort) {
            // 不能被注册
            configItemsInfo[elementType] = elementInfo;
          } else {
            if (!resgisterList[elementType]) {
              resgisterList[elementType] = elementInfo;
            } else {
              resgisterList[elementType].target = target;
            }
          }
          isRoot && !RootElementInfo && (RootElementInfo = elementInfo);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fn.call(this, e);
        };
      };
      // first register element type
      function registerFristType(
        type: TAtomicts,
        isRoot?: boolean,
        isQuickShort?: boolean
      ) {
        const FirstRegisterElementtype = GetRegisterElementType(type);
        return {
          drag: registerSecondDocElement(
            FirstRegisterElementtype,
            type,
            Boolean(isRoot),
            Boolean(isQuickShort),
            (e: any) => {
              e.dataTransfer.dropEffect = "move";
              _dragElementType = FirstRegisterElementtype;
              return e.preventDefault();
            }
          ),
          dragleave: registerSecondDocElement(
            FirstRegisterElementtype,
            type,
            Boolean(isRoot),
            Boolean(isQuickShort),
            (e: Event) => {
              elementState.setDefault(e);
            }
          ),
          dragover: registerSecondDocElement(
            FirstRegisterElementtype,
            type,
            Boolean(isRoot),
            Boolean(isQuickShort),
            (e: any) => {
              elementState.setOver(e);
              _dragElementOveredType = FirstRegisterElementtype;
              console.log(_dragElementOveredType);
              e.stopPropagation();
              return e.preventDefault();
            }
          ),
          drop: registerSecondDocElement(
            FirstRegisterElementtype,
            type,
            Boolean(isRoot),
            Boolean(isQuickShort),
            (e: any) => {
              elementState.setDefault(e);

              const isConfigInfo = configItemsInfo[_dragElementType];

              if (isConfigInfo) {
                // 是配置詳情
                if (_dragElementOveredType) {
                  const child = {
                    // elementType: GetRegisterElementType("container-view"),
                    type: "container",
                    children: [],
                    target: null,
                  };
                  if (RootElementInfo.children == 0) {
                    const Father = resgisterList[_dragElementOveredType];
                    Father.children.push(child);
                  } else {
                    const Father = resgisterList[_dragElementOveredType];
                    // const child = resgisterList[_dragElementType];
                    Father.children.push(child);
                  }
                  // RootElementInfo.children.push(child);
                  console.log(RootElementInfo.children);
                }
              } else {
                // 不是配置詳情
              }

              dragSlot.value = renderVNodeFromElementInfo(
                RootElementInfo.children
              );
              e.stopPropagation();
              return e.preventDefault();
            }
          ),
        };
      }
      return registerFristType;
    })();
    const toolbaritems = (() => {
      let itemVnodes: any[] = [];
      return (text: TLayoutAtomic[]) => {
        if (itemVnodes.length > 0) return itemVnodes;
        itemVnodes = text.map((txt) => {
          const dragEventRegister = dragEvent(
            txt.type,
            false,
            Boolean(txt.isQuickShort)
          );
          return (
            <span
              draggable="true"
              class={classes.toolbarItem}
              onDrag={dragEventRegister.drag}
              onDragleave={dragEventRegister.dragleave}
              onDragover={dragEventRegister.dragover}
            >
              {txt.text}
            </span>
          );
        });
        return itemVnodes;
      };
    })();

    const dragEventRegister = dragEvent("view", true);
    return () => (
      <div class={classes.dragLayout}>
        <div class={classes.dragTitle}>拖拽布局</div>
        <div class={classes.dragContent}>
          <div class={classes.toolbar}>
            {toolbaritems([
              { type: "container", text: "容器", isQuickShort: true },
            ])}
          </div>
          <div
            draggable="true"
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
