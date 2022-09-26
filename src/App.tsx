import { defineComponent, reactive, getCurrentInstance, h } from "vue";
import MonacoEditor from "./components/MonacoEditor";
import CodeParser from "./components/codeParser";
import Header from "./components/header";
import CodeView from "./components/codeView";
import DragLayout from "./components/dragLayout";

const appClasses = {
  quickWrap: {
    width: "1400px",
    margin: "0 auto",
    // background: "#fff",
  },
  quickContentSubTitle: {
    textAlign: "center",
    fontSize: "20px",
    color: "#fff",
    paddingTop: "40px",
  },
  controll_warp: {
    textAlign: "right",
  },
};
export default defineComponent({
  setup() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { classes } = window._createStyleSheet(appClasses);
    const createCodeFormData = (option: string) => {
      return `
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
      QuickForm=${option}
      `;
    };
    const fullDemoCode = function (drag: boolean, edit: boolean) {
      return `
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
        drag: ${drag},
        edit: ${edit}
      };
      
      `;
    };
    const ins: any = getCurrentInstance();

    const State = reactive({
      RefCode: fullDemoCode(false, false),
      inputCode: `
        FromData.value = {
          inputValue1: "",
          inputValue1: 0,
          inputValue2: "",
        };
        QuickForm = {
          formOptions: [
            {
              formElementLabel: "text",
              formElementType: "input",
              key: "inputValue",
              placeholder: "placeholder",
            },
            {
              formElementLabel: "number",
              formElementType: "input:number",
              key: "inputValue1",
              placeholder: "placeholder",
            },
            {
              formElementLabel: "textarea",
              formElementType: "input:textarea",
              key: "inputValue2",
              placeholder: "placeholder",
            },
            {
              formElementLabel: "maxlengh",
              formElementType: "input:textarea",
              key: "inputValue2",
              maxlength:"100",
              showWordLimit: true,
              placeholder: "placeholder",
            },
          ],
          layout: {
            labelWidth: 100,
            size: "default",
            labelPosition: "right",
          }
        }
      `,
      btnCode: `
      QuickForm = {
        formOptions: [
          {
            formElementType: "button",
            formElementLabel: "默认按钮：",
            childrenOptions: [
              {
                formElementType: "button",
                children: ["default"]
              },
              {
                formElementType: "button",
                type:"primary",
                children: ["primary"]
              },
              {
                formElementType: "button",
                type:"success",
                children: ["success"]
              },
              {
                formElementType: "button",
                type: "info",
                children: ["info"]
              },
              {
                formElementType: "button",
                type: "danger",
                children: ["danger"]
              },
            ],
          },
          {
            formElementType: "button",
            formElementLabel: "圆角按钮：",
            childrenOptions: [
              {
                formElementType: "button",
                children: ["default"],
                round: true
              },
              {
                formElementType: "button",
                type:"primary",
                children: ["primary"],
                round: true
              },
              {
                formElementType: "button",
                type:"success",
                children: ["success"],
                round: true
              },
              {
                formElementType: "button",
                type: "info",
                children: ["info"],
                round: true
              },
              {
                formElementType: "button",
                type: "danger",
                children: ["danger"],
                round: true
              },
            ],
          }
        ],
        layout: {
          labelWidth: 100,
          size: "default",
          labelPosition: "right",
        },
      }`,
      checkboxOrRadioCode: `
      FromData.value = {
        radio: 1,
        checkboxValue: []
      };
      QuickForm = {
        formOptions: [
          {
            formElementLabel: "单选",
            formElementType: "radio",
            key: "radio",
            childrenOptions: [
              { label: 1, children: ["选项1"]},
              { label: 2, children: ["选项2"]},
            ]
          },
          {
            formElementLabel: "多选",
            formElementType: "checkbox",
            key: "checkboxValue",
            childrenOptions: [
              { label: 1, children: ["选项1"]},
              { label: 2, children: ["选项2"]},
              { label: 3, children: ["选项3"]},
              { label: 4, children: ["选项4"]},
            ]
          },

        ],
        layout: {
          labelWidth: 100,
          size: "default",
          labelPosition: "right",
        },
      }
      `,
      selectCode: `
      FromData.value = {
        selectValue: "",
        multipleSelectValues: []
      };
      QuickForm = {
        formOptions: [
          {
            formElementLabel: "单选",
            formElementType: "select",
            key: "selectValue",
            placeholder: "请选择",
            options: [
              { label: "选项1", value: 1 },
              { label: "选项2", value: 2 },
              { label: "选项3", value: 3 },
              { label: "选项4", value: 4 },
            ],
          },
          {
            formElementLabel: "多选",
            formElementType: "select",
            key: "multipleSelectValues",
            multiple: true,
            placeholder: "请选择",
            options: [
              { label: "选项1", value: 1 },
              { label: "选项2", value: 2 },
              { label: "选项3", value: 3 },
              { label: "选项4", value: 4 },
            ],
          }
        ],
        layout: {
          labelWidth: 100,
          size: "default",
          labelPosition: "right",
        }
      }
      `,
      dragDemo: fullDemoCode(false, false),
      dragCompilte: false,
    });
    let CurrentDragCode: any = "";
    const Event = {
      toDrag: () => {
        State.dragCompilte = true;
        State.dragDemo = fullDemoCode(true, false);
      },
      compilte: () => {
        State.dragDemo = CurrentDragCode;
        State.dragCompilte = false;
      },
      codeChange(val: any) {
        CurrentDragCode = JSON.parse(val);
        CurrentDragCode.drag = false;
        CurrentDragCode = createCodeFormData(JSON.stringify(CurrentDragCode));
      },
      edit() {
        console.log("编辑表单");
        State.dragDemo = fullDemoCode(false, true);
      },
    };
    // setInterval(() => {
    //   State.RefCode += 1;
    // }, 1000);
    // const FromData = reactive({
    //   daterange: ["2022-01-01", "2022-10-10"],
    // });
    // const QuickForm = {
    //   formOptions: [
    //     {
    //       formElementType: "container",
    //       childrenOptions: [
    //         { children: ["线索获取"], formElementType: "container" },
    //         {
    //           formElementType: "date",
    //           format: "YYYY-MM-DD",
    //           key: "daterange",
    //           placeholder: "",
    //           type: "daterange",
    //           valueFormat: "YYYY-MM-DD",
    //         },
    //       ],
    //     },
    //     {
    //       tirrgerEvents: ["click"],
    //       formElementType: "button",
    //       children: ["點擊"],
    //       type: "primary",
    //       key: "add",
    //     },
    //   ],
    //   layout: {
    //     labelWidth: 100,
    //     size: "default",
    //     labelPosition: "right",
    //   },
    //   config: {
    //     renderType: "hander",
    //     containerVnode: h("div", {
    //       class: ["handler--container"],
    //     }),
    //     itemVnode: h("div", {
    //       class: ["handle--item"],
    //     }),
    //   },
    // };
    // const FormEvent = (params) => {
    //   console.log("event", params);
    // };
    // const FormChange = (params) => {
    //   console.log("change", params);
    // };
    return () => {
      return (
        <div class={classes.quickWrap}>
          <Header></Header>
          {/* <div>
            <quick-form
              form-data={FromData}
              quickOptions={QuickForm}
              onFormEvent={FormEvent}
              onFormChange={FormChange}
            ></quick-form>
          </div> */}

          <CodeView
            height={300}
            code={State.inputCode}
            title="--简单的使用input--"
          ></CodeView>
          <CodeView
            height={300}
            code={State.selectCode}
            title="--简单的使用select--"
          ></CodeView>
          <CodeView
            height={250}
            code={State.btnCode}
            title="--简单的使用button--"
          ></CodeView>
          <CodeView
            height={450}
            code={State.checkboxOrRadioCode}
            title="--简单的使用radio/checkbox--"
          ></CodeView>
          <CodeView
            height={800}
            code={State.RefCode}
            title="--较完整的例子--"
          ></CodeView>
          <CodeView
            height={800}
            code={State.dragDemo}
            title="--可拖拽的例子--"
            ref="dragView"
            onCodeChange={Event.codeChange}
          >
            <div class={classes.controll_warp}>
              {[
                !State.dragCompilte ? (
                  <el-button type="primary" onClick={Event.toDrag}>
                    拖拽表单
                  </el-button>
                ) : (
                  <el-button type="primary" onClick={Event.compilte}>
                    拖拽完成
                  </el-button>
                ),
                <el-button type="primary" onClick={Event.edit}>
                  编辑表单
                </el-button>,
              ]}
            </div>
          </CodeView>
          <DragLayout></DragLayout>
        </div>
      );
    };
  },
});
