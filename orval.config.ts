import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: {
      target: "./petstore.yaml",
      override: {
        transformer: './transformer.js',
      }
    },
    output: {
      target: "./src/petstore.ts",
      mock: true,
      clean: true,
      mode: "split",
    },
  },
});
