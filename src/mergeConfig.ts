import { merge, pick } from "@wsvaio/utils";
export const mergeConfig = (conf1: Record<any, any>, conf2: Record<any, any>) => {
  const { befores = [], afters = [], errors = [], finals = [], _befores = [], _afters = [], _errors = [], _finals = [] }
    = pick(conf2, ["befores", "afters", "errors", "finals", "_befores", "_afters", "_errors", "_finals"], true);
  conf1.befores?.push(...befores);
  conf1.afters?.push(...afters);
  conf1.errors?.push(...errors);
  conf1.finals?.push(...finals);
  conf1._befores?.push(..._befores);
  conf1._afters?.push(..._afters);
  conf1._errors?.push(..._errors);
  conf1._finals?.push(..._finals);
  merge(conf1, conf2, { deep: Infinity });
}