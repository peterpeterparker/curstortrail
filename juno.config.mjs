import { defineConfig } from "@junobuild/config";

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
  satellite: {
    ids: {
      development: "uxrrr-q7777-77774-qaaaq-cai",
      production: "ir5om-ryaaa-aaaal-asheq-cai"
    },
    source: "out",
    predeploy: ["npm run build"]
  }
}); 