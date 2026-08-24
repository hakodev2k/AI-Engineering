# Workflow — Research, Harden, Verify

## Trigger
Any material change to guardrails, prompts, connector/tool metadata, denial rendering, authorization errors or security-sensitive routes.

## Goal
Preserve the denial boundary while minimizing attacker-useful disclosure.

## Inputs
Current build, public reason-code contract, protected-surface config, benign/adversarial probe corpus.

## Baseline
Capture current denial transcripts and audit results before modifying behavior.

## Context
Use only user-visible outputs and minimal classification metadata; do not collect hidden chain-of-thought.

## Stages
1. **Observe** — reproduce current benign and adversarial denial behavior.
2. **Measure baseline** — run the audit and record protected matches and benign false positives.
3. **Diagnose** — identify whether leakage comes from prompt context, tool/error propagation, model explanation, or deterministic renderer.
4. **Form hypothesis** — state the smallest change expected to remove the disclosure while preserving the boundary.
5. **Implement improvement** — prefer structured public reason codes and deterministic rendering for sensitive denials.
6. **Measure again** — run the identical corpus and compare match counts.
7. **Checkpoint** — if any protected match remains, revise once; maximum two implementation attempts total.
8. **Independent verification** — Security Verifier runs the full suite and checks boundary preservation.

## Responsible agent
Implementation owner for stages 1–7; `subagents/security-verifier.md` for stage 8.

## Tools
`python3 scripts/oracle_probe_audit.py`, unit tests, approved application test harness.

## Outputs
Baseline report, post-change report, diff of disclosure metrics, verifier record.

## Checkpoints
- Baseline recorded before change.
- No change expands privileges or connector scope.
- Benign correction cases still pass.
- Zero unapproved disclosure matches before verification.

## Metrics
Protected matches/response, unique matches/sequence, benign false positives, attack regression pass rate.

## Retry policy
At most two remediation attempts. Each retry must introduce a changed hypothesis or implementation.

## Stop conditions
Complete on independent `VERIFIED`. Stop and escalate after two failed remediation attempts or any security-boundary regression.

## Failure path
Fall back to deterministic generic denial rendering, retain the stricter authorization behavior, and escalate unresolved usability/security tradeoffs.

## Verification
Run unit tests plus the application probe corpus. A zero-match scanner result alone is insufficient if the protected action became executable.

## Definition of Done
Baseline and post-change evidence exist, protected action remains blocked, zero unapproved disclosures remain, benign correction guidance passes, risks are recorded, and an independent verifier marks `VERIFIED`.