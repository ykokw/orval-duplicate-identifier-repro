import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: "./petstore.yaml",
    output: {
      target: "./src/petstore.ts",
      mock: true,
      clean: true,
      mode: "split",
    },
  },
});
