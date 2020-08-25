# wait

[![Tags](https://img.shields.io/github/release/denosaurs/wait)](https://github.com/denosaurs/wait/releases)
[![CI Status](https://img.shields.io/github/workflow/status/denosaurs/wait/check)](https://github.com/denosaurs/wait/actions)
[![License](https://img.shields.io/github/license/denosaurs/wait)](https://github.com/denosaurs/wait/blob/master/LICENSE)

```typescript
import { wait } from "https://deno.land/x/wait/mod.ts";

const spinner = wait("Loading mesozoic").start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "Loading meteorite";
}, 1000);

setTimeout(() => {
  spinner.succeed("Started human race");
}, 2000);
```

## other

### contribution

Pull request, issues and feedback are very welcome. Code style is formatted with deno fmt and commit messages are done following Conventional Commits spec.

### licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
