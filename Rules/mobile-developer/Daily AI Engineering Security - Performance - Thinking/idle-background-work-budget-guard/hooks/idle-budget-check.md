# Hook: Idle Budget Check

## Trigger
After startup settles, after entering idle/hidden state, and in performance regression tests.

## Preconditions
No foreground agent task is active. A telemetry CSV using the documented schema exists.

## Action
Analyze the idle sample against configured CPU-core-time, RSS-growth, and I/O budgets.

## Command
`python3 scripts/idle_budget_analyzer.py samples.csv --max-core-seconds-per-minute 12 --max-rss-growth-mb-per-minute 50`

Thresholds are examples and MUST be replaced by product-specific SLOs.

## Expected result
Exit 0 with no budget breaches.

## Failure behavior
Exit 2 indicates invalid telemetry/configuration and blocks performance verification. Exit 3 indicates a measured budget breach and invokes `workflows/measure-bound-verify.md`.

## Blocking
Yes for performance-release verification; runtime policy may defer/cancel the identified optional job rather than blocking the entire application.