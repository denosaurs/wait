import { wait } from "../mod.ts";
import spinners from "../spinners.ts";

const spinner = wait("Loading something really really heavy").start();

let colorIdx = 0;
const colors: string[] = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
];

let spinIdx = 0;
const spins = Object.keys(spinners);

setInterval(() => {
  colorIdx = ++colorIdx % colors.length;
  spinner.color = colors[colorIdx];
}, 500);

setInterval(() => {
  spinIdx = ++spinIdx % spins.length;
  spinner.spinner = spins[spinIdx];
}, 1000);
