import { defineComponent, PropType, toRefs, reactive, watch } from "vue";
import CodeParser from "./codeParser";
import CodeEditor from "./MonacoEditor";

const TypeProps: { code: PropType<string> } = {
  code: String,
};

export default defineComponent({
  props: TypeProps,
  setup(props) {
    const { code } = toRefs(props);
    const _State = reactive({
      _code: props.code,
    });
    const getCode = (codeStr: string) => {
      _State._code = codeStr;
    };
    watch(code, (newcode) => {
      _State._code = newcode;
    });
    return () => {
      return (
        <div>
          <CodeParser code={_State._code}></CodeParser>
          <CodeEditor code={_State._code} onGetCode={getCode}></CodeEditor>
        </div>
      );
    };
  },
});
