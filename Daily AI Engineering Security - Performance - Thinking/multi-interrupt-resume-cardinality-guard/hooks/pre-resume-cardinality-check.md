# Hook: Pre-Resume Cardinality Check

## Trigger
Immediately before a host consumes any human interrupt/approval response.

## Preconditions
Export current pending state and proposed response into one JSON document matching the example schema.

## Action
```bash
python scripts/interrupt_resume_guard.py "$RESUME_BUNDLE"
```

## Expected result
Exit `0` and `status=valid`.

## Failure behavior
Exit `2`: block consumption and side effects; refresh pending state once only if a concurrent change is independently observed. Exit `1`: block because verification could not complete.

## Blocks completion
Yes. No model continuation or approved tool execution should occur from an ambiguous response set.