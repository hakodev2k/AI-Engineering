# Hook: Pre-Review Context Gate

## Trigger
Before an AI reviewer consumes branch-local instructions, skills, or persuasive PR metadata.

## Preconditions
Changed paths are enumerated from base/head refs without running PR code; `config/policy.json` is loaded.

## Action
Create an input JSON with `changed_paths`, `approved_head_instruction_changes`, and available `independent_security_evidence`, then run:

`python scripts/review_context_guard.py review-input.json --policy config/policy.json`

## Expected result
Exit code `0` only when required instruction-change approval and independent evidence conditions are satisfied.

## Failure behavior
Exit `2`: invalid input/config; correct it. Exit `3`: keep head-branch review context supplemental/quarantined, collect required evidence or human approval, and rerun within the bounded workflow retry budget.

## Blocks completion
Yes. A blocked gate prevents a verified-safe security conclusion, though it does not prevent a human from inspecting the PR manually.