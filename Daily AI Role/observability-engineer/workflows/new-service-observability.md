# Workflow: New Service Observability
Trigger: service or major user journey enters production.
Goal: create minimum trustworthy operational visibility before release.
Inputs: architecture, SLOs, dependencies, release plan and owners.
Stages: 1) inventory requirements and critical journeys; 2) design telemetry contract; 3) parallel privacy/cardinality/cost reviews; 4) implement instrumentation; 5) validate success/failure/no-data and correlation; 6) build dashboard and required alerts; 7) canary rollout; 8) handoff.
Parallelism: reviewers run concurrently after contract draft. Implementation and dashboard prototyping may overlap only against stable contract fields.
Checkpoint: no production rollout without owner, evidence and unresolved high-risk findings closed or approved.
Retries: maximum two correction cycles per failed gate.
Definition of Done: checklist satisfied and owner can answer agreed operational questions.
