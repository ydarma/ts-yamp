import typescript from "@wessberg/rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import generatePackageJson from "rollup-plugin-generate-package-json";

export default {
  input: "./mixin.ts",
  output: {
    file: "./dist/index.js",
    format: "cjs",
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    generatePackageJson({
      outputFolder: "dist",
      baseContents: (pkg) => ({
        name: pkg.name,
        version: pkg.version,
      }),
    }),
  ],
};