# Shell Automation Safety

## Purpose
Build maintainable shell automation that fails predictably, preserves data, and is safe to rerun.

## When to use
Use for host bootstrap, operational scripts, batch administration, deployment helpers, and incident tooling. Prefer a stronger language when complexity, concurrency, or data modeling exceeds shell's strengths.

## Inputs
Required state change, target hosts/files, privilege model, failure semantics, environment, and rollback requirements.

## Context to inspect
Inspect shell version, existing automation ownership, configuration management, quoting/path assumptions, credentials, execution user, and concurrency.

## Core knowledge
Understand exit status, pipelines, quoting, word splitting, globbing, traps, temporary files, idempotency, atomic replacement, locking, and privilege boundaries.

## Procedure
1. Define inputs, outputs, side effects, and rerun semantics.
2. Validate all external inputs and prerequisites.
3. Quote expansions and avoid parsing human-oriented command output.
4. Use explicit error handling and meaningful exit codes.
5. Make state changes idempotent where possible.
6. Use secure temporary files and atomic writes.
7. Add locking for mutually exclusive operations.
8. Avoid embedding secrets or broad sudo.
9. Test success, partial failure, interruption, and rerun cases.
10. Add logging appropriate to operational use.

## Decision points
Use shell for orchestration of system commands; switch to Python/Go/etc. for complex structures, robust APIs, heavy testing, or concurrency.

## Common failure patterns
Unquoted variables, rm with unchecked paths, curl-pipe-shell, silent pipeline failures, non-idempotent append operations, insecure /tmp files, and hidden environment dependencies.

## Verification
Static checks where available, controlled tests, rerun tests, failure injection, correct permissions, and no secret leakage.

## Expected output
Safe reusable script with explicit contracts and tested failure behavior.

## Stop conditions
Stop if destructive targets cannot be bounded, credentials would be exposed, or rollback for high-impact changes is unavailable.