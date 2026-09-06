# Reasoning and Inference Rules

## Purpose
Ensure inferred graph knowledge is explainable, bounded, and operationally safe.

## Scope
Rule engines, entailment, transitive closure, classification, derived relationships, and inference materialization.

## MUST
- Every production inference rule MUST have explicit inputs, outputs, assumptions, and owner.
- Inferred facts MUST be distinguishable from source-observed facts.
- Recursive or transitive reasoning MUST have termination and resource bounds.
- Materialized inference changes MUST be validated for cardinality growth and downstream impact.

## MUST NOT
- MUST NOT introduce inference cycles that can create uncontrolled expansion.
- MUST NOT treat probabilistic conclusions as deterministic facts without explicit representation.
- MUST NOT remove source facts solely because an inference produces an equivalent conclusion.

## SHOULD
- Prefer explainable derivations for high-impact decisions.
- Store inference provenance where consumers require auditability.

## Exceptions
Opaque inference requires documented justification, risk assessment, and approval.

## Verification
Review rule definitions, derivation traces, termination tests, cardinality tests, and sampled explanations.