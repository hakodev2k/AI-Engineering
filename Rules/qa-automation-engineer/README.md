# QA Automation Engineer Rules

Operating constraints for AI-assisted work performed in the QA Automation Engineer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching QA automation procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [API Automation Rules](api-automation-rules.md)
- [CI Execution Rules](ci-execution-rules.md)
- [Automation Code Review Rules](code-review-rules.md)
- [Contract Testing Rules](contract-testing-rules.md)
- [Coverage and Risk Rules](coverage-risk-rules.md)
- [Database Validation Rules](database-validation-rules.md)
- [Determinism Rules](determinism-rules.md)
- [Test Environment Rules](environment-rules.md)
- [Evidence and Artifact Rules](evidence-artifact-rules.md)
- [Failure Triage Rules](failure-triage-rules.md)
- [Mocking and Service Virtualization Rules](mocking-virtualization-rules.md)
- [Automation Observability Rules](observability-rules.md)
- [Performance Testing Rules](performance-testing-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Regression Strategy Rules](regression-strategy-rules.md)
- [Release Gate Rules](release-gate-rules.md)
- [Requirements Traceability Rules](requirements-traceability-rules.md)
- [Retry and Flakiness Rules](retry-flakiness-rules.md)
- [Security Testing Rules](security-testing-rules.md)
- [Selector Rules](selector-rules.md)
- [Test Architecture Rules](test-architecture-rules.md)
- [Test Data Rules](test-data-rules.md)
- [Test Isolation Rules](test-isolation-rules.md)
- [UI and E2E Rules](ui-e2e-rules.md)
- [Wait and Synchronization Rules](wait-synchronization-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
