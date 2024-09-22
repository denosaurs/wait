import * as colors from "@std/fmt/colors";

let supported = true;

if ((await Deno.permissions.query({ name: "env" })).state === "granted") {
  supported = supported &&
    (!!Deno.env.get("CI") || Deno.env.get("TERM") === "xterm-256color");
}

export type SymbolType = "info" | "success" | "warning" | "error";
export type SymbolRecord = { [key in SymbolType]: string };

export const main: SymbolRecord = {
  info: colors.blue("ℹ"),
  success: colors.green("✔"),
  warning: colors.yellow("⚠"),
  error: colors.red("✖"),
};

export const fallbacks: SymbolRecord = {
  info: colors.blue("i"),
  success: colors.green("√"),
  warning: colors.yellow("‼"),
  error: colors.red("×"),
};

export const symbols: SymbolRecord = supported ? main : fallbacks;
