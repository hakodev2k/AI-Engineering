# Automation and Rate-Limit Testing

## Purpose
Determine whether automation, repetition, or scale turns bounded AI weaknesses into material risk.

## Scope
Inference endpoints, agents, account creation, retries, batch interfaces, tool calls, and abuse controls.

## MUST
- Evaluate security assumptions that depend on attack cost, query volume, retries, or account limits.
- Bound automated tests by approved request, spend, and resource budgets.
- Measure whether throttling and abuse controls act on the correct identity and attack dimension.

## MUST NOT
- Generate uncontrolled load against production.
- Bypass provider or organizational limits outside explicit authorization.

## SHOULD
Test distributed identities, slow attacks, adaptive retries, and cost-amplification paths in safe environments.

## Exceptions
Higher-volume production tests require capacity review, explicit approval, monitoring, and abort thresholds.

## Verification
Review request counts, identities, budgets, latency, resource metrics, throttling decisions, and test authorization.