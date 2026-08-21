# Workflow: Review Context Sanitize and Verify

## Trigger
AI-assisted pull-request review.

## Goal
Keep branch-controlled review context from silently changing the reviewer policy that evaluates the branch.

## Inputs
Base/head refs, changed paths, PR metadata, trusted base policy, branch-local instructions/skills, scan/test results, configuration.

## Baseline
Record review-context files and hashes on the base ref, mandatory security checks, and initial reviewer policy.

## Stages
1. **Observe** — list changed paths without executing PR code.
2. **Trust audit** — run `scripts/review_context_guard.py` to detect changed reviewer-context files and missing evidence.
3. **Sanitize** — label head instructions supplemental; quarantine persuasive PR metadata for first security pass when configured.
4. **Baseline review** — review diff using trusted base policy and deterministic evidence.
5. **Supplemental review** — optionally expose approved/labeled branch guidance after baseline findings are frozen.
6. **Compare** — detect findings removed/downgraded only after supplemental framing; treat material suppression as a conflict.
7. **Independent verification** — Security Review Verifier checks scans, tests, provenance, and conflicts.
8. **Decision** — verified, human-review-required, or incomplete/block.

## Responsible agents
Review Trust Auditor: stages 1–3. AI Reviewer: stages 4–6. Independent Security Review Verifier: stage 7. Human/merge gate: stage 8 for high-risk conflicts.

## Tools
Git diff/read by ref, `review_context_guard.py`, CodeQL/static scanners, secret/dependency scanners, isolated tests.

## Outputs
Trust decision, quarantined/supplemental context list, baseline findings, supplemental findings, evidence map, final verification state.

## Checkpoints
Changed review-context detection; mandatory scan availability; baseline findings frozen before supplemental context; independent verifier approval.

## Metrics
Instruction-change detection, evidence coverage, suppressed findings, adversarial-fixture detection, false-negative regression rate.

## Retry policy
At most `max_review_retries` (default 2). A retry must collect missing evidence or resolve a named provenance conflict.

## Stop conditions
Complete only when required evidence is present and verifier status is `verified`. Stop as incomplete when retries expire; never downgrade policy to force completion.

## Failure path
Block verified-safe conclusion, preserve baseline and supplemental findings separately, and escalate unresolved policy/conflict decisions.

## Definition of Done
Implemented: trust gate used. Measured: provenance/evidence and adversarial fixtures recorded. Verified: branch-controlled context cannot override base security policy and mandatory scans/tests support the final conclusion.