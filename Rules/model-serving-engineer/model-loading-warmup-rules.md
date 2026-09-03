# Model Loading and Warmup Rules

## Purpose
Prevent cold-start failures and traffic exposure before a replica is truly ready.

## Scope
Applies to artifact download, initialization, compilation, graph capture, cache setup, and warmup.

## MUST
- Separate process liveness from model readiness.
- Admit traffic only after required artifacts are loaded and critical warmup succeeds.
- Bound loading time and expose it through metrics or events.
- Validate restart and scale-out behavior with realistic artifact sizes and storage conditions.

## MUST NOT
- Mark a replica ready merely because the serving process has started.
- Send production traffic to replicas still compiling or allocating required execution state unless explicitly designed for it.
- Depend on manual warmup steps for routine deployment.

## SHOULD
- Pre-stage large artifacts where it improves predictable recovery.
- Warm representative shapes or request classes required by the runtime.

## Exceptions
Lazy initialization requires measured latency impact, safe fallback behavior, and documented readiness semantics.

## Verification
Inspect readiness probes, cold-start tests, startup metrics, deployment events, and scale-out exercises.