# Workflow: Store Release
Trigger: production candidate ready for App Store/Play or managed distribution.
Goal: distribute a traceable build with safe rollout and observation.
Inputs: immutable build/version, changes, test evidence, signing/config, store metadata, privacy declarations, telemetry, rollout plan.
Preconditions: release candidate is frozen; approvals identified.
Stages:
1. Verify build identity, endpoints, flags, entitlements, signing, permissions and persisted-data compatibility.
2. Release Evidence Reviewer checks completeness independently.
3. Validate upgrade from supported prior versions and fresh install.
4. Confirm accessibility/device matrix for changed critical paths.
5. Verify store descriptions, screenshots where required, privacy/data-safety declarations, reviewer credentials/instructions.
6. Define staged rollout %, observation window, crash/hang/business thresholds, kill switch/remote disable and escalation owner.
7. Obtain human release/store approval.
8. Submit/promote; observe metrics and user reports.
9. Stop rollout or mitigate when threshold breached.
Retries: store rejection remediation is bounded to 2 unchanged-strategy attempts, then root-cause review.
Outputs: release record, approval, submission evidence, observation report.
DoD: rollout completed or intentionally stopped with disposition and follow-up.