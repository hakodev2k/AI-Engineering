# Lifecycle hooks

## Pre-task repository validation
- Trigger: before investigation.
- Command: `python scripts/concurrency_gate.py preflight --repo .`
- Expected: Git repository detected and no unresolved merge markers.
- Failure: blocking.

## Post-edit static gate
- Trigger: after implementation.
- Command: `python scripts/concurrency_gate.py scan --repo .`
- Expected: report of concurrency-related persistence signals for reviewer inspection.
- Failure: blocking only for script errors; findings require review rather than automatic failure.

## Final verification
- Trigger: after project build/tests and independent two-writer test.
- Command: `python scripts/concurrency_gate.py verify --repo . --report artifacts/concurrency-verification.json`
- Expected: exit 0 and report status `verified`.
- Failure: blocking.

Hooks never deploy, mutate production, or modify repository files.