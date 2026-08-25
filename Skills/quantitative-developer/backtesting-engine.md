# Backtesting Engine

## Purpose
Build and review backtests that simulate historical decisions with realistic information, portfolio state, and execution constraints.

## When to use
Use when implementing a strategy simulator or investigating suspicious historical performance.

## Inputs
Strategy rules, market data, universe history, portfolio constraints, fee model, execution assumptions, and benchmark.

## Preconditions
Historical data must expose point-in-time availability and delisted instruments where relevant.

## Context to inspect
Clock model, event ordering, order lifecycle, accounting, corporate actions, fills, costs, and reproducibility controls.

## Core knowledge
A valid backtest is a state machine, not a vectorized return multiplication when path dependence matters. Event ordering, capital constraints, fills, latency, and data availability determine validity.

## Procedure
1. Specify decision and execution timestamps.
2. Define portfolio, cash, positions, orders, and valuation state.
3. Prevent reads of unavailable future data.
4. Model order acceptance, partial fills, rejection, cancellation, and expiry.
5. Apply fees, spread, slippage, borrow, funding, and corporate actions as applicable.
6. Enforce leverage, liquidity, and position limits.
7. Produce deterministic event logs.
8. Test edge cases such as gaps, halts, splits, and missing bars.
9. Compare a simple strategy against an independently calculated reference.
10. Version inputs, code, and configuration.

## Decision points
Use event-driven simulation for path-dependent execution; vectorized methods are acceptable only when assumptions make state transitions irrelevant and are documented.

## Common failure patterns
Look-ahead, same-bar impossible fills, survivorship bias, infinite liquidity, incorrect P&L accounting, omitted costs, and nondeterministic ordering.

## Verification
Golden tests must reconcile cash, positions, fills, and P&L. Run invariant checks and replay identical inputs to identical outputs.

## Expected output
A deterministic simulator with explicit assumptions and auditable event-level evidence.

## Stop conditions
Stop if historical availability, corporate actions, or execution semantics cannot be reconstructed sufficiently for the intended claim.