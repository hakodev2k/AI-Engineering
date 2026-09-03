# Hook: Post-edit Verification

## Trigger
After any edit to an affected trace boundary or its tests.

## Preconditions
Implementation Agent has produced a bounded diff.

## Action
1. Run repository formatter if required.
2. Run targeted tests and required host build/test checks.
3. Run:

```bash
python3 scripts/scan-trace-propagation.py --repo "$REPO" --config config/trace-gate.json --output /tmp/trace-propagation-scan.json
python3 scripts/verify-evidence.py --evidence "$EVIDENCE" --schema schemas/evidence.schema.json
```

4. Inspect the changed-file diff.
5. Hand off to Verification Agent.

## Expected result
Build/tests pass, no unexplained blocking scanner finding remains, evidence contract validates, and diff is scoped.

## Failure behavior
Use the workflow's maximum two implementation retries. Preserve failing output. Do not retry permission/approval failures.

## Blocking
Yes. Independent verification is also mandatory before completion.