# Orchestration Polling Rules

- A performance change MUST start from a measured baseline.
- The orchestrator MUST distinguish polling-only turns from turns containing meaningful state changes.
- An unchanged wait/status result MUST NOT trigger repeated model re-entry when the host can safely wait outside the model.
- User input, child completion, errors, approval requests, and meaningful new output MUST wake the model promptly.
- Polling suppression MUST NOT weaken correctness, security, approval, or verification requirements.
- The system MUST define a finite maximum consecutive no-progress poll budget.
- Fallback polling MUST use bounded backoff and MUST retain a finite liveness checkpoint.
- Polls targeting the same unchanged state SHOULD be coalesced.
- Completed/failed child lifecycle state MUST stop further polling for that child unless new work is explicitly assigned.
- Before/after reports MUST include model turns/task and tokens/task when telemetry provides tokens.
- An optimization MUST NOT be called verified if task success regresses or wakeup delay exceeds the configured budget.
- Remediation loops MUST stop after at most two failed hypotheses.
- Thresholds MUST be configured per workload rather than treated as universal constants.