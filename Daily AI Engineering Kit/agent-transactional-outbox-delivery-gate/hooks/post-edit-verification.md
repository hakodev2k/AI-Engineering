# Hook: Post-edit Verification

## Trigger
After any implementation change to business persistence, outbox persistence, dispatcher, retry, or claim logic.

## Preconditions
Repository path and config are known.

## Action
Run:

```bash
python3 scripts/scan-outbox.py --repo "$REPO_ROOT" --config config/outbox-gate.json --output /tmp/outbox-scan.json
python3 -m unittest tests/test-scan-outbox.py
```

Then run the host repository's focused tests/build and validate produced evidence:

```bash
python3 scripts/verify-evidence.py --evidence "$EVIDENCE_PATH" --schema schemas/evidence.schema.json
```

## Expected result
All commands exit 0 and verification status is `verified` after independent review.

## Failure behavior
Block completion. Preserve outputs. Return to implementation only within workflow retry limits.

## Blocking
Yes.
