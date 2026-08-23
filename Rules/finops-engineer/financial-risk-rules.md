# Financial Risk Rules

## Purpose
Identify and govern technology decisions that can create material or irreversible financial exposure.

## Scope
Commitments, uncontrolled scaling, pricing changes, migrations, vendor dependencies, quotas, credits, currencies, and contractual exposure.

## MUST
- Quantify plausible financial exposure for high-risk decisions and identify accountable decision owners.
- Define guardrails for resources or services capable of rapid unbounded spend.
- Escalate material exposure, uncertainty, or contractual risk before execution.
- Distinguish reversible recommendations from actions that create commitments or production impact.

## MUST NOT
- Execute long-term commitments, destructive cost actions, or high-risk production changes without authorized human approval.
- Rely on credits to justify structurally uneconomic architecture without an exit analysis.
- Conceal downside scenarios behind expected-value estimates.

## SHOULD
- Use sensitivity analysis for uncertain demand, exchange rates, pricing, and migration timing.

## Exceptions
Emergency actions may proceed under pre-authorized incident policy with bounded scope and retrospective review.

## Verification
Inspect risk assessments, guardrail configuration, scenario models, approvals, contractual terms, and actual exposure after decisions.