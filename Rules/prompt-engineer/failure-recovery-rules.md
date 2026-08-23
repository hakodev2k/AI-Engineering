# Failure Recovery Rules

## Purpose
Define safe, bounded behavior when prompts, models, tools, or validations fail.

## Scope
Timeouts, malformed output, refusals, tool errors, retrieval failures, validation failures, and partial execution.

## MUST
- Failure modes that can occur in production MUST have explicit handling behavior.
- Recovery attempts MUST be bounded and MUST NOT duplicate irreversible side effects.
- The workflow MUST distinguish incomplete execution from successful completion.
- High-risk failures MUST prefer safe degradation, escalation, or human review over unsupported guessing.

## MUST NOT
- MUST NOT silently convert tool or validation failures into fabricated success.
- MUST NOT retry indefinitely.
- MUST NOT broaden permissions or weaken validation to recover from a failure.
- MUST NOT discard diagnostic evidence needed for root-cause analysis.

## SHOULD
- Recovery prompts SHOULD preserve the original objective, known constraints, and verified intermediate state.
- Repeated failures SHOULD trigger a different recovery path rather than identical retries.

## Exceptions
Automatic recovery may execute without human involvement for reversible, low-risk operations within a documented retry budget.

## Verification
Run timeout, malformed-output, partial-side-effect, and repeated-failure tests; inspect logs and idempotency behavior.