# Hook: Pre-task Validation

## Trigger
Before repository investigation or edits.

## Preconditions
Package directory is intact; repository path is known.

## Action
Run:

```bash
python3 scripts/validate-config.py --config config/trace-gate.json
python3 scripts/scan-trace-propagation.py --repo "$REPO" --config config/trace-gate.json --output /tmp/trace-propagation-scan.json
```

## Expected result
Configuration validates and scanner output is created. A non-zero scanner exit means high-risk boundaries require investigation; it is not permission to edit automatically.

## Failure behavior
Invalid config or missing repository blocks execution. Scanner high findings block completion but allow the investigation stage.

## Blocking
Configuration/repository failures: yes. Scanner findings: block completion, not investigation.