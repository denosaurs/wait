import * as colors from "@std/fmt/colors";
import * as tty from "@denosaurs/tty";

import spinners from "./spinners.ts";
import { symbols } from "./log_symbols.ts";

export { spinners, symbols };

const encoder = new TextEncoder();

type ColorFunction = (message: string) => string;
const colormap: { [key: string]: ColorFunction } = {
  black: colors.black,
  red: colors.red,
  green: colors.green,
  yellow: colors.yellow,
  blue: colors.blue,
  magenta: colors.magenta,
  cyan: colors.cyan,
  white: colors.white,
  gray: colors.gray,
};

export interface SpinnerAnimation {
  interval: number;
  frames: string[];
}

export interface SpinnerOptions {
  text: string;
  prefix?: string;
  spinner?: string | SpinnerAnimation;
  color?: string | ColorFunction;
  hideCursor?: boolean;
  indent?: number;
  interval?: number;
  stream?: tty.SyncStream;
  enabled?: boolean;
  discardStdin?: boolean;
  interceptConsole?: boolean;
}

export interface PersistOptions {
  prefix?: string;
  symbol?: string;
  text?: string;
}

export type Console = typeof globalThis.console;

export function wait(opts: string | SpinnerOptions): Spinner {
  if (typeof opts === "string") {
    opts = { text: opts };
  }
  return new Spinner({
    text: opts.text,
    prefix: opts.prefix ?? "",
    color: opts.color ?? colors.cyan,
    spinner: opts.spinner ?? "dots",
    hideCursor: opts.hideCursor ?? true,
    indent: opts.indent ?? 0,
    interval: opts.interval ?? 100,
    stream: opts.stream ?? Deno.stdout,
    enabled: true,
    discardStdin: true,
    interceptConsole: opts.interceptConsole ?? true,
  });
}

export class Spinner {
  #opts: Required<SpinnerOptions>;

  isSpinning: boolean;

  #stream: tty.SyncStream;
  indent: number;
  interval: number;

  #id = 0;

  #enabled: boolean;
  #frameIndex: number;
  #linesToClear: number;
  #linesCount: number;

  constructor(opts: Required<SpinnerOptions>) {
    this.#opts = opts;

    this.#stream = this.#opts.stream;

    this.text = this.#opts.text;
    this.prefix = this.#opts.prefix;

    this.color = this.#opts.color;
    this.spinner = this.#opts.spinner;
    this.indent = this.#opts.indent;
    this.interval = this.#opts.interval;

    this.isSpinning = false;
    this.#frameIndex = 0;
    this.#linesToClear = 0;
    this.#linesCount = 1;

    this.#enabled = typeof opts.enabled === "boolean"
      ? opts.enabled
      : tty.isInteractive(this.#stream);

    if (opts.hideCursor) {
      addEventListener("unload", () => {
        tty.showCursorSync(this.#stream);
      });
    }

    if (opts.interceptConsole) {
      this.#interceptConsole();
    }
  }

  #spinner: SpinnerAnimation = spinners.dots;
  #color: ColorFunction = colors.cyan;
  #text = "";
  #prefix = "";

  #interceptConsole(): void {
    const methods: (keyof Console)[] = [
      "log",
      "debug",
      "info",
      "dir",
      "dirxml",
      "warn",
      "error",
      "assert",
      "count",
      "countReset",
      "table",
      "time",
      "timeLog",
      "timeEnd",
      "group",
      "groupCollapsed",
      "groupEnd",
      "clear",
      "trace",
      "profile",
      "profileEnd",
      "timeStamp",
    ];
    for (const method of methods) {
      const original = console[method] as (...args: unknown[]) => void;
      console[method] = (...args: unknown[]) => {
        if (this.isSpinning) {
          this.stop();
          this.clear();
          original(...args);
          this.start();
        } else {
          original(...args);
        }
      };
    }
  }

  set spinner(spin: string | SpinnerAnimation) {
    this.#frameIndex = 0;
    if (typeof spin === "string") this.#spinner = spinners[spin];
    else this.#spinner = spin;
  }

  get spinner(): SpinnerAnimation {
    return this.#spinner;
  }

  set color(color: string | ColorFunction) {
    if (typeof color === "string") this.#color = colormap[color];
    else this.#color = color;
  }

  get color(): ColorFunction {
    return this.#color;
  }

  set text(value: string) {
    this.#text = value;
    this.updateLines();
  }

  get text(): string {
    return this.#text;
  }
  set prefix(value: string) {
    this.#prefix = value;
    this.updateLines();
  }

  get prefix(): string {
    return this.#prefix;
  }

  #write(data: string): void {
    this.#stream.writeSync(encoder.encode(data));
  }

  start(): Spinner {
    if (!this.#enabled) {
      if (this.text) {
        this.#write(`- ${this.text}\n`);
      }
      return this;
    }

    if (this.isSpinning) return this;

    if (this.#opts.hideCursor) {
      tty.hideCursorSync(this.#stream);
    }
    this.isSpinning = true;
    this.render();
    this.#id = setInterval(this.render.bind(this), this.interval);
    return this;
  }

  render(): void {
    this.clear();
    this.#write(`${this.frame()}\n`);
    this.updateLines();
    this.#linesToClear = this.#linesCount;
  }

  frame(): string {
    const { frames } = this.#spinner;
    let frame = frames[this.#frameIndex];

    frame = this.#color(frame);

    this.#frameIndex = ++this.#frameIndex % frames.length;
    const fullPrefixText = typeof this.prefix === "string" && this.prefix !== ""
      ? this.prefix + " "
      : "";
    const fullText = typeof this.text === "string" ? " " + this.text : "";

    return fullPrefixText + frame + fullText;
  }

  clear(): void {
    if (!this.#enabled) return;

    for (let i = 0; i < this.#linesToClear; i++) {
      tty.goUpSync(1, this.#stream);
      tty.clearLineSync(this.#stream);
      tty.goRightSync(this.indent - 1, this.#stream);
    }

    this.#linesToClear = 0;
  }

  updateLines(): void {
    let columns = 80;
    try {
      //@ts-ignore TS2339
      columns = Deno.consoleSize().columns ?? columns;
    } catch {
      // Unstable APIs is not enabled, fallback to default
    }

    const fullPrefixText = typeof this.prefix === "string"
      ? this.prefix + "-"
      : "";

    this.#linesCount = tty
      .stripAnsi(fullPrefixText + "--" + this.text)
      .split("\n")
      .reduce((count, line) => {
        return count + Math.max(1, Math.ceil(tty.wcswidth(line) / columns));
      }, 0);
  }

  stop(): void {
    if (!this.#enabled) return;
    clearInterval(this.#id);
    this.#id = -1;
    this.#frameIndex = 0;
    this.clear();
    this.isSpinning = false;
    if (this.#opts.hideCursor) {
      tty.showCursorSync(this.#stream);
    }
  }

  stopAndPersist(options: PersistOptions = {}): void {
    const prefix = options.prefix || this.prefix;
    const fullPrefix = typeof prefix === "string" && prefix !== ""
      ? prefix + " "
      : "";
    const text = options.text || this.text;
    const fullText = typeof text === "string" ? " " + text : "";

    this.stop();
    // https://github.com/denoland/deno/issues/6001
    this.#write(`${fullPrefix}${options.symbol || " "}${fullText}\n`);
  }

  succeed(text?: string): void {
    return this.stopAndPersist({ symbol: symbols.success, text });
  }

  fail(text?: string): void {
    return this.stopAndPersist({ symbol: symbols.error, text });
  }

  warn(text?: string): void {
    return this.stopAndPersist({ symbol: symbols.warning, text });
  }

  info(text?: string): void {
    return this.stopAndPersist({ symbol: symbols.info, text });
  }
}
