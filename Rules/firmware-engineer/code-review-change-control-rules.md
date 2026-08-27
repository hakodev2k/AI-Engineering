# Code Review and Change Control

## Purpose
Apply Senior-level scrutiny proportional to firmware blast radius.

## Scope
Source changes, generated code, configuration, linker scripts, toolchain, hardware definitions, and release changes.

## MUST
- Reviews MUST evaluate correctness, concurrency, timing, memory, hardware assumptions, security, compatibility, and recoverability as applicable.
- High-risk changes MUST include verification evidence and rollback/recovery considerations.
- Generated artifacts MUST have a controlled source and regeneration procedure.
- Changes to boot, security, update, persistence, clocking, memory layout, or production provisioning MUST receive domain-appropriate review.
- Reviewer approval MUST be based on inspectable evidence, not author confidence.

## MUST NOT
- Force push or history rewriting of shared release history MUST NOT occur without explicit human approval.
- Large unrelated refactors MUST NOT be mixed into high-risk behavioral fixes when separation is practical.

## SHOULD
- Changes SHOULD be small enough to reason about and verify independently.

## Exceptions
Emergency changes require documented incident context, approver, validation performed, and follow-up debt.

## Verification
Inspect pull-request scope, approvals, CI evidence, diffs, generated-file provenance, and release traceability.