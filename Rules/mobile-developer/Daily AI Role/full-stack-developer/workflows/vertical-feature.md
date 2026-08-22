# Workflow: Vertical Feature Delivery
Trigger: approved feature or behavior change.
Goal: ship a coherent user-visible slice across all affected layers.
Inputs: work item, acceptance criteria, architecture constraints.
Preconditions: owner and source of truth known.
Stages: 1) frame outcome and risks; 2) map UI/API/data/integration contracts; 3) identify dependencies and approvals; 4) parallelize frontend test scaffolding, backend design, and data review only after contracts stabilize; 5) implement smallest reversible slice; 6) integrate and run end-to-end tests; 7) reviewers inspect their domains; 8) resolve conflicts; 9) release-readiness gate; 10) staged release and telemetry verification.
Checkpoints: contract freeze, migration readiness, integration proof, review closure, go/no-go.
Retries: at most two automated fix/retest cycles for the same failure class before root-cause escalation.
Outputs: working slice, tests, decision record, release evidence, handoff.
Definition of Done: all acceptance criteria verified, no unresolved blockers, observability and recovery path present, approvals recorded.