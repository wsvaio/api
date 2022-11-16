/**
 * 合并两个对象到obj1
 * deep: 递归深度
 * overwrite: 是否赋值
 * del: 是否删除obj1中obj2不存在的key
 * rtn: 是否返回obj1
 * has：只有obj1中有的属性才赋值
 */

// 递归可选
type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export const merge = <T extends Object, R extends boolean = true>(obj1: T, obj2 = <DeepPartial<T>>{},
  { deep = 1, overwrite = true, del = false, rtn = <R>true, has = false } = {}) => {
  deep--;
  if (del) {
    const dels = Object.keys(obj1).filter(item => !Object.keys(obj2).includes(item));
    for (const key of dels) delete obj1[key];
  }
  for (const [key, val] of Object.entries(obj2)) {
    if (overwrite && has && [null, undefined].includes(obj1[key])) continue;
    if (typeof val == "object" && deep > 0) {
      typeof obj1[key] != "object" && Array.isArray(val) ? obj1[key] = [] : obj1[key] = {};
      merge(obj1[key], val, { deep, overwrite, del, rtn });
    } else {
      if (!overwrite && ![null, undefined].includes(obj1[key])) continue;
      obj1[key] = val;
    }
  }
  return <R extends true ? T : "">(rtn ? obj1 : "");
}


