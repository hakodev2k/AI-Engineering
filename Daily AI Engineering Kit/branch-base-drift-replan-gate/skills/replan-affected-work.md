# Skill: Replan Affected Work

## Purpose
Re-evaluate only the plan steps invalidated by target-branch drift while preserving unaffected verified work.

## When to use
Use after `scripts/evaluate-branch-drift.py` reports `replan-required` or `review-required`.

## Inputs
- Validated planning baseline
- Current target/head refs
- Drift report
- Original plan steps
- Relevant tests and architecture/dependency evidence

## Preconditions
- Drift report was generated from the same plan identifier.
- Current repository state is readable.
- No implementation resumes before affected assumptions are revalidated.

## Allowed tools
Read-only Git, repository read/search, test discovery, static dependency inspection, and the package scripts.

## Constraints
- Expand context only around changed/affected paths and dependencies.
- Do not mark a plan step unaffected without evidence.
- Do not hide conflicts by rebasing/merging automatically.

## Procedure
1. Read `changed_since_baseline`, overlap findings, and affected assumptions from the drift report.
2. Map each changed path to plan steps, dependency boundaries, tests, generated artifacts, API/config/schema surfaces, and shared infrastructure.
3. Classify each plan step as `unchanged`, `revalidate`, `replan`, or `blocked`.
4. Re-read only the evidence needed for `revalidate`/`replan` steps.
5. Update assumptions with current evidence.
6. Update test scope where branch drift changes behavior or dependency risk.
7. Preserve old plan text as historical evidence; create a new revision rather than pretending the old plan was current.
8. Record replan decisions and unresolved risks in the replan record.
9. Request independent review when policy requires it.
10. Run the final gate before implementation or PR completion.

## Expected output
A replan record whose current target/head/base fingerprints match repository state and whose affected steps have explicit dispositions.

## Verification
- Every drift finding is mapped to at least one disposition or explicitly marked irrelevant with evidence.
- No affected assumption remains silently inherited.
- Required tests are updated.
- Gate returns `verified` before work resumes.

## Failure handling
- Missing dependency evidence: classify affected step as `blocked`.
- Ambiguous overlap: escalate to reviewer; do not guess.
- Transient repository read failure: retry once.

## Stop conditions
Stop when the final gate is `verified`, when human approval is required for a dangerous action, or when a blocking ambiguity remains.