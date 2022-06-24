import { defineComponent, PropType, toRefs, reactive, watch } from "vue";
import CodeParser from "./codeParser";
import CodeEditor from "./MonacoEditor";

const TypeProps: { code: PropType<string>; height: PropType<number> } = {
  code: String,
  height: Number,
};

export default defineComponent({
  props: TypeProps,
  setup(props) {
    const { code } = toRefs(props);
    const _State = reactive({
      _code: props.code,
      _height: props.height,
    });
    const getCode = (codeStr: string) => {
      _State._code = codeStr;
    };
    watch(code, (newcode) => {
      _State._code = newcode;
    });
    return () => {
      return (
        <div style="margin-top: 40px">
          <CodeParser height={_State._height} code={_State._code}></CodeParser>
          <CodeEditor
            height={_State._height}
            code={_State._code}
            onGetCode={getCode}
          ></CodeEditor>
        </div>
      );
    };
  },
});
