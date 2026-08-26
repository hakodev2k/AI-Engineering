# Guardrail Bypass Testing

## Purpose
Evaluate whether layered safeguards remain effective under adversarial pressure.

## Scope
Input filters, classifiers, system instructions, policy engines, output filters, tool gates, rate controls, and human approvals.

## MUST
- Test safeguards individually and in composition to locate the actual failing layer.
- Measure false negatives and security-relevant false positives against defined cases.
- Verify bypasses through observable behavior rather than inferred internal state.

## MUST NOT
- Treat one safeguard layer as sufficient for high-impact actions without evaluating defense in depth.
- Disable controls during evaluation unless the test explicitly measures that layer and the environment is contained.

## SHOULD
Test boundary cases, transformations, multilingual variants, context accumulation, and adaptive retries.

## Exceptions
Unavailable internal layers may be black-box tested with limitations documented.

## Verification
Inspect classifier decisions, policy traces, model output, downstream gates, and end-to-end outcomes.