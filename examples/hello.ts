import { wait } from "../mod.ts";

const spinner = wait("Loading mesozoic").start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading meteorite";
}, 1000);

setTimeout(() => {
  spinner.succeed("Started human race");
}, 2000);
