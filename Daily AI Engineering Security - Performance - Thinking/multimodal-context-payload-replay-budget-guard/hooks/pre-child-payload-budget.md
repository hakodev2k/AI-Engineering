# Hook: Pre-Child Payload Budget

## Trigger
Before constructing a child-agent context or serializing a compaction replacement that may contain inline multimodal payloads.

## Preconditions
Policy exists; event manifest contains thread/parent lineage and payload descriptors; heavyweight payloads have hashes.

## Action
Run the deterministic budget checker against the pending manifest and ledger.

## Script/command
`python scripts/payload_replay_guard.py check --policy config/payload-budget.json --manifest pending-context.json --ledger payload-ledger.json`

## Expected result
Exit 0 with `decision=allow` when within budget. Exit 2 with `decision=reference` or `decision=block` when duplicate/heavyweight payload handling is required. Exit 3 for invalid evidence/configuration.

## Failure behavior
Fail closed for invalid/missing lineage when policy requires it. Do not silently remove the artifact. A `reference` decision requires the caller to substitute an integrity-preserving reference and rerun the check.

## Blocks completion
Yes for invalid evidence, budget violation without safe reference substitution, or unknown lineage. No only after an allowed manifest is produced.
