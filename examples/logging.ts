import { wait } from "../mod.ts";

const spinner = wait({
  text: "Generating\nterrain",
  color: "red",
  interceptConsole: true,
});

spinner.start();

console.time("test");

setTimeout(() => {
  console.timeLog("test");
  console.log("This log message should\nnot be affected by the spinner");
}, 1000);

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading dinosaurs";
  console.table([{ a: 1, b: "Y" }, { a: "Z", b: 2 }]);
}, 2000);

setTimeout(() => {
  spinner.color = "blue";
  spinner.text = "Loading beasts";
  console.timeEnd("test");
}, 3000);

setTimeout(() => {
  spinner.color = "blue";
  spinner.text = "Loading beasts";
  console.assert(false, "This is an error message");
  console.dir({ a: 1, b: "Y" });
  console.dirxml({ a: 1, b: "Y" });
  console.count("count");
  console.countReset("count");
}, 3500);

setTimeout(() => {
  spinner.succeed("Mesozoic deployed!");
}, 4000);

setTimeout(() => {
  console.error("byee");
}, 5000);
