# Execution Model Rules

## Purpose
Ensure quantitative execution logic reflects market mechanics and controls trading risk.

## Scope
Applies to order generation, scheduling, routing assumptions, fill simulation, and transaction-cost models.

## MUST
- Execution logic MUST define order states, timing, price references, quantity semantics, cancellation behavior, and failure handling.
- Fill and cost models MUST be calibrated or validated against representative observed execution data where available.
- Liquidity, spread, volatility, latency, participation, and market-impact effects MUST be considered when material.
- Duplicate submission and retry paths MUST be idempotent or otherwise protected against unintended repeated orders.
- Pre-trade limits and kill-switch behavior MUST be independently testable.

## MUST NOT
- Research fills MUST NOT assume information or prices unavailable when the order could actually execute.
- Network or venue uncertainty MUST NOT default to assuming an order failed and is safe to resend.
- Execution controls MUST NOT be bypassed to improve simulated performance.

## SHOULD
- Separate alpha logic from execution policy and venue-specific adapters.
- Measure implementation shortfall and model error by regime.

## Exceptions
Exceptions affecting live trading require explicit trading-risk approval and documented rollback.

## Verification
Replay order-state scenarios, test idempotency, reconcile simulated versus realized costs, inject venue/network failures, and verify limit and kill-switch behavior.