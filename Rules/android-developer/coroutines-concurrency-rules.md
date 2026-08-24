# Coroutines and Concurrency Rules

## Purpose
Prevent lifecycle leaks, races, deadlocks, wasted work, and cancellation failures.

## Scope
Applies to coroutines, flows, threads, synchronization, and asynchronous Android work.

## MUST
- Bind coroutine lifetime to an explicit owner and cancellation policy.
- Propagate cancellation through suspendable call chains unless a documented operation must complete independently.
- Move blocking I/O off latency-sensitive/main execution contexts.
- Define ownership and synchronization for mutable state accessed concurrently.
- Test cancellation, timeout, retry, and concurrent update behavior for critical paths.

## MUST NOT
- Launch unscoped work whose lifetime and failure handling are undefined.
- Swallow cancellation exceptions as ordinary failures.
- Block the main thread waiting for asynchronous work.
- Assume sequential collection or callback ordering provides thread safety without evidence.

## SHOULD
- Prefer structured concurrency and immutable state streams.
- Use bounded parallelism for fan-out workloads.
- Make dispatcher/executor choices injectable where deterministic testing requires control.

## Exceptions
Detached work requires a durable ownership model, explicit failure recovery, observability, and approval when it can affect user or server state.

## Verification
Use coroutine tests with controlled schedulers, strict-mode/runtime diagnostics where applicable, race-focused tests, traces, and review of scope ownership and cancellation propagation.