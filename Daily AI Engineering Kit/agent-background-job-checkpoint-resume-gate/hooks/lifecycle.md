# Lifecycle Hooks

## Pre-task validation
**Trigger:** before first run or resume. **Preconditions:** job ID/type, input, and checkpoint path are known. **Action:** run `python scripts/checkpoint_gate.py verify ...` when a checkpoint exists; otherwise initialize it. **Expected result:** identity and fingerprint match. **Failure:** block execution on exit codes 2-6 or 10.

## Post-chunk checkpoint
**Trigger:** after one chunk has been durably committed. **Action:** run `python scripts/checkpoint_gate.py update --checkpoint <path> --cursor '<json>' --processed-count <n> --status running`. **Expected result:** atomic checkpoint update. **Failure:** block the next chunk; do not infer progress.

## Failure capture
**Trigger:** non-retryable failure or exhausted transient retries. **Action:** update status to `failed` with concise error evidence. **Expected result:** last durable cursor remains unchanged. **Failure:** preserve original checkpoint and raw error; block execution.

## Final verification
**Trigger:** input exhausted. **Action:** mark checkpoint `completed`, then run package and project tests. **Expected result:** completed state rejects future resume and all required checks pass. **Failure:** completion is not verified; block success reporting.
