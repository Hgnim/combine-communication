import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dts from "vite-plugin-dts";

const projName:string = "combine-communication";

export default defineConfig({
    plugins: [
        dts({
            include: ["src"],
            outDirs: "./dist",
            tsconfigPath: "./tsconfig.json",
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: projName,
            fileName: (format) => `${projName}.${format}.js`,
        },
        rollupOptions: {
            external: [],
        },
        //源码映射
        sourcemap: true,
        //压缩
        minify: true,
    },
});
