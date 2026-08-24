# Economic Invariants

## Purpose
Prevent economically valid-looking transactions from creating insolvency, extraction, or broken incentives.

## Scope
Collateral, fees, rewards, liquidation, exchange rates, incentives, caps, and protocol solvency.

## MUST
- Define solvency, conservation, collateralization, and incentive invariants relevant to the protocol.
- Analyze adversarial profit opportunities, not only functional correctness.
- Model boundary conditions, rapid price movement, low liquidity, and repeated atomic actions.
- Bound protocol exposure where assumptions can fail.
- Validate parameter changes against economic invariants before production execution.

## MUST NOT
- Assume rational actors behave cooperatively.
- Use unbounded subsidies, rewards, or leverage without abuse analysis.
- Treat a mathematically correct formula as economically safe without scenario testing.

## SHOULD
- Stress-test parameters against plausible and extreme market states.
- Prefer mechanisms whose failure modes are bounded and observable.

## Exceptions
Accepted tail risk requires quantified exposure, monitoring, mitigation, and explicit approval.

## Verification
Run simulations, invariant/fuzz tests, sensitivity analysis, historical/extreme scenarios, and independent review of economic assumptions.