import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import progress from "rollup-plugin-progress";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
const external = [
  ...Object.values(pkg.dependencies),
  ...Object.values(pkg.devDependencies),
];

export default [
  {
    input: `${__dirname}/src/index.ts`,
    output: {
      file: `${__dirname}/lib/index.js`,
      format: "cjs",
      name: "duraStat",
      sourcemap: true,
    },
    plugins: [
      terser(),
      progress(),
      typescript(),
      commonjs(),
      json(),
      nodeResolve(),
    ],
    external,
  },
];
