# Testing and Regression Rules

## Purpose
Prevent code, data, model, and runtime changes from silently degrading validated behavior.

## Scope
Unit, integration, golden-data, model-quality, runtime, and end-to-end tests.

## MUST
- Critical preprocessing, geometry, postprocessing, serialization, and contract logic MUST have deterministic tests.
- Model releases MUST compare approved quality and performance metrics against a defined baseline.
- High-impact discovered failures MUST become regression coverage when reproducible.
- Test fixtures and expected outputs MUST be versioned with assumptions.

## MUST NOT
- Stochastic model tests MUST NOT use brittle exact-value assertions when tolerance or statistical criteria are appropriate.
- Failed quality gates MUST NOT be bypassed without documented risk and approval.

## SHOULD
- Small golden datasets SHOULD cover representative normal, boundary, and failure cases for rapid CI feedback.

## Exceptions
Gate exceptions require reason, evidence, impact, expiration or remediation plan, and accountable approval.

## Verification
Inspect CI results, test determinism, baseline comparisons, fixture provenance, coverage of known failures, and exception records.