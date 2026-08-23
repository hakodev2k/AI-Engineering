# Failure Testing Rules

## Purpose
Validate distributed behavior under realistic faults rather than nominal-only tests.

## Scope
Node loss, dependency failure, latency, packet loss, duplication, reordering, and capacity exhaustion.

## MUST
- Critical workflows MUST be tested against the failures identified in their design assumptions.
- Tests MUST verify both safety properties and recovery behavior.
- Fault injection MUST have blast-radius controls and explicit environment boundaries.

## MUST NOT
- MUST NOT infer resilience solely from unit tests or happy-path integration tests.
- MUST NOT run destructive production fault experiments without approved safeguards.

## SHOULD
- Reproduce prior incident failure modes as regression tests where practical.

## Exceptions
Untestable failure modes require documented reasoning and alternative evidence.

## Verification
Review fault-injection suites, recovery assertions, incident-derived regressions, and controlled chaos-test evidence.