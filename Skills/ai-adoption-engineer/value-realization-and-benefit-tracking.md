# Value Realization and Benefit Tracking

## Purpose
Prove whether an AI-enabled workflow creates measurable business value after accounting for review effort, rework, operating cost, and downstream effects.

## When to use
Use during pilots, business reviews, and scale decisions when stakeholders need evidence beyond usage or model quality.

## Inputs
Business case, baseline metrics, adoption telemetry, task outcomes, labor assumptions, AI/infrastructure costs, review effort, error rates, and downstream KPIs.

## Context to inspect
Inspect how the original benefit estimate was calculated, which costs were excluded, whether work shifted to other roles, and whether quality or service outcomes changed.

## Core knowledge
Value realization requires a counterfactual baseline and total-cost view. Time saved is not realized value if capacity is not redeployed, error costs rise, or hidden review work absorbs the gain. Benefits may be financial, throughput, quality, risk reduction, or user experience.

## Procedure
1. Restate the expected benefit and decision horizon.
2. Validate the pre-AI baseline using the same metric definitions.
3. Measure actual task volume and eligible adoption.
4. Quantify time, throughput, quality, and error changes.
5. Include model, infrastructure, integration, support, and review costs.
6. Identify displaced work and downstream effects.
7. Separate gross benefit from realized benefit.
8. Segment results by task and user group.
9. Test whether gains persist beyond novelty or training periods.
10. Update the business case and recommend scale, redesign, or stop.

## Decision points
Use monetary ROI when benefits and costs can be credibly monetized; otherwise use explicit operational outcome measures. Do not force uncertain benefits into false precision.

## Common failure patterns
Using vendor estimates, counting all saved minutes as cash savings, excluding support and review, ignoring quality degradation, and comparing against an outdated baseline.

## Verification
Calculations must be reproducible from source metrics, assumptions must be explicit, and material benefit claims must survive sensitivity analysis.

## Expected output
A value-realization report with baseline, realized benefits, total costs, assumptions, sensitivity ranges, and recommendation.

## Stop conditions
Stop when baseline evidence is unreliable or attribution is too weak to support the requested financial claim.