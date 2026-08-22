# Cache Stampede Remediation Workflow

## Trigger
Latency spike, origin saturation, synchronized cache expiry, or a feature introducing an expensive cached loader.

## Entry conditions
- In-scope cache path identified
- Repository and relevant tests accessible
- No production mutation required for diagnosis

## Inputs
Repository, cache key path, origin loader, policy, telemetry when available.

## Stages
1. **Explore** — Cache Explorer maps read/miss/write paths and collects evidence.
2. **Classify** — Mark each path protected, vulnerable, or unknown.
3. **Plan** — Remediation Planner defines the minimal coalescing change and tests.
4. **Implement** — Implementation Agent applies per-key singleflight, bounded timeouts, jitter/stale behavior where justified, and metrics.
5. **Test** — Generate concurrency evidence and run repository-native tests.
6. **Gate** — Run `scripts/stampede_gate.py` against evidence.
7. **Verify** — Verification Agent independently checks behavior and diff scope.
8. **Complete** — Produce findings, evidence, verification status, and remaining risk.

## Checkpoints
- Do not proceed from Explore without an evidenced miss path.
- Do not proceed from Implement without timeout/cancellation handling.
- Do not complete without independent verification.

## Retry rules
Maximum two implementation/test retries. Retry only for deterministic build/test failures or incorrect coalescing behavior. Preserve previous evidence and diff. After the second failure, stop and escalate.

## Approval points
Stop for explicit approval before production cache flush, cluster reconfiguration, production config change, or TTL reduction greater than 80%.

## Failure paths
- Missing telemetry: continue with repository evidence and document the gap.
- Permission failure: stop; do not increase privileges.
- Origin semantics incompatible with coalescing: stop and report the business constraint.
- Test environment unavailable: mark task unverified.

## Definition of Done
- Relevant cache paths classified
- Singleflight implemented where required
- Bounded wait and failure-release behavior proven
- Tests pass
- Gate passes
- No unintended cache-key/security-boundary changes
- Required approvals recorded
- Remaining risks documented
