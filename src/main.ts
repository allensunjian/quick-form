import { createApp } from "vue";
import App from "./App";
import "./registerServiceWorker";
import quickForm from "../build/index";
import "element-plus/dist/index.css";
import "../lib/quickFromInsideSty.scss";
import "../lib/quickFromOutsideSty.scss";
import jss from "jss";
import preset from "jss-preset-default";

function quickCss(): any {
  jss.setup(preset());
  return {
    install(app: any) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window._createStyleSheet = app.config.globalProperties = (classes) => {
        return jss.createStyleSheet(classes).attach();
      };
    },
  };
}
createApp(App).use(quickCss()).use(quickForm).mount("#app");
