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
  },
  setup(props) {
    const { code } = toRefs(props);
    const FromData = ref({});
    let QuickForm = {};
    const upDateQuickElement = () => {
      FromData.value = {};
      QuickForm = {};
      eval(code.value as string);
    };
    upDateQuickElement();
    watch(code, upDateQuickElement);
    return function () {
      return (
        <div style="width:800px;height:800px;display:inline-block;float:left">
          <quick-form
            form-data={FromData.value}
            quickOptions={QuickForm}
          ></quick-form>
        </div>
      );
    };
  },
});
