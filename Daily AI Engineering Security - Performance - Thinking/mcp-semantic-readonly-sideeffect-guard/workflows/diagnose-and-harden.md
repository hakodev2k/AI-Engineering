# Workflow: Diagnose and Harden Read-Only MCP

## Trigger
Integration/change/incident affecting a database-capable MCP server.

## Goal
Prove no write-capable semantic path remains under read-only mode.

## Inputs
Server code/version, schemas, policy, datastore grants, fixtures.

## Baseline
Run existing negative tests and record which semantic-write fixtures are accepted.

## Stages
1. **Observe** — collect server/version/policy and evidence.
2. **Measure baseline** — run safe fixtures against the preflight control or disposable datastore.
3. **Diagnose** — map discovery, call-time enforcement, and datastore authorization.
4. **Hypothesize** — identify bypass class: lexical, alternate stage/procedure, protocol route, or privilege mismatch.
5. **Implement** — add execution-time semantic blocking and/or reduce datastore privileges.
6. **Measure again** — rerun identical fixtures.
7. **Verify** — independent Security Verifier checks negative tests and grants.

## Responsible agent
Engineer implements; `subagents/security-verifier.md` verifies.

## Tools
Static inspection, `scripts/readonly_guard.py`, unit tests, sanitized datastore privilege introspection.

## Outputs
Before/after results, root cause, patch evidence, residual risk, verification status.

## Checkpoints
No implementation before baseline. No release before independent verification.

## Metrics
Fixture block rate, false positives, datastore-denied mutation attempts, unclassified operation count.

## Retry policy
At most 2 diagnose/implement cycles.

## Stop conditions
Stop on verified invariant, unresolved parser ambiguity, unavailable privilege evidence, or retry exhaustion.

## Failure path
Block autonomous release and escalate to a human security owner; never weaken the boundary to make tests pass.

## Definition of Done
Evidence documented, limitation identified, control implemented, fixtures pass, privileges verified, residual risks documented, no blocker remains.