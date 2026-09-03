# Production Policy Deployment

## Purpose
Deploy RL policies into production with explicit safety gates, observability, rollback, shadow evaluation, and controls for distribution shift and policy degradation.

## When to use
Use when moving a trained RL policy from experiment or simulator into a user-facing, financial, operational, robotic, or other production decision loop.

## Inputs
- Candidate policy artifact
- Evaluation and safety evidence
- Serving/runtime constraints
- Baseline production policy
- Monitoring and rollback capabilities

## Preconditions
Offline evaluation, constraint testing, model provenance, and artifact reproducibility must be complete. A fallback policy and accountable deployment owner must exist.

## Context to inspect
Inspect inference latency, observation schema, feature freshness, action validation, policy versioning, environment shift, fallback behavior, monitoring coverage, and whether actions can be reversed.

## Core knowledge
Production RL differs from static prediction because policy actions influence future data. Deployment changes the state distribution and can create feedback loops. Shadowing, canaries, conservative action envelopes, policy versioning, and explicit rollback criteria reduce risk. Reward is often unavailable or delayed in production, so leading operational metrics are required.

## Procedure
1. Freeze and version the exact policy, preprocessing, observation contract, and action transform.
2. Verify runtime outputs against the evaluation implementation on identical inputs.
3. Enforce action bounds and hard constraints outside the model.
4. Run shadow mode where technically meaningful and compare candidate decisions with the incumbent policy.
5. Define canary population, duration, risk budget, and rollback thresholds before activation.
6. Instrument policy version, observations, actions, latency, constraint checks, and outcome linkage.
7. Launch to the smallest defensible exposure.
8. Monitor leading safety/operational metrics plus delayed reward outcomes.
9. Compare state/action distributions against training and pre-launch evaluation data.
10. Expand only after predefined gates pass.
11. Preserve immediate fallback to the incumbent or safe policy.
12. Perform post-launch review and add newly observed scenarios to evaluation suites.

## Decision points
Use shadow mode when candidate decisions can be computed without affecting users. Use canary rollout when live feedback is necessary. Require manual approval for irreversible or high-impact action expansions. Prefer the incumbent policy when evidence is ambiguous.

## Common failure patterns
- Training and serving preprocessors differ.
- Rollback exists operationally but fallback policy is stale.
- Monitoring tracks reward only, which arrives too late.
- Policy version is missing from decision logs.
- Distribution shift is detected only after KPI degradation.

## Verification
Verify artifact parity, action constraints, fallback execution, monitoring alerts, canary gates, policy-version traceability, and distribution-shift dashboards. Production success requires sustained outcome evidence, not merely a successful deployment.

## Expected output
A controlled RL release with versioned artifacts, runtime parity checks, safety enforcement, staged rollout, observability, and tested rollback.

## Stop conditions
Stop rollout immediately when constraint violations exceed budget, input distribution leaves validated bounds, latency breaks operational limits, outcome metrics cross rollback thresholds, or fallback mechanisms fail.