# Lifecycle Hooks

## intake_validate
Deterministically reject work missing objective, funnel stage, segment, metric or owner. Never invent missing business facts.

## pre_experiment_gate
Check hypothesis, primary metric, guardrails, exposure/instrumentation, decision rule and approvals. Idempotent: same inputs produce same findings.

## pre_campaign_gate
Check audience eligibility, consent/suppression, frequency caps, tracking and irreversible-send approval.

## post_result_gate
Require data-quality status, primary outcome, guardrails, confidence/limitations and decision before closure.

## failure_capture
For failed or invalid work, append Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention. Do not retry more than twice.
