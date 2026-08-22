# Lifecycle Hooks

## before_analysis
Deterministically reject work lacking question, decision, owner, deadline, population, grain, metric, time window, or source. Flag restricted-data scope for human approval.

## before_query_acceptance
Require source freshness check, join-key uniqueness assumption, denominator definition, timezone, and exclusion rules.

## before_publish
Require evidence link/query reference, caveat log, confidence statement, surprise verification, and approval status. Block unsupported causal language.

## after_rework_or_incident
Create a failure-learning record using: Failure → Root Cause → Lesson → Process Improvement → Future Prevention.

Hooks should be idempotent: repeated evaluation must not mutate evidence or create duplicate decisions.
