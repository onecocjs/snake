import isPlainObject from "lodash.isplainobject";

export const SNAKE_SYMBOL = Symbol("@@SNAKE_SYMBOL");

function caclPath(parentPath, property) {
  return parentPath ? `${parentPath}.${property}` : `${property}`;
}
function defineHiddenConstantProperty<T, S extends symbol | string, V>(
  target: T,
  name: S,
  value: V
) {
  Object.defineProperty(target, name, {
    value: value,
    enumerable: false,
    writable: false,
    configurable: false,
  });
}

const SYMBOL_MATCH = [
  SNAKE_SYMBOL,
  Symbol.asyncIterator,
  Symbol.hasInstance,
  Symbol.isConcatSpreadable,
  Symbol.iterator,
  Symbol.match,
  Symbol.replace,
  Symbol.search,
  Symbol.species,
  Symbol.split,
  Symbol.toPrimitive,
  Symbol.toStringTag,
  Symbol.unscopables,
];

export function createProxy<T extends object>(
  state: T,
  deps: Map<string, any>,
  parentPath?: string
): T {
  const proxy = new Proxy(state, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      // console.log(property, target.hasOwnProperty(property));

      //如果不是我自身定义的属性
      // if (!target.hasOwnProperty(property) && value !== void 0) {
      //   return value;
      // }

      // 如果是 symbol 类型 则直接返回
      if (
        SYMBOL_MATCH.some((x) => x === property) ||
        typeof property === "symbol"
      ) {
        console.log(property);
        return value;
      }

      const path = caclPath(parentPath, property);

      if (isPlainObject(value) || Array.isArray(value)) {
        defineHiddenConstantProperty(value, SNAKE_SYMBOL, 1);
        return createProxy(value, deps, path);
      }

      const count = deps.get(path) + 1;
      if (isNaN(count)) {
        deps.set(path, 1);
      } else {
        deps.set(path, count);
      }

      return value;
    },
  });
  return proxy;
}
