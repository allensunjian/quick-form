import {
  defineComponent,
  reactive as r,
  ref,
  watch,
  watchEffect,
  toRefs,
} from "vue";

export default defineComponent({
  props: {
    code: String,
    height: Number,
  },
  emits: ["codeChange"],
  setup(props, { emit }) {
    const { code, height } = toRefs(props);
    const FromData = ref({});
    let QuickForm = {};
    const parserClasses = {
      quickParser: {
        width: "800px",
        height: height.value + "px",
        display: "inline-block",
        float: "right",
        padding: "20px 0",
        background: "#fff",
        boxSizing: "border-box",
      },
    };
    const FormEvent = (val: any) => {
      if (val.type == "optionChange") {
        emit("codeChange", val.val.currentOptions);
      }
    };
    const FormChange = (val: any) => {
      console.log("change", val);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(parserClasses);
    const upDateQuickElement = () => {
      FromData.value = {};
      QuickForm = {};
      eval(code.value as string);
    };
    upDateQuickElement();
    watch(code, upDateQuickElement);
    return function () {
      return (
        <div class={classes.quickParser}>
          <quick-form
            form-data={FromData.value}
            quickOptions={QuickForm}
            onFormEvent={FormEvent}
            onFormChange={FormChange}
          ></quick-form>
        </div>
      );
    };
  },
});
