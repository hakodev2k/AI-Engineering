# Gas and Resource Use

## Purpose
Keep on-chain operations executable and economically sustainable under realistic conditions.

## Scope
Gas, compute units, storage growth, calldata, loops, batching, and protocol resource limits.

## MUST
- Measure gas/resource usage on critical paths using representative worst-case state.
- Bound loops and data structures reachable from user-controlled growth.
- Include protocol and network limits in design reviews.
- Test critical operations near expected maximum cardinality.
- Treat resource exhaustion that blocks withdrawals, settlement, or governance as a safety defect.

## MUST NOT
- Claim optimization without before/after measurements.
- Trade away correctness or security solely to reduce gas.
- Allow unbounded state growth to make required operations permanently unexecutable.

## SHOULD
- Optimize high-frequency or high-cost paths after profiling.
- Prefer amortized or incremental maintenance where full scans can exceed limits.

## Exceptions
Known expensive paths require documented bounds, economic justification, monitoring, and fallback behavior.

## Verification
Use gas snapshots/benchmarks, maximum-state tests, storage-growth analysis, and code review of loops and dynamic collections.