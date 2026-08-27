# Testing and Regression Rules

## Purpose
Prevent NLP code, data, model, and integration changes from reintroducing known failures.

## Scope
Unit, integration, end-to-end, golden, metamorphic, regression, and failure tests.

## MUST
- Deterministic preprocessing, tokenization, schema, and integration behavior MUST have automated tests.
- Every material fixed failure SHOULD become a regression test or evaluation case unless doing so would encode unstable behavior.
- Critical end-to-end paths MUST test model artifact, preprocessing, serving, and downstream interpretation together.
- Test data containing sensitive text MUST follow production-equivalent data handling requirements.

## MUST NOT
- MUST NOT make nondeterministic tests pass by arbitrary retries that hide defects.
- MUST NOT update golden outputs solely to make a failing test green without reviewing semantic change.
- MUST NOT rely only on unit tests for model-serving contract changes.

## SHOULD
- Metamorphic tests SHOULD cover invariances or controlled transformations appropriate to the task.
- Failure tests SHOULD cover malformed, empty, oversized, multilingual, and adversarial inputs.

## Exceptions
Unautomatable behavior requires explicit manual verification criteria and retained evidence.

## Verification
Review CI results, regression provenance, golden diffs, flaky-test rates, integration coverage, failure fixtures, and manual evidence where automation is infeasible.