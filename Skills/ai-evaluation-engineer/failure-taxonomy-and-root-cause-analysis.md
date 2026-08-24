# Failure Taxonomy and Root-Cause Analysis

## Purpose
Turn raw evaluation failures into stable, actionable categories that reveal systemic causes instead of producing an unprioritized list of bad examples.

## When to use
Use after benchmark runs, production incidents, human review, red-team exercises, or when teams need to prioritize fixes across prompts, models, retrieval, tools, or data.

## Inputs
- Failed examples and traces
- System architecture
- Evaluation labels
- Production incidents
- Candidate mitigations

## Context to inspect
Inspect prompt layers, retrieval results, tool calls, model outputs, parsers, policies, latency/cost telemetry, and previous failure categories.

## Core knowledge
A useful taxonomy separates symptom from cause. Categories should be mutually useful rather than artificially exclusive, stable across versions, and connected to responsible system components. Severity, frequency, detectability, and user impact all affect prioritization.

## Procedure
1. Sample failures across metrics and important slices.
2. Describe observable symptoms without prematurely assigning cause.
3. Cluster recurring patterns and create provisional categories.
4. Trace representative failures through the full system pipeline.
5. Distinguish data, retrieval, prompt, model, tool, integration, policy, and evaluator defects.
6. Assign severity and estimated production impact.
7. Test suspected causes with controlled counterfactual changes where possible.
8. Update category definitions with positive and negative examples.
9. Quantify category prevalence across baseline and candidate versions.
10. Route each confirmed category to an owner and measurable mitigation test.

## Decision points
Split categories when causes or mitigations differ materially; merge categories when they share the same mechanism and remedy. Preserve symptom tags even when root cause is unknown.

## Common failure patterns
- Calling every defect a hallucination
- Assigning root cause from final output alone
- Taxonomies that change every run
- Ignoring evaluator errors
- Prioritizing frequent trivial issues over rare severe failures

## Verification
Verify multiple reviewers can apply the taxonomy consistently, root-cause claims survive controlled tests, and mitigation changes reduce the intended category.

## Expected output
A versioned failure taxonomy with definitions, severity, examples, prevalence, root-cause evidence, and ownership.

## Stop conditions
Stop when available traces cannot distinguish plausible causes, evidence contradicts the proposed cause, or remediation requires access outside the evaluator’s authority.