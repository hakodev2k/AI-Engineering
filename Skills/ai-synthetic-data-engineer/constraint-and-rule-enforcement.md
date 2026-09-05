# Constraint and Rule Enforcement

## Purpose
Ensure synthetic data obeys domain invariants, schemas, logical rules, safety requirements, and relational constraints even when the generator is probabilistic.

## When to use
Use whenever invalid combinations, broken references, impossible states, unsafe scenarios, or inconsistent labels would reduce training or evaluation quality.

## Inputs
Schema, business/domain rules, allowed ranges, relational constraints, temporal rules, label definitions, generator outputs.

## Preconditions
Rules have owners and are separated into hard constraints versus desirable statistical tendencies.

## Context to inspect
Validation code, database constraints, domain documentation, state machines, APIs, ontology/taxonomy definitions, real-data violations, exception policies.

## Core knowledge
Probabilistic generators should not be trusted to obey critical invariants implicitly. Hard constraints should be enforced deterministically before data is accepted. Excessive post-filtering can also distort distributions and hide generator weakness.

## Procedure
1. Enumerate hard and soft constraints.
2. Encode machine-checkable validators for hard rules.
3. Decide whether constraints belong in generation, decoding, repair, or rejection.
4. Validate every generated sample before publication.
5. Measure rejection and repair rates by rule.
6. Investigate high failure rates instead of silently filtering them.
7. Check interactions between constraints for impossible requirement sets.
8. Validate relational and temporal consistency across records.
9. Run boundary and adversarial cases through validators.
10. Version rules together with datasets and generators.

## Decision points
Prefer constrained generation when rejection is costly or distorts coverage. Prefer post-validation when generation constraints are complex but invalid samples are cheap to discard.

## Common failure patterns
Relying on prompts for hard rules, repairing records without logging provenance, ignoring cross-row constraints, and filtering so aggressively that the output distribution changes unintentionally.

## Verification
All published samples pass hard validators; soft-rule deviations are quantified; rejection and repair rates are within defined thresholds.

## Expected output
A versioned constraint specification, enforcement pipeline, validation metrics, and documented exceptions.

## Stop conditions
Stop when constraints are contradictory, validation authority is unclear, or acceptable output requires bypassing critical rules.