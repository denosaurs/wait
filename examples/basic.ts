import { wait } from "../mod.ts";

const spinner = wait("Generating terrain").start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading dinosaurs";
}, 1500);

setTimeout(() => {
  spinner.succeed("Mesozoic deployed!");
}, 3000);
