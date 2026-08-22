# Workflow: Production Hotfix
Trigger: production crash, security/privacy regression, data-loss risk, broken login/payment/core journey, or severe store-distributed defect.
Goal: restore safe behavior quickly with controlled scope and evidence.
Inputs: incident evidence, affected versions/platforms, reproduction, rollback/remote-disable options.
Stages:
1. Triage severity, blast radius, affected versions, user workaround and data/security risk.
2. Prefer remote disable/config rollback when safe and authorized.
3. Isolate smallest fix; freeze unrelated refactoring.
4. Parallel reviewers inspect security/data/reliability impact as applicable.
5. Reproduce-before and verify-after on representative affected environment.
6. Run focused regression plus startup/auth/update/offline checks.
7. Human approval for store submission/production configuration.
8. Stage rollout where possible; monitor stop thresholds.
9. Record Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.
Retries: at most 2 failed fix/retest attempts before reassessing root cause and escalation.
Outputs: hotfix build/change, evidence, known limits, rollout/stop plan, incident learning record.
DoD: severe symptom resolved, no new critical regression, monitoring active, follow-up owned.