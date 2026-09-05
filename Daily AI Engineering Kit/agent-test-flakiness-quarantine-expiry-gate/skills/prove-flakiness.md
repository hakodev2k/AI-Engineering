# Skill: Prove Flakiness

## Purpose
Distinguish nondeterministic tests from deterministic product/test defects before quarantine.

## When to use
Any time an agent proposes skip, quarantine, retry-only handling, or test-selection exclusion.

## Inputs
Test id, recent CI evidence, local reproduction command, environment metadata.

## Process
1. Identify the exact test and nearest setup/fixtures.
2. Capture at least two failing and two passing executions under materially equivalent conditions unless infrastructure prevents this.
3. Compare seeds, timing, ordering, shared state, external dependencies, resources, and environment.
4. Rule out deterministic product regression and deterministic test bug.
5. Record reproduction evidence in a stable artifact or CI URL.
6. Estimate blast radius of disabling the test.
7. If flakiness is proven, propose the shortest bounded quarantine and owner.
8. If flakiness is not proven, stop quarantine and route to normal defect investigation.

## Constraints
Do not alter production behavior merely to make a test pass. Do not increase retries until green as evidence.

## Output
Finding, evidence, confidence, suspected nondeterministic mechanism, affected coverage, recommended action.

## Verification
Classification is valid only when evidence demonstrates both pass and fail outcomes under comparable conditions.

## Failure handling
Transient runner failures may retry twice. Environment mismatch blocks classification.

## Stop conditions
Insufficient evidence, destructive reproduction requirements, production-only reproduction, or permission boundaries.
