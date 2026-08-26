# AI Change Management

## Purpose
Determine when changes to models, prompts, data, tools, providers, policies, or infrastructure require reassessment and reapproval.

## When to use
Use for continuous deployment, provider model updates, prompt/tool changes, fine-tuning, data refreshes, or architecture migrations.

## Inputs
Baseline approved configuration, proposed change, dependency map, evaluations, risk tier, provider change notices.

## Procedure
1. Define the approved configuration baseline.
2. Classify change types and materiality criteria.
3. Detect direct and transitive changes.
4. Assess effects on intended use, behavior, risk, data, security, and obligations.
5. Select required regression evaluations.
6. Determine approval level based on materiality.
7. Update documentation and inventory.
8. Define rollback criteria.
9. Deploy with monitoring appropriate to risk.
10. Review unexpected behavior as potential material change.

## Decision points
Minor changes can follow preapproved lanes only when bounded by tested criteria. Provider-side opaque changes should be treated according to observed impact and contractual guarantees, not vendor labels alone.

## Common failure patterns
Version drift, silent provider updates, prompt changes bypassing review, documentation lag, no rollback baseline.

## Verification
Every deployed version maps to an approved configuration and required regression evidence.

## Expected output
Materiality decision, evaluation scope, approvals, updated records, and rollback plan.

## Stop conditions
Stop when the exact changed artifact cannot be identified or rollback is unavailable for a high-risk release.