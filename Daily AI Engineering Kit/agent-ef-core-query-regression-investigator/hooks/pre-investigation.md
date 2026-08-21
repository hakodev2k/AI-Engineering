# Hook: Pre-Investigation Repository Validation

## Trigger
Before evidence collection begins.

## Preconditions
Run from the target repository root.

## Action
Execute:

`bash scripts/verify-repository.sh --preflight`

## Expected result
- Git repository is detected.
- Working-tree state is reported.
- Required .NET tooling is available.
- No destructive action is performed.

## Failure behavior
A non-zero exit blocks implementation work. Investigation may continue read-only only when the failure is explicitly recorded and does not invalidate evidence.

## Blocking
Yes for implementation; conditional for read-only investigation.
