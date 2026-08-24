# Peak and Seasonality Rules
## Purpose
Prevent predictable peaks from becoming incidents.
## Scope
Daily, weekly, seasonal, campaign, launch, billing, and event-driven peaks.
## MUST
- Known peak periods MUST be modeled separately from baseline demand.
- Peak plans MUST include expected magnitude, duration, confidence range, and pre-peak readiness date.
- Historical peak shapes MUST be checked for changing timing or composition.
## MUST NOT
- MUST NOT size from daily averages when short peaks drive saturation.
- MUST NOT reuse last year's multiplier without validating current architecture and demand mix.
## SHOULD
- Peak readiness SHOULD include controlled load validation when production risk justifies it.
## Exceptions
Missing historical data requires conservative assumptions and explicit uncertainty.
## Verification
Compare forecast peak curves with telemetry and readiness evidence.