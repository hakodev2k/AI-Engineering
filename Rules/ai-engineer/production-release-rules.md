# Production Release Rules
## Purpose
Release AI changes with measured risk, compatibility, and rollback controls.
## Scope
Models, prompts, retrieval, tools, guardrails, evaluation logic, and AI runtime configuration.
## MUST
- Evaluate material behavior changes before production deployment using representative tests and defined acceptance criteria.
- Version deployable AI configuration sufficiently to identify what produced a production result.
- Define rollback or disablement paths for high-impact changes.
- Monitor quality, safety, latency, error, and cost signals during rollout.
## MUST NOT
- Deploy a breaking public behavior or high-risk safety change without required human approval.
- Treat a successful build as evidence that AI behavior is production-ready.
## SHOULD
- Use staged rollout, shadowing, canaries, feature flags, or traffic splitting when risk justifies them.
## Exceptions
Emergency releases require explicit scope, owner, risk acceptance, heightened monitoring, and follow-up validation.
## Verification
Review evaluation reports, deployment records, flags, rollback tests, dashboards, and approval evidence.