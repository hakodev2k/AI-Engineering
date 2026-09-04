# Post-edit Verification Hook

## Trigger
After implementation edits and before completion.

## Preconditions
Candidate changes exist; host repository build/test commands are known.

## Action
1. Run host formatter/static checks when available.
2. Run relevant unit/integration tests.
3. Run `scripts/scan-outbox-risk.py` against the repository.
4. Validate the produced evidence with `scripts/verify-evidence.py`.
5. Inspect the git diff for unrelated or approval-required changes.
6. Hand evidence to the Verification Agent.

## Commands

```bash
python3 scripts/scan-outbox-risk.py --repo /path/to/repository --config config/outbox-gate.json --output /tmp/outbox-scan.json
python3 scripts/verify-evidence.py --evidence /tmp/outbox-evidence.json
```

## Expected result
All applicable host checks pass; evidence validation passes; no unexplained blocking finding or unapproved dangerous change remains.

## Failure behavior
A code/test failure may return to implementation subject to the two-retry workflow limit. Evidence-schema failure blocks completion. Permission failures stop immediately.

## Blocking
Yes.
