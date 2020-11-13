import typescript from "@wessberg/rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./src/mixin.ts",
  output: {
    file: "./index.js",
    format: "cjs",
  },
  plugins: [typescript(), resolve(), commonjs()],
};
