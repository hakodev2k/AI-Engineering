# Automation and Scripting Rules

## Purpose
Ensure operational automation is safe, deterministic, reviewable, and resistant to partial failure.

## Scope
Applies to shell, Python, orchestration scripts, scheduled jobs, fleet commands, and administrative automation.

## MUST
- Automation MUST validate inputs, target scope, prerequisites, and dangerous assumptions before mutation.
- Scripts performing destructive or privileged actions MUST fail closed on ambiguous targets and require explicit authorization where appropriate.
- Exit status and failure paths MUST be handled; partial success MUST be detectable.
- Repeated execution MUST be idempotent where practical or explicitly guarded when it is not.
- Automation MUST emit enough structured evidence to identify targets, actions, failures, and final state without exposing secrets.

## MUST NOT
- Unquoted or unsafe input expansion MUST NOT be used where it can alter command semantics.
- Remote fleet commands MUST NOT default to unrestricted scope for dangerous operations.
- Error suppression MUST NOT hide failed administrative commands.
- Secrets MUST NOT be embedded in scripts or echoed into logs.

## SHOULD
- Use strict modes, typed/structured tooling, and tested libraries appropriate to complexity.
- Separate discovery from mutation and support dry-run where trustworthy.
- Add concurrency limits and backoff for fleet operations.

## Exceptions
One-off emergency scripts require peer review when feasible, bounded targets, captured source, and post-use disposal or hardening before reuse.

## Verification
Run lint/static analysis, unit or integration tests for parsing and failure paths, dry-runs, sandbox execution, target-scope review, and controlled failure injection.