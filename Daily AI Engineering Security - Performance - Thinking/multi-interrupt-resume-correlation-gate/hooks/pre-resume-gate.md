# Hook: Pre-Resume Correlation Gate

## Trigger
Immediately before constructing or sending the framework-specific resume command.

## Preconditions
Current pending interrupt snapshot is available as JSON and the caller supplied a canonical resume envelope.

## Action
Run deterministic validation and block on any ambiguity.

## Script/command
```bash
python scripts/resume_correlation_guard.py \
  --pending artifacts/current-pending.json \
  --resume artifacts/resume-envelope.json \
  --json-out artifacts/resume-guard-report.json
```

## Expected result
Exit `0` and report `ok: true`. The `adapter_resume` value may then be translated into the framework command.

## Failure behavior
Exit `2`: keep the workflow interrupted and surface non-sensitive violations.  
Exit `3`: treat input/state evidence as invalid; re-read pending state once, then stop if still invalid.

## Blocking
Yes. Any non-zero exit blocks resume.
