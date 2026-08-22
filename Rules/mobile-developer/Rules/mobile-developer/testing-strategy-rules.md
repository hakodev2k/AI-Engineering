# Testing Strategy Rules
## Purpose
Provide layered evidence that mobile behavior is correct across logic, integration, UI, lifecycle, and devices.
## Scope
Unit, integration, UI, contract, device, regression, and failure-path testing.
## MUST
- Critical business rules MUST have deterministic automated coverage below the UI layer where practical.
- Platform integrations and persistence/network boundaries MUST have integration evidence.
- Critical user journeys MUST have end-to-end coverage on representative configurations.
- Regression fixes MUST add protection at the lowest effective layer.
## MUST NOT
- UI automation MUST NOT be the only evidence for core business correctness.
- Flaky tests MUST NOT be normalized as acceptable signal.
## SHOULD
- Test selection SHOULD be risk-based across OS versions and device tiers.
## Exceptions
Hard-to-automate hardware behavior may use controlled manual verification with recorded evidence.
## Verification
Inspect test pyramid, CI results, flake rates, device matrix, failure-path tests, and regression traceability.