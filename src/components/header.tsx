import { defineComponent } from "vue";

const headerClasses = {
  quickHeader: {
    background: "rgb(32,161,98)",
    height: "64px",
    width: "100%",
    position: "fixed",
    top: "0",
    left: 0,
    fontSize: "32px",
    color: "#fff",
    lineHeight: "64px",
    padding: "0 20px",
  },
};
export default defineComponent({
  setup() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { classes } = window._createStyleSheet(headerClasses);
    return () => {
      return (
        <div class={classes.quickHeader}>
          <span>QUICK-FORM</span>
        </div>
      );
    };
  },
});
