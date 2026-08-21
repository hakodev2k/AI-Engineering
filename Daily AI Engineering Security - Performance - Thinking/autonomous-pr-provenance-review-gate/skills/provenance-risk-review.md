# Skill — Provenance Risk Review

## Purpose
Evaluate pull-request merge risk using observable repository provenance and review controls, without guessing whether an account is human, AI, fake, or coordinated.

## Trigger
PR opened or updated, sensitive paths changed, new approvals arrive, new commits invalidate previous reviews, or merge is requested.

## Inputs
PR author, commit authors, commit signature status, changed paths, approvals and timestamps, latest push timestamp, Code Owner review signal, required status checks, agent attribution/session reference when available, and `config/policy.json`.

## Preconditions
Repository facts MUST be fetched from authoritative GitHub metadata or equivalent SCM APIs. Missing evidence MUST remain unknown.

## Allowed tools
Read-only SCM APIs, diff/changed-path inspection, branch/ruleset metadata, CI status APIs, and deterministic validation scripts.

## Constraints
- MUST NOT infer that an account is malicious from age, naming, avatar, geography, or writing style.
- MUST NOT treat multiple comments as independent approvals.
- MUST NOT count the change author as an independent reviewer.
- MUST NOT waive required status checks for agent-authored changes.
- SHOULD require stronger review for sensitive paths or unknown provenance.

## Procedure
1. Identify changed paths and classify whether the PR is sensitive.
2. Enumerate commits and signature-verification states.
3. Enumerate approving reviews and remove the change author from the independent-review set.
4. Check whether approvals post-date the latest material push when policy requires it.
5. Confirm Code Owner review for sensitive changes when required.
6. Confirm all required status checks pass.
7. Record agent attribution/session reference if the platform exposes one.
8. Serialize facts into the gate input schema.
9. Run `scripts/provenance_gate.py`.
10. Route `additional_review_required` to an independent security reviewer; block only on explicit policy failures.

## Decision points
- Missing or failed required status checks: block.
- Required signatures missing on sensitive changes: block.
- Required independent approval missing: block/additional review depending on policy stage.
- Unknown provenance but controls otherwise pass: additional review, not accusation.
- All required evidence passes: allow.

## Expected output
Fact-based decision, missing evidence, policy failures, sensitive-path classification, and required next review action.

## Metrics
Sensitive PR coverage, independent-approval coverage, stale-approval rejection count, signature coverage, status-check coverage, false-block rate on legitimate fixtures, and malicious-fixture block rate.

## Verification
A separate security verifier MUST confirm the facts and gate result for sensitive changes.

## Failure handling
SCM API failures or incomplete metadata produce `additional_review_required` or `block` according to whether the missing field is required. Never convert unknown evidence into a pass.

## Stop conditions
Stop once authoritative evidence is complete and the gate has a stable decision, or after one failed metadata refresh plus one fallback fetch. Escalate after that; do not loop indefinitely.