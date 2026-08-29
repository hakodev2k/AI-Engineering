# Incident Reconstruction and Root-Cause Analysis

## Purpose
Synthesize forensic evidence into a defensible account of initial access, execution, persistence, privilege, movement, impact, and root cause.

## When to use
Use after sufficient evidence has been collected to move from artifact-level findings to incident-level conclusions.

## Inputs
Timelines, host findings, identity logs, network evidence, cloud evidence, malware analysis, containment records, and business context.

## Context to inspect
Competing hypotheses, evidence gaps, control changes, prior incidents, asset ownership, and actions taken during response that may alter evidence.

## Core knowledge
Root cause is the underlying condition that enabled the incident, not merely the first suspicious event. Senior analysis distinguishes observed facts, high-confidence inference, plausible hypotheses, and unknowns.

## Procedure
1. Define the incident questions and required confidence.
2. Assemble pivotal facts by phase and source.
3. Identify the earliest evidenced malicious or unauthorized action.
4. Trace prerequisite identity, configuration, vulnerability, or process conditions.
5. Map subsequent execution, persistence, privilege, lateral movement, collection, and impact.
6. Test alternative explanations against the evidence.
7. Identify control failures and contributing factors separately from attacker actions.
8. State root cause, scope, confidence, and unresolved questions.
9. Derive corrective actions tied to demonstrated failure modes.

## Decision points
Use multiple root causes only when evidence supports independent enabling conditions. Avoid assigning human intent without evidence.

## Common failure patterns
Calling the first alert the root cause, confusing correlation with causation, ignoring response-induced changes, and omitting contradictory evidence.

## Verification
Every major conclusion must trace to cited evidence; an independent reviewer should be able to reproduce the reasoning from documented artifacts.

## Expected output
Incident narrative, root cause, contributing factors, scope, confidence, and evidence-backed remediation themes.

## Stop conditions
Stop when evidence cannot support the requested attribution or when unresolved contradictions materially change the conclusion.