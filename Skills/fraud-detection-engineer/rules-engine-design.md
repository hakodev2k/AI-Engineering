# Rules Engine Design

## Purpose
Design deterministic fraud rules that are explainable, maintainable, measurable, and safely coordinated with statistical models.

## When to use
Use for known fraud patterns, policy controls, emergency mitigations, compliance-driven checks, or model guardrails. Avoid using rules as an ungoverned substitute for a learning system when patterns are complex and evolving.

## Inputs
- Fraud hypotheses
- Available real-time signals
- Historical event data
- Decision actions
- Existing rules and reason codes

## Context to inspect
Inspect rule order, precedence, dependencies, thresholds, overrides, exception lists, historical hit rates, false positives, and downstream action semantics.

## Core knowledge
Rules should encode a clear hypothesis and bounded action. Rule systems need versioning, ownership, observability, conflict handling, expiration, and replayability. A rule that cannot be evaluated independently becomes difficult to tune safely.

## Procedure
1. State the fraud hypothesis and intended action.
2. Identify minimal reliable signals.
3. Define predicates and thresholds precisely.
4. Assign stable reason codes and ownership.
5. Specify precedence and conflict behavior.
6. Backtest against representative historical traffic.
7. Measure incremental capture, false positives, and overlap with other controls.
8. Add activation, expiration, rollback, and emergency-disable paths.
9. Deploy in observe-only or shadow mode when risk warrants.
10. Review performance on a defined cadence.

## Decision points
Use hard blocks only when confidence and impact justify irreversibility. Prefer step-up authentication, review, or score adjustments for uncertain signals. Consolidate redundant rules when they share semantics.

## Common failure patterns
- Permanent emergency rules
- Thresholds without cost analysis
- Conflicting rules with hidden precedence
- No reason-code traceability
- Rules that duplicate model behavior without incremental value

## Verification
Replay historical traffic, test edge cases, verify reason codes and precedence, and monitor post-release decision distribution and loss metrics.

## Expected output
A versioned, measurable rule with explicit hypothesis, action, reason code, owner, tests, and rollback plan.

## Stop conditions
Stop when the required signal is unreliable, the action is legally constrained, or historical data cannot support a safe threshold.