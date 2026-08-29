# Deployment and Change Approval Rules

## Purpose
Control security risk when AI models, prompts, policies, tools, data sources, or infrastructure change in production.

## Scope
Applies to production model promotion, prompt changes, policy changes, provider changes, tool permissions, RAG sources, security controls, and infrastructure configuration.

## MUST
- Security-relevant changes MUST be traceable to reviewed configuration, code, model, or artifact versions.
- Production deployment MUST require human approval when the change can materially affect security boundaries, privileged actions, sensitive data, or public behavior.
- Rollback or containment procedures MUST exist before high-risk deployment.
- Security evaluation results MUST correspond to the version actually deployed.
- Emergency changes MUST be documented and retrospectively reviewed.

## MUST NOT
- MUST NOT deploy an unreviewed change that weakens authentication, authorization, isolation, or security controls.
- MUST NOT substitute a different model, provider, or prompt after approval without evaluating material behavioral differences.
- MUST NOT force push or rewrite shared deployment history to conceal or simplify security changes.

## SHOULD
- Use staged rollout, canaries, feature flags, and automatic guardrail monitoring for risky changes.
- Prefer reversible changes when security evidence is incomplete.

## Exceptions
Emergency containment may bypass normal sequencing when needed to stop active harm; the action MUST remain auditable and receive retrospective approval.

## Verification
Review diffs, approvals, deployment metadata, evaluation-version linkage, rollback tests, feature-flag state, and post-deployment monitoring.