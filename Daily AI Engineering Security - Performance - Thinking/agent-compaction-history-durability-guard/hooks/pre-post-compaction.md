# Hook: Pre/Post Compaction Durability

## Trigger
Pre-compaction before any destructive mutation, and post-compaction before pruning/session finalization.

## Preconditions
Stable source transcript path and writable ledger path.

## Action
Pre: capture count/hash manifest. Post: verify source or archive against manifest.

## Script/command
Pre: `python3 scripts/compaction_durability.py precommit --source <session.jsonl> --ledger <ledger.json>`

Post: `python3 scripts/compaction_durability.py postcheck --ledger <ledger.json> --source <session.jsonl> --archive <archive.jsonl>`

## Expected result
Exit 0 only when precommit evidence is valid and postcheck proves a recoverable matching source or archive. Exit 2 is durability mismatch/missing evidence. Exit 3 is malformed input.

## Failure behavior
Block destructive pruning/finalization, preserve evidence, and escalate. Do not regenerate missing history from the summary and call it verified.

## Blocking
Yes for compaction finalization and destructive source removal.
