# Temporal Property Rules

## Purpose
Define and verify ordering, eventuality, fairness, and progress properties that cannot be expressed as state invariants alone.

## Scope
Applies to liveness, response, precedence, absence, recurrence, fairness, timeout, and protocol-ordering properties.

## MUST
- State temporal scope and triggering conditions explicitly.
- Distinguish safety properties from liveness properties and verify each with appropriate techniques.
- Document any fairness assumptions and justify why the implementation or environment satisfies them.
- Model cancellation, retries, crashes, and stalled dependencies when they can affect eventuality claims.
- Treat vacuous satisfaction as a verification failure until reviewed.

## MUST NOT
- Claim progress from a property that is only satisfied because its trigger never occurs.
- Introduce strong fairness assumptions solely to eliminate counterexamples.
- Ignore scheduler, network, or dependency behavior that materially affects temporal guarantees.

## SHOULD
- Use bounded variants for diagnostic testing before unbounded verification where helpful.
- Keep temporal formulas paired with readable scenario descriptions.

## Exceptions
Any fairness or progress assumption that cannot be mechanically established requires evidence, operational rationale, risk documentation, and reviewer approval.

## Verification
Use temporal model checking, vacuity checks, fairness review, counterexample traces, trigger coverage, and implementation-level tests or telemetry where applicable.