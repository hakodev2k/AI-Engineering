# Model Capability Surfacing

## Purpose
Present model capabilities, constraints, and trade-offs so developers can choose an appropriate model without relying on folklore or fragile assumptions.

## When to use
Use when a platform exposes multiple models, modalities, reasoning modes, context sizes, tool capabilities, latency tiers, or deployment variants.

## Inputs
Model catalog, evaluation results, pricing, latency profiles, context limits, modality support, tool/function support, regional availability, safety constraints, and deprecation status.

## Context to inspect
Inspect model-selection documentation, SDK enums, console UI, benchmark claims, support questions, compatibility tables, release notes, and production telemetry showing model-switch behavior.

## Core knowledge
Model selection is multi-objective: quality, latency, cost, determinism, context, modality, availability, and safety can conflict. Capability descriptions should be task-oriented and evidence-backed, not marketing adjectives. Model identifiers and snapshots require explicit lifecycle semantics.

## Procedure
1. Inventory models and stable capability dimensions.
2. Separate contractual limits from observed performance characteristics.
3. Define canonical names, aliases, snapshots, and lifecycle state.
4. Build task-oriented selection guidance using representative evaluations.
5. Surface context, input/output, modality, tool, and structured-output limits.
6. Include latency and cost considerations with measurement caveats.
7. Explain behavior that may vary by version or region.
8. Provide migration guidance for deprecated models.
9. Ensure SDKs and documentation use the same identifiers.
10. Revalidate guidance after model updates.

## Decision points
Recommend a default only when it is genuinely suitable for the majority target workflow. Prefer decision tables over universal rankings when trade-offs differ by task.

## Common failure patterns
Calling one model 'best', mixing benchmark and production claims, hiding snapshot changes, stale capability tables, omitting regional constraints, and treating context-window size as usable application capacity without overhead.

## Verification
Cross-check public surfaces against live API metadata and controlled tests, validate sample calls for each claimed capability, and confirm lifecycle states and migration links.

## Expected output
A maintained capability matrix, task-based selection guidance, lifecycle semantics, and verified examples.

## Stop conditions
Stop when model behavior is not sufficiently characterized, contractual limits conflict across sources, or lifecycle ownership is unresolved.