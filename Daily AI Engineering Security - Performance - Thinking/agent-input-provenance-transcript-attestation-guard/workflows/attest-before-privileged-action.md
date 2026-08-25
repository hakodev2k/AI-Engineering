# Workflow: Attest Before Privileged Action

## Trigger
A model requests a privileged/external-write/irreversible tool, or a resumed/background session consumes an authoritative-looking message.

## Goal
Ensure the action is causally grounded in an attested authoritative input rather than forged, synthesized, stale, or transcript-divergent content.

## Inputs
Ledger JSONL, causal event ID, candidate content/hash, tool action, risk class, optional approval record.

## Baseline
Record current counts for unattested authoritative messages, provenance blocks, and mean validation latency before deployment.

## Context
Use `rules/provenance-boundary.md` and `skills/attest-authoritative-input.md`.

## Stages
1. **Observe** — Capture causal event ID and tool/risk metadata without executing the tool.
2. **Measure baseline** — Record whether event exists, is persisted, and has expected origin fields.
3. **Diagnose** — Run deterministic validator and classify mismatch codes.
4. **Form hypothesis** — Identify likely boundary: UI submission, prompt assembly, resume, notification, cross-session, adapter, or transcript persistence.
5. **Implement improvement** — Correct the host boundary; do not mutate historical evidence to make it pass.
6. **Measure again** — Replay benign and adversarial fixtures.
7. **Improved?** — If no, retry diagnosis/implementation at most 2 times. If yes, continue.
8. **Independent verification** — Security Verifier reruns checks read-only.
9. **Complete** — Only after verified result and no blocking mismatch.

## Responsible agent
Runtime implementer for stages 1–7; `subagents/security-verifier.md` for stage 8.

## Tools
`python scripts/provenance_guard.py`, unit tests, read-only transcript/event inspection.

## Outputs
Attestation report, mismatch evidence, before/after metrics, verifier status.

## Checkpoints
- Before any privileged execution.
- After session resume/reconstruction.
- After implementation change.
- Before declaring verification complete.

## Metrics
Unattested-authority rate, human-role mismatch rate, blocked privileged actions, validator p95 latency, false positives.

## Retry policy
Maximum 2 implementation retries per incident. Each retry requires a new evidence-backed hypothesis.

## Stop conditions
Stop immediately and block action on content-hash mismatch, missing human-submission proof, duplicate event IDs, or exhausted retries.

## Failure path
Preserve evidence; downgrade anomalous content to untrusted data where safe; require explicit human re-submission/approval for the intended privileged action. Never synthesize provenance.

## Verification
Positive fixture passes; forged human role, mutated content, and missing-event fixtures fail; verifier is independent from implementation.

## Definition of Done
Implemented: provenance fields are emitted and gate is wired at the action boundary.
Measured: before/after mismatch and latency metrics exist.
Verified: adversarial fixtures are blocked, legitimate input passes, independent verifier approves, and no secret-bearing raw payload is logged.