# Resource Limits Rules

## Purpose
Prevent runaway or adversarial WebAssembly execution from exhausting host resources.

## Scope
Applies to memory, execution fuel, epochs/timeouts, table growth, instances, handles, I/O, and concurrency.

## MUST
- Untrusted or multi-tenant workloads MUST have explicit execution and memory limits.
- Resource exhaustion MUST produce controlled failures with bounded cleanup behavior.
- Limits MUST be derived from workload requirements and validated under representative load.
- Per-request or per-instance resources MUST be released when execution terminates or is cancelled.
- Increasing production limits materially beyond established bounds MUST receive operational review.

## MUST NOT
- A host MUST NOT permit unbounded memory growth, instance creation, or execution time for untrusted modules.
- Timeouts MUST NOT leave privileged host operations running indefinitely unless their lifecycle is explicitly detached and controlled.
- Limit failures MUST NOT expose host internals or sensitive tenant data.

## SHOULD
- Use layered limits at runtime and infrastructure levels.
- Monitor limit utilization and rejection rates.
- Test pathological modules that allocate, loop, recurse, or open resources aggressively.

## Exceptions
Trusted offline workloads may use broader limits when capacity is reserved and blast radius is understood.

## Verification
Inspect runtime limit configuration, run exhaustion tests, observe cleanup and host health, and verify dashboards/alerts expose memory, execution, instance, and rejection pressure.