# Deployment and Upgrade
## Purpose
Change running pipelines without uncontrolled correctness or availability risk.
## Scope
Code releases, runtime upgrades, configuration changes, and state migrations.
## MUST
- Releases MUST define compatibility with active producers, consumers, schemas, and persisted state.
- Stateful upgrades MUST have a tested rollback or forward-recovery strategy.
- Production deployment and irreversible state migration MUST require authorized human approval.
- Rollout MUST include health and correctness verification criteria.
## MUST NOT
- Runtime or dependency upgrades MUST NOT be combined with unrelated semantic changes when doing so prevents fault isolation.
## SHOULD
- Canary, shadow, or staged rollout SHOULD be used for high-impact pipelines.
## Exceptions
Emergency rollout requires documented risk, approval, and immediate validation.
## Verification
Inspect deployment diff, compatibility tests, restore evidence, staged metrics, and output reconciliation.