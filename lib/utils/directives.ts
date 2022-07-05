const IF = "sif";

const EXP = {
  directives: {
    [IF]: {
      updated: (() => {
        let originalDisplay: any = null;
        let timer: any = null;
        return (el: any, argus: any) => {
          const utils = argus.arg;
          if (!utils) return;
          const display = el.style.display;
          const key = argus.modifiers;
          const rules = utils.scope._rules;
          // const emit = utils.emitEvent("directiveEvent", key);

          if (originalDisplay == null) {
            originalDisplay = display;
          }

          utils.rulesState.resetState(key, argus.value);

          utils.scope.$nextTick(() => {
            if (!argus.value) {
              el.style.display = "none";
              // emit({ directive: IF, value: argus.value });
              // // key in rules && (delete rules[key])
            } else {
              // emit({ directive: IF, value: argus.value });
              el.style.display = originalDisplay;
              // !(key in rules) && (rules[key] = rule)
            }
          });

          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            utils.rulesState.resetRules(IF);
          }, 200);
        };
      })(),
    },
  },
};

export default EXP;
