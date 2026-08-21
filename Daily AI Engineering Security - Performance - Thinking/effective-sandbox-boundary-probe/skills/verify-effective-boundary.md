# Skill — Verify Effective Sandbox Boundary

## Purpose
Measure the boundary an agent runtime actually enforces instead of trusting only configured or displayed sandbox settings.

## Trigger
Run before enabling unattended/headless autonomy, after runtime upgrades, after policy/config changes, or when adding MCP/external executor capabilities.

## Inputs
- declared sandbox mode;
- runtime/version/surface;
- resolved config sources and precedence;
- enabled tools/MCP servers;
- expected writable roots/network/external-execution policy;
- a disposable probe directory.

## Preconditions
- Probes MUST be harmless and isolated.
- No production path, secret, real remote host, or destructive operation may be used.
- Operator has defined the expected boundary before observing results.

## Allowed tools
Read-only config inspection, process invocation in disposable fixtures, file existence checks, structured logging.

## Constraints
- MUST NOT weaken the runtime policy to make a probe pass.
- MUST NOT infer enforcement from UI text alone.
- MUST treat remote execution tools as separate trust principals.

## Procedure
1. Record runtime/version/surface and all known policy layers.
2. Resolve declared boundary and configuration precedence.
3. Inventory capabilities that can create side effects outside the local sandbox.
4. Execute harmless local canaries for expected allow/deny paths.
5. Record observed effects, not model claims.
6. For external executors, require a synthetic/non-production capability check or static trust review; never test against production.
7. Compare declared policy to observations with `scripts/evaluate_boundary.py`.
8. If any stricter-than-observed mismatch exists, mark `FAIL_OPEN` and block autonomy.
9. Re-run after any config/runtime/tool change.

## Decision points
- `PASS`: all mandatory boundaries match observations.
- `FAIL_OPEN`: an action expected to be denied succeeded. Block execution.
- `FAIL_CLOSED`: an expected allowed canary was blocked. Investigate availability, but do not weaken security automatically.
- `UNKNOWN`: insufficient evidence; treat as blocking for high-autonomy usage.

## Expected output
A JSON observation set plus evaluator result containing declared boundary, runtime identity, observed effects, mismatches, and verification status.

## Metrics
Probe coverage, fail-open count, unknown count, boundary-regression detection time.

## Verification
An independent reviewer checks the observation file, runtime identity, and that all canaries are harmless.

## Failure handling
Retry once only for an instrumentation failure. Policy mismatches are not retried away.

## Stop conditions
Stop immediately on unexpected real side effects, ambiguous target paths, or any probe escaping the disposable fixture.