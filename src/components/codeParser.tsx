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
  setup(props) {
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
          ></quick-form>
        </div>
      );
    };
  },
});
