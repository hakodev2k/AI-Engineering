# Automation Opportunity Assessment

## Purpose
Evaluate whether a process should be automated and determine the appropriate automation depth. This prevents expensive automation of unstable, low-value, or high-risk work.

## When to use
Use before committing engineering effort, when prioritizing an automation backlog, or when deciding whether AI should participate in a workflow.

## Inputs
Process map, transaction volume, labor effort, error rates, SLA impact, business value, exception rate, system capabilities, risk classification, and estimated implementation/operating cost.

## Context to inspect
Inspect representative cases, manual effort distribution, process variability, system APIs, data quality, policy constraints, maintenance burden, and current failure costs.

## Core knowledge
Good automation candidates combine meaningful value, sufficient repeatability, stable interfaces, measurable outcomes, and manageable exception handling. High volume alone does not justify automation if inputs are unreliable or consequences are severe.

## Procedure
1. Define the measurable outcome automation is expected to improve.
2. Quantify current effort, latency, failure rate, and downstream cost.
3. Estimate process variability and exception frequency.
4. Identify deterministic steps, judgment steps, and irreversible actions.
5. Evaluate interface quality: API, event, database, UI-only, or manual dependency.
6. Assess data availability, quality, sensitivity, and permissions.
7. Estimate build cost, ongoing maintenance, vendor cost, and operational ownership.
8. Model expected benefit under realistic adoption and exception rates.
9. Assess failure severity and required control strength.
10. Compare full automation, assisted automation, and process redesign.
11. Prioritize opportunities using value, feasibility, and risk rather than enthusiasm.

## Decision points
Prefer assisted automation when human judgment remains material. Prefer deterministic automation for stable rules. Use AI only where probabilistic interpretation adds value and can be bounded by validation or review.

## Common failure patterns
Ignoring maintenance cost, assuming every manual step is waste, overlooking licensing and API limits, underestimating exceptions, and using AI where deterministic logic is simpler and safer.

## Verification
Confirm assumptions with real process samples and system owners. Recalculate expected value using conservative volumes and failure rates.

## Expected output
A documented recommendation: automate, assist, redesign, defer, or reject, with rationale, risks, expected value, and required controls.

## Stop conditions
Stop when critical cost, volume, risk, or system-access assumptions cannot be validated or when the expected value depends on unrealistic exception rates.