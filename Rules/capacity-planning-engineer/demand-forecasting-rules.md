# Demand Forecasting Rules
## Purpose
Make capacity forecasts evidence-based and decision-ready.
## Scope
Workload, traffic, storage, compute, network, and dependency demand forecasts.
## MUST
- Forecasts MUST state horizon, unit, source data, seasonality assumptions, and uncertainty.
- Critical services MUST use multiple demand scenarios, including expected and credible peak demand.
- Forecast error MUST be measured against realized demand and used to recalibrate future forecasts.
## MUST NOT
- MUST NOT extrapolate a short stable window as long-term growth without checking structural changes.
- MUST NOT present a point estimate as guaranteed capacity demand.
## SHOULD
- Forecasts SHOULD separate organic growth, launches, migrations, and one-off events.
## Exceptions
Exceptions require documented evidence, risk, and reviewer approval.
## Verification
Review source queries, forecast backtests, error metrics, scenario assumptions, and decision records.