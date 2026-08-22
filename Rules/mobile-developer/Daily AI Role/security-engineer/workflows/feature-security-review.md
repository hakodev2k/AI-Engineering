# Workflow: Feature Security Review

## Trigger
New feature or material change affecting trust, identity, sensitive data, external input, or privileged operations.

## Goal
Produce a release-ready security disposition with evidence and owned residual risk.

## Inputs
Security review request, design, code scope, data classification, release deadline.

## Stages
1. Intake and validate request — Security Engineer.
2. Threat model baseline — Security Engineer.
3. Parallel review — Threat Researcher, Code Security Reviewer, Cloud/Identity Reviewer as applicable.
4. Synchronize findings into one risk register — Security Engineer.
5. Remediation planning — engineering owner + Security Engineer.
6. Independent verification of critical/high issues — Security Verifier.
7. Release disposition — pass, pass-with-conditions, block, or human risk acceptance.

## Dependencies
Parallel review starts only after scope/assets/trust boundaries are stable.

## Checkpoints
After threat model, after finding consolidation, after remediation, before release.

## Retry
Maximum two remediation-review cycles.

## Escalation
Unresolved critical/high issue, missing owner, or policy exception goes to authorized human owner.

## Definition of done
No unowned critical/high risk; evidence and residual risks are recorded; approval boundaries satisfied.