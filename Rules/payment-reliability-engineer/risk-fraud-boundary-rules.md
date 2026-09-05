# Risk and Fraud Boundary Rules

## Purpose
Keep reliability logic distinct from fraud and risk decisions while preserving safe enforcement boundaries.

## Scope
Fraud engines, velocity controls, sanctions or risk checks, step-up authentication, payment holds, and manual review integrations.

## MUST
- Required risk and fraud checks MUST complete before the financial action they are designed to gate.
- Reliability fallbacks MUST preserve mandatory risk and authorization controls.
- Risk-decision inputs and resulting enforcement outcomes MUST be traceable without exposing unnecessary sensitive data.
- Dependency failures MUST have explicit fail-open or fail-closed policy approved for the relevant payment flow.
- Manual overrides MUST be attributable, bounded, and auditable.

## MUST NOT
- MUST NOT bypass fraud, sanctions, authentication, or risk controls merely to restore throughput.
- MUST NOT reinterpret a risk rejection as a transient infrastructure failure for automatic retry.
- MUST NOT let reliability automation silently expand payment authorization authority.

## SHOULD
- Separate risk-decision ownership from payment execution while maintaining a clear contract between them.

## Exceptions
Require risk/security ownership, documented rationale, compensating controls, bounded duration, and approval.

## Verification
Inspect control flow, failover policy, rejection handling, override logs, and dependency-failure tests.