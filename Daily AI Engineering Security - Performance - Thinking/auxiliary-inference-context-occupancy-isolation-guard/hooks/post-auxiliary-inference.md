# Hook — Post Auxiliary Inference
## Trigger
After advisor/helper/subagent inference, before parent compaction eligibility.
## Preconditions
Before/after occupancy and auxiliary usage are captured.
## Action
`python scripts/check_occupancy.py trace.json --policy config/policy.json`
## Expected result
Exit 0.
## Failure behavior
Exit 2 blocks using the contaminated occupancy value and falls back to the last provider-validated parent occupancy; exit 3 blocks measurement. Retry deterministic input correction once.
## Blocks completion
Yes.