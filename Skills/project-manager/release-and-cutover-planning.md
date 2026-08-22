# Release and Cutover Planning

## Purpose
Coordinate the transition from project delivery into production or operational use with controlled dependencies, rollback, validation, and ownership.

## When to use
Use for launches, migrations, deployments, data cutovers, organizational go-lives, and coordinated releases.

## Inputs
Release scope, deployment steps, data migration, dependencies, test evidence, support model, communications, rollback criteria, and approvals.

## Context to inspect
Inspect release windows, environment readiness, operational staffing, change freezes, backup/recovery, external integrations, user readiness, and regulatory gates.

## Core knowledge
Cutover is a time-sensitive dependency network. Readiness must cover technology, data, people, process, communications, monitoring, support, and recovery—not only deployment success.

## Procedure
1. Define go-live outcomes and objective success criteria.
2. Build a sequenced cutover plan with owners and timestamps where needed.
3. Identify prerequisites and no-go conditions.
4. Define validation checkpoints and decision authority.
5. Establish rollback or forward-fix criteria and feasibility.
6. Prepare communications and support escalation paths.
7. Rehearse high-risk migrations or complex runbooks.
8. Confirm backups, monitoring, access, and operational coverage.
9. Run readiness review using evidence.
10. Capture actual results and stabilize before declaring completion.

## Decision points
Choose phased rollout when blast radius can be reduced; big-bang only when coexistence is impossible or risk is demonstrably lower. Prefer reversible steps.

## Common failure patterns
No rollback owner, missing business validation, undocumented manual steps, assuming test environment timing matches production, and declaring success before stabilization.

## Verification
All prerequisites, approvals, validation checks, rollback conditions, and support responsibilities are evidenced and understood.

## Expected output
An executable cutover plan and go/no-go evidence set.

## Stop conditions
Call no-go when mandatory readiness criteria fail, rollback is infeasible for unacceptable risk, or required owners/access are absent.