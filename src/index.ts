import { remove, merge } from "@wsvaio/utils";
import { init } from "./presets";
import { actuator } from "./actuator";

export const createAPI = <T extends object = {}>(context?: Partial<ctx> & T) => {
  const ctx = <ctx<T>>merge(<any>context || {}, init, { overwrite: false });

  const method = (method?: string, url?: string) => {
    const conf = { method, url } as Record<any, any>;
    return <params extends object = {}, result extends object = {}>(config = <Partial<ctx<T, params, result>> | string>{}) => {
      if (typeof config == "string") {
        ["get", "post", "put", "patch", "delete", "options", "head", "connect", "trace"]
          .includes(config.toLowerCase()) ? conf.method = config : conf.url = config;
      } else {
        merge(conf, config, { deep: Infinity });
      }
      return async <P extends object = params, R extends object = result>(config = <Partial<ctx<T, P, R>>>{}) => {
        merge(conf, config, { deep: Infinity });

        const { befores = [], afters = [], errors = [], finals = [], _befores = [], _afters = [], _errors = [], _finals = [] }
          = remove(<any>conf, "befores", "afters", "errors", "finals", "_befores", "_afters", "_errors", "_finals");

        merge(conf, ctx, { deep: Infinity, overwrite: false });
        conf.befores?.push(...befores);
        conf.afters?.push(...afters);
        conf.errors?.push(...errors);
        conf.finals?.push(...finals);
        conf._befores?.push(..._befores);
        conf._afters?.push(..._afters);
        conf._errors?.push(..._errors);
        conf._finals?.push(..._finals);

        return await actuator(conf, ...conf._befores, ...conf.befores, conf.core, ...conf._afters, ...conf.afters)
          .catch(async err => {
            conf.error = err;
            return await actuator(conf,...conf._errors, ...conf.errors);
          })
          .finally(async () => {
            await actuator(conf, ...conf._finals, ...conf.finals);
          });
      }
    }
  }

  return {
    ...ctx,

    get: method("get"),
    post: method("post"),
    put: method("put"),
    patch: method("patch"),
    del: method("delete"),
    head: method("head"),
    connect: method("connect"),
    trace: method("trace"),
    options: method("options"),

    request: method()(),
  }


}

