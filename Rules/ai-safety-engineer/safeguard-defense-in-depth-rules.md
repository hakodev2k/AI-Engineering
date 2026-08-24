# Safeguard Defense-in-Depth Rules

## Purpose
Avoid single-point safety failures by combining independent controls across the system.

## Scope
Covers model behavior, classifiers, permissions, rate limits, sandboxing, validation, approvals, and monitoring.

## MUST
- Identify which control prevents, detects, contains, and recovers from each high-severity failure mode.
- Use independent controls where failure of one mechanism could cause severe harm.
- Validate control composition, including ordering and fail-open/fail-closed behavior.
- Define safe behavior when a safeguard is unavailable or degraded.

## MUST NOT
- Count multiple controls as independent when they share the same failure mechanism.
- Disable redundant controls solely because one layer performs well in offline tests.
- Allow safety-critical dependency failure to silently remove protection.

## SHOULD
- Prefer simple deterministic controls for narrow enforceable invariants.
- Measure marginal effectiveness and operational cost of each layer.

## Exceptions
Single-control designs for high-severity risks require strong evidence, explicit rationale, monitoring, and accountable approval.

## Verification
Review control mappings, dependency analysis, fault-injection tests, bypass tests, degraded-mode behavior, and monitoring coverage.
