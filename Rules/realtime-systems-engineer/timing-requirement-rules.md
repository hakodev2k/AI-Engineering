# Timing Requirement Rules

## Purpose
Define enforceable timing contracts for real-time systems.

## Scope
Deadlines, periods, jitter, response time, throughput, and end-to-end latency budgets.

## MUST
- Every real-time path MUST define deadline, period or arrival model, acceptable jitter, and failure consequence.
- End-to-end latency budgets MUST be decomposed across scheduling, computation, I/O, communication, and queueing stages.
- Timing requirements MUST identify whether they are hard, firm, or soft and MUST define the evidence required for acceptance.

## MUST NOT
- MUST NOT use average latency as evidence for hard deadline compliance.
- MUST NOT leave timing assumptions implicit when they affect schedulability or safety.

## SHOULD
- Timing requirements SHOULD include overload behavior and degraded-mode expectations.

## Exceptions
Exceptions require documented rationale, quantified risk, alternative considered, and accountable approval.

## Verification
Review requirement traceability, timing budgets, measured distributions, deadline-miss counters, and acceptance tests.