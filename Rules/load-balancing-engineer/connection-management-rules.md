# Connection Management Rules

## Purpose
Keep connection lifecycle behavior bounded and resilient under normal load, spikes, and partial failure.

## Scope
Client and upstream connections, keep-alive, pooling, idle timeouts, connection limits, draining, and resets.

## MUST
- Client and upstream timeout values MUST be explicit and compatible with application and intermediary timeouts.
- Connection limits MUST account for backend file descriptors, memory, concurrency, and downstream capacity.
- Planned backend removal MUST use connection draining where protocol semantics permit it.
- Long-lived connections MUST have documented lifecycle, failover, and resource assumptions.
- Changes to pooling or reuse MUST be validated against latency, connection churn, and backend saturation.

## MUST NOT
- MUST NOT leave critical connection limits effectively unbounded without measured capacity justification.
- MUST NOT abruptly terminate established production connections for routine maintenance when graceful draining is available.
- MUST NOT configure intermediary timeouts that predictably expire before legitimate application operations without an explicit design decision.

## SHOULD
- Reuse connections where safe to reduce handshake overhead.
- Align timeout hierarchy so failures occur at the layer best able to handle them.

## Exceptions
Exceptions require documented workload characteristics, capacity evidence, risk, and rollback criteria.

## Verification
Inspect connection counts, reuse rates, reset reasons, timeout metrics, backend socket utilization, drain behavior, and load-test results.