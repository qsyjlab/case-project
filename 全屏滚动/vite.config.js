/*
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:56
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-19 22:22:27
 */
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
});
