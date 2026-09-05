# Safety and Compliance Aware Routing

## Purpose
Ensure routing decisions enforce safety, compliance, and governance constraints before optimizing quality, latency, or cost.

## When to use
Use when workloads have different safety risk, regulated content, jurisdictional constraints, model approvals, or policy requirements.

## Inputs
Safety classifications, approved-model lists, compliance rules, workload risk tiers, jurisdiction, provider controls, moderation requirements, and evaluation evidence.

## Preconditions
Safety and compliance rules must be represented as authoritative policy inputs rather than inferred from model preference alone.

## Context to inspect
Governance registry, model approvals, safety evaluations, moderation layers, provider terms, audit requirements, and exception processes.

## Core knowledge
Safety and compliance requirements are hard routing constraints. A model that is cheaper or higher scoring cannot be used if it is unapproved for a risk class or jurisdiction. Policy should be explicit, versioned, and auditable.

## Procedure
1. Classify request risk using approved signals.
2. Resolve applicable jurisdiction and policy scope.
3. Load current model/provider approvals.
4. Filter candidates by mandatory safety controls.
5. Enforce required moderation or human-review gates.
6. Reject routes with incompatible retention or data-use terms.
7. Apply ordinary quality/latency/cost optimization only to eligible candidates.
8. Record policy version and eligibility reasons.
9. Test denial and fallback behavior.
10. Review exceptions separately from normal routing logic.

## Decision points
Fail closed when approval status is unknown for high-risk workloads. Do not silently downgrade safety controls during outages. Require explicit exception authority for policy bypasses.

## Common failure patterns
Embedding compliance as a soft score, stale allowlists, routing by geography without workload policy, and emergency fallbacks that bypass safety controls.

## Verification
Policy tests confirm prohibited models are never selected and audit logs show the rules that admitted or rejected each candidate.

## Expected output
A versioned safety/compliance routing layer, tests, audit fields, and exception workflow.

## Stop conditions
Stop when policy ownership is unclear, approvals conflict, or required evidence for model eligibility is missing.