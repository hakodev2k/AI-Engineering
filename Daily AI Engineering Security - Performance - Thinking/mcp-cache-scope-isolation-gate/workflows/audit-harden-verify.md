# Workflow: Audit, Harden, Verify

## Trigger
MCP caching introduction/change, new remote server, protocol upgrade, or suspected cross-user metadata poisoning.

## Goal
Preserve useful caching without allowing untrusted MCP content to cross trust boundaries.

## Inputs
Cache topology, policy, traces, server/principal inventory, protocol version.

## Baseline
Measure cache hit rate, latency, shared/private entry counts, key dimensions, and cross-principal reuse behavior.

## Stages
1. **Observe:** inventory endpoints, scopes, producers, consumers, and keys.
2. **Measure:** replay a benign two-principal workload and record baseline.
3. **Diagnose:** identify entries whose reuse is broader than their trust context.
4. **Hypothesize:** document facts, evidence, assumptions, root cause, expected remediation.
5. **Implement:** default-private decision, key isolation, allowlists, forbidden-field checks, invalidation rules.
6. **Measure again:** replay same workload plus poisoned public-scope fixtures.
7. **Improved?** If unsafe reuse persists, revise once. Maximum two hardening cycles.
8. **Verify:** independent reviewer reproduces isolation and performance measurements.

## Responsible agent
Platform implementer through stage 7; Cache Security Reviewer for stage 8.

## Tools
Cache/gateway config readers, isolated cache harness, checker, synthetic MCP responses.

## Outputs
Trust map, baseline, policy decision log, hardened configuration/code, before/after metrics, verification matrix.

## Checkpoints
Any secret-bearing cache entry or cross-principal poisoned hit blocks rollout immediately.

## Metrics
Unsafe shared hits; blocked public claims; cache hit rate; p50/p95 lookup latency; false blocks; key collisions.

## Retry policy
At most two hardening cycles; metadata resolution once.

## Stop conditions
Unknown producer identity, unresolved cross-user collision, secret exposure, or any proposed security downgrade.

## Failure path
Disable shared MCP caching for the affected class, purge unsafe entries, preserve forensic metadata, escalate.

## Verification
Poisoning fixtures must not cross principals; approved immutable-public fixtures may share only when all configured trust conditions match.

## Definition of Done
Implemented, measured, independently verified, no blocking cache-isolation issue remains.