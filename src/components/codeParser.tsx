import {
  defineComponent,
  reactive as r,
  ref,
  watch,
  watchEffect,
  toRefs,
} from "vue";

const parserClasses = {
  quickParser: {
    width: "800px",
    height: "800px",
    display: "inline-block",
    float: "right",
    padding: "20px 0",
  },
};
export default defineComponent({
  props: {
    code: String,
  },
  setup(props) {
    const { code } = toRefs(props);
    const FromData = ref({});
    let QuickForm = {};
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
