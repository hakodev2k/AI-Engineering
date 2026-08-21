# Lifecycle Hooks

## pre-research
Check decision owner, framed question, deadline/constraints, and restricted-data flag.

## pre-experiment
Require hypothesis, baseline, metric, environment, safety, budget, and stop condition. Block if required approval is absent.

## pre-synthesis
Require evidence state for material claims plus contradiction and unknown registers.

## pre-publish
Check no secrets/restricted data, claim traceability, confidence statement, and approvals.

## post-failure
Create Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention record.

Hooks SHOULD be deterministic and idempotent and MUST NOT mutate external systems by default.
