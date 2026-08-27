# Risk Model Rules

## Purpose
Ensure risk estimates are interpretable, conservative where required, and robust to changing regimes.

## Scope
Applies to market, factor, volatility, correlation, scenario, exposure, and portfolio risk models.

## MUST
- Risk measures MUST state horizon, confidence assumptions, aggregation rules, data window, and intended decision use.
- Factor and covariance models MUST be checked for stability, conditioning, and economically plausible exposures.
- Tail behavior and stress scenarios MUST be evaluated separately from ordinary-distribution metrics when material.
- Risk aggregation MUST preserve currency, unit, and dependency semantics.
- Material changes to risk methodology MUST be independently validated before controlling production limits or capital decisions.

## MUST NOT
- Historical calm periods MUST NOT be assumed representative of stress regimes without evidence.
- Diversification benefits MUST NOT be counted where dependency assumptions are unsupported.
- Missing exposures MUST NOT silently appear as zero risk.

## SHOULD
- Compare multiple risk lenses rather than optimize to a single statistic.
- Track model drift and realized-versus-predicted risk.

## Exceptions
Exceptions require documented limitation, conservative compensating control, monitoring, and accountable approval.

## Verification
Review exposure reconciliations, covariance diagnostics, stress tests, backtesting, realized-risk comparisons, missing-data behavior, and independent benchmark calculations.