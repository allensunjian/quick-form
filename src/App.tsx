import { defineComponent, reactive } from "vue";
import MonacoEditor from "./components/MonacoEditor";
import CodeParser from "./components/codeParser";
import Header from "./components/header";
import CodeView from "./components/codeView";
const appClasses = {
  quickWrap: {
    width: "1400px",
    margin: "0 auto",
    background: "#fff",
  },
};
export default defineComponent({
  setup() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { classes } = window._createStyleSheet(appClasses);
    const State = reactive({
      RefCode: `
      FromData.value = {
        account: "",
        bankType: null,
        othersAccount: "",
        amount: 0,
        remark: 1111,
        date: "2022-05-25",
        timeData: new Date(2000, 1, 1, 12, 0, 0),
        daterangeData: ["2022-05-01", "2022-05-05"],
        state: 2,
        checkboxData: [2],
        fileList: [],
        switchData: false,
      };
      QuickForm = {
        formOptions: [
            {
        formElementLabel: "开户行",
        formElementType: "select",
        key: "bankType",
        placeholder: "请选择银行",
        options: [
          { label: "中国银行", value: 1 },
          { label: "建设银行", value: 2 },
          { label: "农业银行", value: 3 },
          { label: "建设银行", value: 4 },
        ],
      },
      {
        tirrgerEvents: ["mouseover"],
        formElementLabel: "账号：",
        formElementType: "input",
        key: "account",
        placeholder: "请填写银行账号",
      },
      {
        formElementLabel: "对方账号：",
        formElementType: "input",
        key: "othersAccount",
        placeholder: "请填写对方账号",
      },
      {
        formElementLabel: "转账金额：",
        // formElementType: "container", // 如果没有第一层级的 type 那么默认是container
        childrenOptions: [
          {
            formElementType: "input:number",
            key: "amount", // mountModelValue: "amount", mountModelValue 绑定优先级大于 key
          },
          {
            formElementType: "text",
            textValue: "元",
            style: "margin-left: 10px; color:red",
          },
        ],
      },
      {
        formElementLabel: "备注",
        formElementType: "input:textarea",
        placeholder: "请填写备注",
        key: "remark",
      },
      {
        formElementLabel: "到账类型",
        formElementType: "radio",
        key: "state",
        childrenOptions: [
          { label: 1, children: ["立即"] },
          { label: 2, children: ["延时"] },
        ],
      },
      {
        formElementLabel: "日期",
        directives: [["sif", "scope.state == 2"]],
        childrenOptions: [
          {
            formElementType: "date",
            key: "date",
            type: "date",
            placeholder: "预约日期",
            format: "YYYY/MM/DD",
            valueFormat: "YYYY-MM-DD",
          },
          {
            formElementType: "time",
            key: "timeData",
            type: "time",
            placeholder: "时间",
          },
        ],
      },
      {
        formElementLabel: "日期",
        formElementType: "text",
        textValue: "{{date}}   {{timeData}}",
      },
      {
        formElementLabel: "通知类型",
        formElementType: "checkbox",
        key: "checkboxData",
        childrenOptions: [
          { label: 1, children: ["电话通知"] },
          { label: 2, children: ["短信通知"] },
          { label: 3, children: ["邮件通知"] },
        ],
      },
      {
        formElementLabel: "上传凭证",
        formElementType: "upload",
        key: "fileList",
        action: "#",
        listType: "picture-card",
        autoUpload: false,
        children: [
          {
            formElementType: "icon",
            children: ['上传']
          },
        ],
      },
      {
        formElementLabel: "开关",
        formElementType: "switch",
        key: "switchData"
      }
        ],
        layout: {
      labelWidth: 100,
      size: "default",
      labelPosition: "right",
    },
      };
      
      `,
    });
    // setInterval(() => {
    //   State.RefCode += 1;
    // }, 1000);
    return () => {
      return (
        <div class={classes.quickWrap}>
          <Header></Header>
          <CodeView code={State.RefCode}></CodeView>
        </div>
      );
    };
  },
});
