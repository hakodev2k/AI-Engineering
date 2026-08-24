# Tooling Testing Strategy Rules
## Purpose
Protect developer tooling from regressions across supported workflows and environments.
## Scope
Unit, integration, contract, end-to-end, compatibility, failure, and upgrade testing.
## MUST
- Critical workflows MUST have automated regression protection at the lowest reliable test layer plus end-to-end coverage for material integration risk.
- Tests MUST be deterministic enough that failure remains actionable.
- Compatibility-sensitive changes MUST test supported versions or environments affected by the change.
- Failure paths MUST be tested for diagnostics and safe recovery.
## MUST NOT
- MUST NOT use retries to conceal persistent flakiness.
- MUST NOT make tests depend on production services or mutable production data.
- MUST NOT delete meaningful coverage solely to shorten CI without risk analysis.
## SHOULD
- Test fixtures SHOULD be minimal, isolated, and representative.
- Expensive suites SHOULD be partitioned according to risk and feedback needs.
## Exceptions
Coverage gaps require documented risk, compensating verification, owner, and remediation plan.
## Verification
Review test matrix, flaky history, coverage of critical journeys, failure-path assertions, compatibility runs, and defect escapes.