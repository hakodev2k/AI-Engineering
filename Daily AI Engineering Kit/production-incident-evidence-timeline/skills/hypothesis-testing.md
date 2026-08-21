# Skill: Incident Hypothesis Testing

## Purpose
Turn vague incident theories into falsifiable hypotheses and test them with the smallest safe set of discriminating evidence.

## When to use
Use after an initial evidence timeline exists and more than one plausible explanation remains.

## Inputs
- incident timeline
- current hypotheses
- architecture/dependency map
- known healthy baselines
- available telemetry and safe test capabilities

## Preconditions
- observations are separated from interpretations
- each evidence item has provenance
- no production mutation is needed merely to test a theory unless explicitly approved

## Process
1. Express each hypothesis as a causal statement: condition -> mechanism -> observed effect.
2. List observations the hypothesis explains.
3. List predictions that should be true if the hypothesis is correct.
4. List disconfirming observations that would make it false or materially weaker.
5. Identify competing hypotheses sharing the same symptoms.
6. Choose a test that best separates competitors with minimal risk and cost.
7. Run read-only queries or safe-environment tests first.
8. Record result as `supports`, `contradicts`, or `inconclusive`; never force a binary conclusion from weak evidence.
9. Update confidence only from new evidence, not repetition of the same evidence.
10. Reject hypotheses contradicted by high-quality evidence unless a documented measurement limitation explains the contradiction.
11. Stop expanding the hypothesis set once five active hypotheses exist; reject or merge before adding another.
12. Hand the ranked evidence table to the Evidence Reviewer.

## Allowed tools
Read-only telemetry, repository inspection, deployment metadata, safe test environments, deterministic scripts.

## Constraints
- no confirmation-only testing
- no production writes without a separate approved mitigation workflow
- no unsupported confidence percentages; use `low`, `medium`, `high`, or `confirmed` with evidence
- `confirmed` requires direct or strongly discriminating evidence and independent review

## Expected output
For every hypothesis: statement, predicted observations, supporting evidence IDs, contradicting evidence IDs, test results, confidence, and status.

## Verification
A reviewer must be able to reconstruct why a hypothesis was accepted, rejected, or left unresolved from evidence references alone.

## Failure handling
If a discriminating test is unavailable, record the limitation and seek a different evidence source. Retry transient queries at most twice. If all safe tests remain inconclusive, stop with cause `unconfirmed`.

## Stop conditions
Stop when one hypothesis is sufficiently supported and major alternatives are addressed, or when the remaining uncertainty cannot be reduced safely within the investigation budget.
