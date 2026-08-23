# Budget Governance Rules

## Purpose
Turn budgets into accountable decision controls rather than passive reporting thresholds.

## Scope
Cloud budgets, product budgets, cost-center limits, project envelopes, and exception governance.

## MUST
- Define budget owner, period, scope, currency, baseline, forecast relationship, and escalation thresholds.
- Alert owners early enough to take corrective action before material overspend occurs.
- Distinguish approved growth, forecast variance, one-time events, and uncontrolled overspend.
- Record decisions for material budget exceptions and their financial impact.

## MUST NOT
- Automatically shut down production workloads solely because a budget threshold was crossed unless explicitly approved as a safety policy.
- Reset or move budget boundaries to conceal variance.
- Present budget compliance without disclosing excluded spend.

## SHOULD
- Use progressive thresholds and route alerts to people able to act.
- Review budgets when architecture, demand, pricing, or commitments materially change.

## Exceptions
Emergency spending may exceed budget when required for safety, security, availability, or contractual obligations, with retrospective approval and evidence.

## Verification
Compare budget definitions, alert delivery, actuals, forecasts, exception records, and owner acknowledgements.