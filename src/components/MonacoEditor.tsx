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
import jss from "jss";
import preset from "jss-preset-default";
jss.setup(preset());
const styles = {
  wrapper: {
    padding: 40,
    background: "#f7df1e",
    textAlign: "center",
  },
  title: {
    font: {
      size: 40,
      weight: 900,
    },
    color: "#24292e",
  },
  link: {
    color: "#24292e",
    "&:hover": {
      opacity: 0.5,
    },
  },
};

const editorProps: { code: PropType<string> } = {
  code: String,
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
    const { classes } = jss.createStyleSheet(styles).attach();
    const curIns: any = getCurrentInstance();
    const { code } = toRefs(props);
    let monacoIns: any = null;
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
        <div style="width:600px; height: 800px; display:inline-block; float:left;position:relative">
          <div
            style="width: 600px; height: 800px; display:inline-block;float:left"
            ref="monaco"
          ></div>
          <span
            onClick={getRunCode}
            style="position: absolute;top: 0px;right: 0;color: #fff;background: green;display: inline-block; padding: 2px 8px;border-radius: 2px;cursor:pointer"
          >
            运行
          </span>
        </div>
      );
    };
  },
});
