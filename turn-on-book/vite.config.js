/*
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:56
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-19 22:22:27
 */
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    inject({
      $: "jquery", // 这里会自动载入 node_modules 中的 jquery
      jQuery: "jquery",
      "windows.jQuery": "jquery",
    }),
  ],
});
