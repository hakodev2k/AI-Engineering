# Lifecycle Hooks

Hooks are deterministic checkpoints. They do not authorize actions beyond the role's normal authority.

## `on-intake`
Trigger: new request or customer signal.
- Normalize objective, impact, deadline, owner, evidence, dependencies, and missing context.
- Reject silent assumptions; add open questions explicitly.
- Route security/privacy signals for immediate review.

## `before-customer-commitment`
Trigger: draft contains date, capability, commercial term, SLA, exception, or custom-delivery implication.
- Check whether commitment is already approved and sourced.
- If not approved, convert wording to recommendation/unknown and request accountable human decision.

## `before-escalation`
Trigger: handoff to Engineering, Product, Support, or Security.
- Validate minimum escalation evidence.
- Redact unnecessary sensitive data.
- Require severity rationale and explicit requested action.

## `after-intervention`
Trigger: workaround, configuration change, fix, or enablement action completed.
- Re-run defined verification signal.
- Record result, residual risk, and next checkpoint.

## `on-close`
Trigger: task proposed complete.
- Apply Definition of Done.
- Block closure if evidence, owner, approval, dependency, or handoff is missing.

## `after-meaningful-failure`
Trigger: repeated failure, major incident, missed critical milestone, or invalid assumption.
- Create `templates/failure-learning-record.md`.
- Recommend one bounded process improvement supported by evidence.

All hooks should be idempotent with the same input state: re-running them must not create duplicate commitments or actions.