# Forecasting Rules

## Purpose
Produce transparent, evidence-based forecasts that support engineering and financial decisions.

## Scope
Monthly, quarterly, annual, project, product, and service cost forecasts.

## MUST
- State forecast horizon, granularity, assumptions, source data, known events, and confidence or uncertainty.
- Separate baseline consumption, planned growth, pricing changes, commitments, migrations, and exceptional events.
- Compare forecasts to actuals and investigate material forecast error.
- Update forecasts when evidence materially invalidates prior assumptions.

## MUST NOT
- Present a point estimate as certain when material uncertainty exists.
- Back-fit assumptions solely to make forecasts match a target.
- Mix gross list-price projections with net invoiced-cost actuals without normalization.

## SHOULD
- Use scenario ranges for volatile workloads and major transformation programs.
- Track forecast accuracy by meaningful cost domain and improve weak models.

## Exceptions
Sparse-history forecasts may use documented proxies or expert estimates when uncertainty is explicitly disclosed.

## Verification
Recalculate representative forecasts from source data; review assumption logs, variance analysis, forecast accuracy, and known-event treatment.