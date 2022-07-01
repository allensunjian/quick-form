import { defineComponent, PropType, toRefs, reactive, watch } from "vue";
import CodeParser from "./codeParser";
import CodeEditor from "./MonacoEditor";

const TypeProps: {
  code: PropType<string>;
  height: PropType<number>;
  title: PropType<string>;
} = {
  code: String,
  height: Number,
  title: String,
};

const codeViewClasses = {
  quickCodeViewTitle: {
    fontSize: "22px",
    textAlign: "center",
    color: "#fff",
    paddingTop: "40px",
  },
};

export default defineComponent({
  props: TypeProps,
  emits: ["codeChange"],
  setup(props, { slots, emit }) {
    const { code } = toRefs(props);
    const _State = reactive({
      _code: props.code,
      _height: props.height,
      _title: props.title,
    });
    const getCode = (codeStr: string) => {
      _State._code = codeStr;
    };
    const codeChange = (val: any) => {
      emit("codeChange", val);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(codeViewClasses);
    watch(code, (newcode) => {
      _State._code = newcode;
    });
    return () => {
      return (
        <div>
          <div class={classes.quickCodeViewTitle}>{_State._title}</div>
          <div>{slots.default ? slots.default() : ""}</div>
          <div style="margin-top: 40px">
            <CodeParser
              height={_State._height}
              code={_State._code}
              onCodeChange={codeChange}
            ></CodeParser>
            <CodeEditor
              height={_State._height}
              code={_State._code}
              onGetCode={getCode}
            ></CodeEditor>
          </div>
        </div>
      );
    };
  },
});
