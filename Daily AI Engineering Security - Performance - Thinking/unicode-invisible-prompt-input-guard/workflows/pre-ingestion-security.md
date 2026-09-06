# Pre-Ingestion Security Workflow

## Trigger
Untrusted external text is about to enter an agent, RAG index, privileged prompt, or tool-execution workflow.

## Goal
Ensure the model and reviewer consume the same canonical representation and risky invisible Unicode cannot silently alter security decisions.

## Inputs
Raw text, trust classification, destination authority level, canonicalization policy.

## Baseline
Measure risky-character incidence, current blocked-input rate, review rate, false positives, and any known raw/rendered/model representation mismatches.

## Context
Legitimate Unicode requirements, downstream tool permissions, approval path, logging/DLP behavior.

## Stages
1. **Observe** — capture raw UTF-8 and source metadata without executing content.
2. **Measure baseline** — scan representative traffic and record incidence by code point/source.
3. **Diagnose** — determine whether risky characters reach tokenizer, classifier, approval UI, or tool arguments unchanged.
4. **Form hypothesis** — identify the representation mismatch responsible for bypass risk.
5. **Implement improvement** — insert deterministic scan/canonicalization before downstream policy evaluation.
6. **Measure again** — compare risky-input handling and false-positive rate on the same fixture classes.
7. **Decision** — if protection fails or legitimate content is damaged, revise policy; maximum two iterations.
8. **Independent verification** — Security Verifier confirms fail-closed behavior and byte/hash equivalence.

## Responsible agent
Implementation engineer; independent verifier defined in `subagents/security-verifier.md`.

## Tools
`unicode_input_guard.py`, unit fixtures, logs, hash comparison.

## Outputs
Findings report, escaped representation, canonical artifact, before/after metrics, verification verdict.

## Checkpoints
Before model ingestion, before privileged tool execution, and after any canonicalization-policy change.

## Metrics
Detection rate on known fixtures, false-positive rate, risky inputs blocked, review count, raw/canonical divergence, policy-bypass regression count.

## Retry policy
At most two remediation iterations. Never weaken privilege or skip verification to obtain a pass.

## Stop conditions
Complete only when high-risk fixtures are blocked, legitimate fixtures preserve required text, hashes tie reviewed and consumed canonical content, and independent verification succeeds.

## Failure path
Block high-authority ingestion; preserve escaped evidence; escalate after two failed remediation attempts.

## Verification
Run deterministic tests plus integration hash comparison at the downstream boundary.

## Definition of Done
Evidence documented; baseline measured; policy implemented; high-risk cases blocked; legitimate cases tested; no secret exposed; verification independent; no blocking issue remains.
