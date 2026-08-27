# Pricing Model Rules

## Purpose
Keep valuation outputs economically coherent, independently testable, and safe for downstream use.

## Scope
Applies to analytical, numerical, simulation-based, and proxy pricing models.

## MUST
- Pricing models MUST define inputs, calibration method, market conventions, assumptions, and supported instrument domain.
- No-arbitrage identities and known limiting cases MUST be tested where applicable.
- Calibration failure, stale market data, or unsupported instruments MUST produce explicit diagnostics.
- Material pricing changes MUST be compared against independent benchmarks and representative portfolios.
- Sensitivities used for hedging or risk MUST be validated independently from headline price accuracy.

## MUST NOT
- A fallback price MUST NOT silently replace a failed primary valuation.
- Extrapolation beyond validated parameter or market ranges MUST NOT be treated as ordinary output.
- Calibration quality MUST NOT be judged solely by aggregate error that can hide critical local misfit.

## SHOULD
- Maintain golden test cases spanning normal and stressed regimes.
- Prefer transparent approximations when their bounded error is operationally superior to fragile complexity.

## Exceptions
Exceptions require quantified impact, consumer disclosure, monitoring, expiry criteria, and model-owner approval.

## Verification
Use benchmark instruments, limiting-case tests, calibration diagnostics, sensitivity checks, cross-model comparisons, production reconciliation, and review of fallback behavior.