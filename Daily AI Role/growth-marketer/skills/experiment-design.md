# Experiment Design
Purpose: convert growth hypotheses into decision-grade tests.
Trigger: a prioritized, testable hypothesis exists.
Inputs: hypothesis, target segment, baseline, expected effect, traffic, constraints.
Preconditions: measurable exposure and outcome events.
Procedure: state causal hypothesis; choose unit/randomization or quasi-experiment; define primary metric and guardrails; estimate duration/sample requirements; enumerate confounders; define launch checks and decision rules; pre-register interpretation; coordinate implementation; review results against rules.
Decisions: reject tests that cannot change a decision; use holdouts where feasible; do not expand scope mid-test.
Output: experiment brief, instrumentation contract, decision rule, readout plan.
Quality: one primary outcome, explicit guardrails, bounded duration, reproducible analysis.
Failure: contamination or broken tracking invalidates causal claims; repair and rerun at most twice.
Stop: test can be launched safely or is explicitly rejected with reason.