# Runtime Compatibility Rules

## Purpose
Prevent deployment failures caused by incompatible model, operator, OS, driver, runtime, or accelerator combinations.

## Scope
Inference runtimes, delegate backends, drivers, firmware, compiled formats, tokenizers, and native libraries.

## MUST
- Supported runtime combinations MUST be explicitly versioned or bounded.
- The exact release artifact MUST load, warm up, and execute representative inference on supported device classes.
- Runtime upgrades MUST be regression-tested against all materially affected model variants.
- Fallback execution paths MUST be observable when an accelerator delegate cannot execute an operator.

## MUST NOT
- MUST NOT assume desktop or server compatibility implies edge-device compatibility.
- MUST NOT silently ship a path that falls back to substantially slower execution.

## SHOULD
- Maintain a compatibility matrix for model formats, runtimes, OS versions, and accelerators.

## Exceptions
Require documented affected devices, measured impact, fallback, and approval.

## Verification
Inspect compatibility tests, runtime logs, operator placement, native dependency manifests, and device smoke tests.