import { createApp } from "vue";
import App from "./App";
import "./registerServiceWorker";
import quickForm from "../lib";
import "element-plus/dist/index.css";
import "../lib/quickFromInsideSty.scss";
import "../lib/quickFromOutsideSty.scss";

createApp(App).use(quickForm).mount("#app");
