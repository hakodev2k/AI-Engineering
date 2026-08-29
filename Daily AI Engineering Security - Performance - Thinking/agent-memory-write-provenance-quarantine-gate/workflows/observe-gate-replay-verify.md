# Workflow: Observe → Gate → Replay → Verify

## Trigger
A platform introduces persistent memory, changes memory ingestion/retrieval, imports historical memories, or detects a memory-poisoning incident.

## Goal
Establish a measurable baseline, identify unsafe trust transitions, implement a fail-closed write gate, and verify that later retrieval cannot turn quarantined data into privileged instruction.

## Inputs
Representative memory-write traces, policy configuration, adversarial/safe fixtures, memory classes, privilege map, and current ingestion code.

## Baseline
Measure at least: provenance completeness, number of external writes accepted without review, malicious-fixture acceptance rate, gate latency if one exists, and replay attack success rate.

## Context
Use `evidence/research.md`, `rules/memory-security-rules.md`, and `config/policy.example.json` as the minimum package context.

## Stages
1. **Observe** — collect memory-write paths and classify source/trust transitions.
2. **Measure baseline** — run safe and malicious fixtures against the existing path; record acceptance and replay results.
3. **Diagnose** — identify whether failures come from missing provenance, flattened trust, secret persistence, instruction/data ambiguity, expiry gaps, or privilege mismatch.
4. **Form hypothesis** — state a testable claim, e.g. “requiring provenance plus quarantine for external instruction-bearing content will reduce privileged replay success to zero in the fixture set.”
5. **Implement improvement** — integrate the deterministic gate before durable write; keep quarantined content outside privileged instruction channels.
6. **Measure again** — repeat the same fixture set and measure gate latency, block/quarantine decisions, and safe-memory acceptance.
7. **Improved?** — if no, revise the hypothesis once; maximum 2 implementation attempts total.
8. **Independent verification** — Memory Security Verifier runs tests and replay independently.
9. **Complete** — record Implemented, Measured, and Verified separately.

## Responsible agent
Package/implementation owner for stages 1–7. `subagents/memory-security-verifier.md` for stage 8.

## Tools
Deterministic gate script, unit tests, isolated memory store, audit logs, and read-only policy inspection.

## Outputs
Baseline report, gate report, before/after metrics, replay-test evidence, residual-risk note, and verification status.

## Checkpoints
- Baseline captured before changes.
- Trust taxonomy approved before implementation.
- No privileged promotion without required approval.
- Independent replay verification before completion.

## Metrics
Malicious acceptance rate, replay success rate, safe acceptance rate, provenance completeness, false-positive review rate, and p95 gate latency.

## Retry policy
At most one revised hypothesis and one second implementation attempt. Scanner/process errors may be retried once after correcting the operational error.

## Stop conditions
Stop and escalate if a malicious fixture reaches privileged behavior, provenance cannot be established, secrets would need to be persisted to proceed, or required human approval is absent.

## Failure path
Preserve the previous secure behavior, quarantine uncertain external writes, document the failing fixture and evidence, and escalate. Never convert `quarantine` to `allow` solely to restore throughput.

## Verification
Security success means attack paths are blocked, trust boundaries remain intact, tests pass, quarantined records cannot become privileged instructions, and logs do not expose secrets.

## Definition of Done
Evidence documented; baseline captured; gap/root cause identified; gate integrated; tests and replay pass; metrics collected; risks documented; required approvals obtained; independent verification complete; no blocking security issue remains.
