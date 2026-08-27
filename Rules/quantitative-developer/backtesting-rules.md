# Backtesting Rules

## Purpose
Ensure historical simulations provide defensible evidence rather than optimistic artifacts.

## Scope
Applies to strategy, signal, execution, allocation, pricing, and risk backtests.

## MUST
- Backtests MUST use point-in-time data and decision-time information availability.
- Transaction costs, fees, spread, slippage, latency, liquidity constraints, and market impact MUST be modeled when material.
- Universe construction MUST avoid survivorship bias and retrospective membership.
- In-sample, validation, and out-of-sample periods MUST be separated before final evaluation.
- Results MUST include uncertainty, drawdowns, turnover, capacity-relevant metrics, and failure periods appropriate to the strategy.
- Changes made after observing test results MUST be tracked as additional model selection.

## MUST NOT
- A favorable Sharpe ratio or headline return MUST NOT alone justify deployment.
- Failed experiments MUST NOT be discarded from the research record when their omission would hide selection bias.
- Backtests MUST NOT assume fills that violate available volume, price formation, or order timing.

## SHOULD
- Use walk-forward or rolling evaluation when regime dependence matters.
- Compare against simple, investable baselines.

## Exceptions
Simplified simulations are allowed for exploratory work only when clearly labeled non-production evidence and their omitted effects are documented.

## Verification
Inspect point-in-time lineage, execution assumptions, experiment history, benchmark comparisons, out-of-sample results, sensitivity analysis, and independently reproduce representative trades and P&L.