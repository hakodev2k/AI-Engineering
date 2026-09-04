# Failure Classification Rules

## Purpose
Ensure agent failures are classified from evidence so retry, fallback, escalation, and recovery behavior is appropriate and reproducible.

## Scope
Applies to model failures, tool failures, policy rejections, authorization failures, state errors, capacity issues, timeouts, invalid input, and uncertain external outcomes.

## MUST
- Production workflows MUST use a failure taxonomy that distinguishes at least input, authorization, policy, model, dependency/tool, timeout, capacity, state-consistency, cancellation, and unknown-outcome failures when relevant.
- Failure records MUST preserve the original diagnostic evidence and causal chain available from underlying components.
- Each failure class MUST map to explicit retry, fallback, reconciliation, escalation, or terminal behavior.
- Unknown external commit status MUST be represented as an uncertain outcome requiring reconciliation rather than ordinary failure.
- Error classification MUST be deterministic where protocol or tool evidence is sufficient.

## MUST NOT
- Distinct failure causes MUST NOT be collapsed into a generic retryable error when their safe responses differ.
- An LLM-generated explanation MUST NOT replace underlying error evidence or be treated as confirmed root cause.
- Authorization and policy denials MUST NOT be reclassified solely to enable retries or fallback execution.

## SHOULD
- Failure taxonomies SHOULD remain stable enough for trend analysis while allowing versioned extensions.
- User-visible errors SHOULD preserve useful actionability without exposing sensitive internal details.

## Exceptions
Classification simplification requires evidence that the merged classes have identical safe handling and operational ownership.

## Verification
Inject representative failures for every class, verify deterministic mapping and downstream handling, inspect traces for causal preservation, and test uncertain commit-state reconciliation separately.