# Executive AI Cost Reporting

## Purpose
Translate complex AI infrastructure and model-service economics into concise, decision-ready reporting for engineering, product, finance, and executive leadership. The report should distinguish healthy growth from inefficiency and identify the decisions required from leaders.

## When to use
Use for monthly or quarterly AI cost reviews, budget variance discussions, capacity and commitment decisions, investment reviews, major training programs, or material cost incidents.

## Inputs
- Reconciled actual spend
- Budget and forecast
- Unit-economics metrics
- Usage and growth metrics
- Model quality and service SLOs
- Capacity and commitment exposure
- Verified optimization savings
- Major launches, migrations, and training events
- Known cost and supply risks

## Preconditions
Financial totals must be reconciled to authoritative billing sources within the agreed tolerance. Clearly label estimates, forecasts, and provisional invoices.

## Context to inspect
Inspect provider and model mix, GPU fleet utilization, managed API usage, training events, traffic growth, storage and network changes, commitments, experimental spend, architecture changes, incidents, and prior executive actions.

## Core knowledge
Leadership needs to know what changed, why it changed, whether the system is becoming more or less economically efficient, what risks are emerging, and what decisions are required. Raw spend without usage or business context is misleading. Realized savings must be separated from forecast or theoretical savings, and uncertainty should be visible rather than hidden.

## Procedure
1. Reconcile current-period spend to authoritative financial data.
2. Compare actual spend with budget, prior forecast, and previous period.
3. Decompose material variance by usage growth, pricing, model mix, infrastructure, training events, and waste.
4. Normalize major spend categories using relevant unit-economics metrics.
5. Distinguish healthy product or research growth from avoidable inefficiency.
6. Report quality, latency, and reliability alongside major cost-efficiency changes.
7. Summarize GPU or capacity utilization and material idle exposure.
8. Report commitment coverage, utilization, expiration risk, and stranded obligations.
9. List optimization actions and count only verified savings as realized.
10. Update the rolling forecast and explain changes in assumptions.
11. Surface major supply, vendor, budget, reliability, or concentration risks.
12. State explicit decisions or approvals required from leadership.
13. Track prior actions to closure in the next reporting cycle.
14. Keep the executive layer concise and provide drill-down data separately.

## Decision points
- Escalate a variance when its financial impact, persistence, or uncertainty is material, not merely because the absolute spend is large.
- Do not characterize revenue- or usage-backed growth as waste solely because total spend increased.
- Present scenario ranges rather than false precision when model roadmap, demand, or provider pricing is uncertain.
- Separate technical optimization opportunities from contractual or organizational decisions requiring executive authority.

## Common failure patterns
- Large tables without a decision-oriented narrative.
- Reporting spend without traffic, quality, or business context.
- Counting forecast savings as realized savings.
- Hiding idle or stranded commitments inside blended rates.
- Inconsistent definitions between finance and engineering dashboards.
- Reporting problems without owners, actions, or decision requests.

## Verification
Confirm every reported financial total traces to reconciled source data. Recompute sampled unit metrics and variance explanations. Ensure realized savings have billing or controlled-measurement evidence. Verify prior-period actions and forecasts are carried forward consistently.

## Expected output
A concise executive AI cost report containing actual versus budget and forecast, key cost drivers, quality-adjusted unit economics, capacity and commitment exposure, verified savings, updated forecast, major risks, owners, actions, and explicit decision requests.

## Stop conditions
Stop and escalate before publication if financial reconciliation is materially incomplete, major figures are disputed, savings evidence is unverified, or reporting would expose restricted contractual or organizational information to an unauthorized audience.