# Kernel Compatibility

## Purpose
Keep eBPF behavior correct across the declared kernel support matrix.

## Scope
Kernel versions, distributions, architectures, BTF, CO-RE relocations, helpers, kfuncs, hooks, and configuration dependencies.

## MUST
- Supported kernels and architectures MUST be explicitly defined.
- Required helpers, program types, BTF data, kfuncs, and kernel config options MUST be capability-checked.
- CO-RE relocations MUST be validated against representative target kernels.
- Unsupported capability combinations MUST degrade predictably or refuse activation.
- Compatibility changes MUST include regression tests for the oldest supported target.

## MUST NOT
- MUST NOT infer feature availability from kernel version alone when capability detection is possible.
- MUST NOT depend on unstable kernel internals without an explicit compatibility strategy.
- MUST NOT silently activate a reduced-observability or reduced-security mode.

## SHOULD
- Prefer stable tracepoints and documented interfaces over fragile implementation details.
- Maintain a machine-readable compatibility matrix.

## Exceptions
Exceptions require evidence, bounded blast radius, fallback behavior, ownership, expiry, and approval where production risk increases.

## Verification
Test load, attach, event decoding, and fallback paths against the support matrix; inspect BTF/CO-RE diagnostics and CI results.