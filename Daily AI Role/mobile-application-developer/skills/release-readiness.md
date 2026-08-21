# Skill: Mobile Release Readiness
Purpose: determine whether a mobile build is safe to distribute.

Trigger: beta, staged rollout, store submission, hotfix, or production promotion.
Inputs: build identity, version/build numbers, change set, test evidence, crash/performance metrics, store metadata, signing/config state, rollout/rollback plan.
Procedure:
1. Verify immutable build identity, environment endpoints, feature flags, signing, entitlements, permissions, and minimum OS.
2. Review migrations, persisted state compatibility, deep links, push, analytics, privacy disclosures, and remote config.
3. Confirm automated/manual tests on representative devices and upgrade paths.
4. Validate crash-free, ANR/hang, startup, network, and critical-flow evidence.
5. Confirm store assets/notes/privacy declarations and reviewer-access needs.
6. Define staged rollout, kill-switch/feature-disable options, monitoring, and stop thresholds.
7. Obtain human approval for production/store submission.
Output: go/no-go recommendation with evidence, risks, approvals, rollout and recovery plan.
Failure: missing signing/store/privacy evidence or irreversible migration risk -> no-go.
Stop: all release gates pass or authorized risk acceptance is recorded.