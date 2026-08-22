# Workflow: New Azure Workload Onboarding

**Trigger:** team needs a new Azure-hosted workload.
**Goal:** provision a governed, operable workload environment.
**Stages:**
1. Intake: owner, business purpose, environments, data, traffic, RTO/RPO, budget, timeline.
2. Parallel discovery: identity/network, cost/quota, reliability, security/governance.
3. Architecture synthesis and decision record.
4. Subscription/resource group/naming/tagging/policy alignment.
5. IaC implementation and plan/what-if review.
6. Human approvals for privileged/public/exception/material-cost actions.
7. Staged deployment.
8. Validation: connectivity, identity, health, logs, alerts, backup where relevant.
9. Handoff: owner, runbook, dashboards, cost ownership, escalation path.
**Checkpoints:** after architecture, before apply, after deployment.
**Retry:** bounded transient retry only.
**Definition of Done:** expected workload behavior plus platform controls verified.
