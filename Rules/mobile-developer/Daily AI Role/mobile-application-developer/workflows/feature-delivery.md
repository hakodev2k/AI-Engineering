# Workflow: Feature Delivery
Trigger: approved mobile feature or behavior change.
Goal: deliver a testable, observable mobile capability without regressing device, lifecycle, privacy, or offline behavior.
Inputs: product intent, designs, API/data contracts, device/OS matrix, release constraints.
Preconditions: acceptance criteria and dependency owners known.
Stages:
1. Frame states and mobile constraints.
2. Design data/lifecycle/permission/telemetry contracts.
3. Parallel review: Sync/Data, Security/Privacy, Performance/Reliability when relevant.
4. Implement smallest coherent slice behind a feature flag when risk warrants.
5. Test happy path plus permission denial, offline/network failure, process death, upgrade, accessibility and representative devices.
6. Review code and evidence; fix findings with at most 2 review-retry cycles before escalation.
7. Integrate release evidence and handoff.
Dependencies: API/schema changes precede dependent client behavior unless compatibility path exists.
Checkpoint: implementation cannot progress past contract-dependent work with unresolved breaking behavior.
Outputs: code/change set, tests, telemetry, release notes, risks, handoff.
Failure: blocked dependency -> preserve current state, record owner/next action, continue independent work.
DoD: checklist passes and no unresolved critical finding remains.