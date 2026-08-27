# Production Execution Rules
## Purpose
Control operational risk when simulations consume shared infrastructure or influence production decisions.
## Scope
Scheduled campaigns, production-connected simulations, large compute jobs, and automated decision pipelines.
## MUST
- Define resource limits, timeout/cancellation behavior, checkpoint strategy, and failure handling.
- Validate configuration and dependencies before high-cost or decision-critical execution.
- Require human approval before production configuration changes, destructive actions, or irreversible downstream execution.
## MUST NOT
- allow runaway jobs to consume unbounded shared resources.
- automatically convert uncertain simulation output into irreversible production action without authorized policy.
## SHOULD
- Use staged execution and canary workloads for material changes.
## Exceptions
Pre-authorized automation must have explicit bounded authority and rollback/stop controls.
## Verification
Runbooks, quotas, approval records, cancellation tests, resource telemetry, and post-run checks.