import { createProxy, SNAKE_SYMBOL } from "../src";

const getSource = () => ({
  name: "张三",
  user: {},
  orderList: [
    {
      id: 1,
      skuList: [
        {
          id: 11,
          name: "小浣熊",
        },
      ],
    },
    {
      id: 2,
      skuList: [
        {
          id: 11,
          name: "小浣熊",
        },
      ],
    },
  ],
});

const getInitial = function () {
  const deps = new Map();
  const target = getSource();
  const proxy = createProxy(target, deps, void 0);
  return {
    deps,
    proxy,
  };
};

describe("test createProxy", function () {
  it("test proxy", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    proxy.name;
    expect(deps.size).toEqual(1);
    expect(deps.has("name")).toEqual(true);
  });
  it("test for", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    for (let index = 0; index < proxy.orderList.length; index++) {
      const element = proxy.orderList[index];
      element.id;
    }
    expect(deps.size).toEqual(3);
    expect(deps.has("orderList.length")).toBeTruthy();
    expect(deps.has("orderList.0.id")).toBeTruthy();
    expect(deps.has("orderList.1.id")).toBeTruthy();
  });
  it("test for of Symbol.iterator", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    for (const x of proxy.orderList) {
      x.id;
    }
    expect(deps.size).toEqual(3);
    expect(deps.has("orderList.length")).toBeTruthy();
    expect(deps.has("orderList.0.id")).toBeTruthy();
    expect(deps.has("orderList.1.id")).toBeTruthy();
  });
  it("test toString", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    proxy.toString();
    expect(deps.size).toEqual(1);
    expect(deps.has("toString")).toBeTruthy();
  });
  it("test for await of", async function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    for await (const x of proxy.orderList) {
      x.id;
    }
    expect(deps.size).toEqual(5);
    expect(deps.has("orderList.length")).toBeTruthy();
    expect(deps.has("orderList.0.then")).toBeTruthy();
    expect(deps.has("orderList.0.id")).toBeTruthy();
    expect(deps.has("orderList.1.then")).toBeTruthy();
    expect(deps.has("orderList.1.id")).toBeTruthy();
  });
  it("test hasInstance", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    proxy instanceof Array;
    expect(deps.size).toEqual(0);
  });
  it("test isConcatSpreadable", function () {
    const { deps, proxy } = getInitial();
    expect(deps.size).toEqual(0);
    proxy.orderList.concat([]);
    expect(deps.has("orderList.concat")).toBeTruthy();
    expect(deps.has("orderList.constructor")).toBeTruthy();
    expect(deps.has("orderList.length")).toBeTruthy();
    expect(deps.size).toEqual(3);
  });
});
