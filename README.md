# wait

[![Tags](https://img.shields.io/github/release/denosaurs/wait)](https://github.com/denosaurs/wait/releases)
[![CI Status](https://img.shields.io/github/actions/workflow/status/denosaurs/wait/deno.yml?branch=master)](https://github.com/denosaurs/wait/actions)
[![License](https://img.shields.io/github/license/denosaurs/wait)](https://github.com/denosaurs/wait/blob/master/LICENSE)

<p align="center">
	<br>
	<img src="assets/example.svg" width="500">
	<br>
</p>

## Usage

```typescript
import { wait } from "https://deno.land/x/wait/mod.ts";

const spinner = wait("Generating terrain").start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading dinosaurs";
}, 1500);
```

## Other

### Related

- [ora](https://github.com/sindresorhus/ora) - Elegant terminal spinner

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
deno fmt and commit messages are done following Conventional Commits spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
