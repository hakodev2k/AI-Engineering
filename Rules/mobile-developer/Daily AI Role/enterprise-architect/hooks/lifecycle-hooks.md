# Lifecycle Hooks
## intake
Validate decision owner, business outcome, scope, constraints and source references. Idempotent; no writes.
## pre-analysis
Confirm artifact freshness, source ownership and domain reviewers. Stop if regulated/security context is unknown.
## pre-decision
Require alternatives, trade-offs, dependency impact and approval classification.
## post-decision
Ensure ADR/exception, roadmap and impacted standards/reference views are updated once.
## pre-handoff
Check recipient, actionable constraints, open risks, due dates and source links.
## incident-close
Require Failure → Root Cause → Lesson → Process Improvement → Future Prevention with owner.