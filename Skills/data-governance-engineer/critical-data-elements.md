# Critical Data Elements

## Purpose
Identify and govern the subset of data whose failure would create material business, regulatory, financial, operational, or customer impact.

## When to use
Use to prioritize governance effort, quality controls, lineage, stewardship, or regulatory evidence.

## Inputs
Business processes, reports, models, regulations, risk assessments, incidents, contracts, data inventory.

## Context to inspect
Inspect decision-critical outputs, regulatory submissions, customer journeys, financial controls, model features, and dependencies.

## Core knowledge
Criticality is contextual and should be justified by impact, not popularity. A critical element needs definition, owner, authoritative source, quality expectations, lineage, and control evidence.

## Procedure
1. Define materiality criteria and scoring.
2. Identify critical business processes and outputs.
3. Trace required data elements backward.
4. Score impact of incorrect, missing, late, or exposed data.
5. Remove duplicates and overly broad candidates.
6. Obtain accountable-owner validation.
7. Record definition, source, lineage, classification, and controls.
8. Apply enhanced quality/change/monitoring requirements.
9. Review after incidents and material process changes.

## Decision points
Designate criticality only where enhanced controls are justified. Use tiers when impact differs materially. Avoid declaring whole tables critical when only specific elements drive risk.

## Common failure patterns
Everything becomes critical, no documented rationale, static lists, missing lineage, and criticality disconnected from controls.

## Verification
Sample critical elements and confirm each has defensible impact rationale, ownership, source, quality thresholds, lineage, and operational controls.

## Expected output
A prioritized critical-data register with rationale, ownership, dependencies, and required controls.

## Stop conditions
Escalate unresolved materiality decisions or missing authoritative sources for data used in regulated or high-impact processes.