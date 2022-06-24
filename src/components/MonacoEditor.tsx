import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  PropType,
  ref,
  watchEffect,
  Ref,
  toRefs,
  watch,
  nextTick,
} from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const editorProps: { code: PropType<string>; height: PropType<number> } = {
  code: String,
  height: Number,
} as const;

const GetEditor = (curIns: any, code: any) => {
  const Mo = monaco.editor.create(curIns?.refs.monaco, {
    // acceptSuggestionOnEnter: "on",
    // accessibilitySupport: "auto",
    // autoClosingBrackets: "always",
    theme: "vs-dark",
    readOnly: false,
    value: code,
    // language: "javascript",
    minimap: {
      enabled: false, // 是否启用预览图
    },
    tabSize: 2,
    scrollBeyondLastLine: false,
    // automaticLayout: true,
    // folding: true,
    // colorDecorators: true,
    // autoIndent: "brackets",
  });
  // monaco.editor.setModelLanguage(Mo.getModel() as any, "javascript");

  return Mo;
};

export default defineComponent({
  props: editorProps,
  emits: ["getCode"],
  setup(props, { emit }) {
    const curIns: any = getCurrentInstance();
    const { code, height } = toRefs(props);
    let monacoIns: any = null;
    const editorClasses = {
      quickEditorWrap: {
        width: "600px",
        height: height.value + "px",
        display: "inline-block",
        position: "relative",
      },
      mocaWarp: {
        width: "600px",
        height: height.value + "px",
        display: "inline-block",
      },
      quickRun: {
        position: "absolute",
        top: "0px",
        right: 0,
        color: "#fff",
        background: "green",
        display: "inline-block",
        padding: "2px 8px",
        "border-radius": "2px",
        cursor: "pointer",
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(editorClasses);
    onMounted(() => {
      if (!monacoIns) {
        monacoIns = GetEditor(curIns, code.value);
        // monacoIns.trigger("anyString", "editor.action.fomart");
        nextTick(() => {
          console.log(monacoIns.getAction(["editor.action.formatDocument"]));
        });
      } else {
        monacoIns.setValue(code.value);
      }
    });
    const getRunCode = () => {
      emit("getCode", monacoIns.getValue());
    };

    watch(code, () => {
      if (!monacoIns) return;
      monacoIns.setValue(code.value);
      // monacoIns.trigger("anyString", "editor.action.formatDocument");
    });

    return function () {
      return (
        <div class={classes.quickEditorWrap}>
          <div class={classes.mocaWarp} ref="monaco"></div>
          <span onClick={getRunCode} class={classes.quickRun}>
            运行
          </span>
        </div>
      );
    };
  },
});
