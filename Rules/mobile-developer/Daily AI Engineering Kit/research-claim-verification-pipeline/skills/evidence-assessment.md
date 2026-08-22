# Skill: Evidence Assessment

## Purpose
Evaluate whether retrieved evidence actually supports a claim strongly enough for the intended decision.

## When to use
Use after claim decomposition and before any research finding is marked verified.

## Inputs
- atomic claim
- source metadata
- evidence excerpt or faithful summary
- source date/version when known
- decision impact

## Preconditions
The claim is atomic and scoped.

## Process
1. Identify source type: primary, secondary, anecdotal, generated, or unknown.
2. Check authority and relevance to the exact version/configuration in scope.
3. Classify relationship as `supports`, `contradicts`, or `context`.
4. Test entailment: would the evidence still be true if the claim were false? If yes, the evidence may be merely contextual.
5. Record qualifiers omitted by the claim.
6. Check recency where behavior can change.
7. Check independence: repeated articles deriving from one upstream source count as one evidence lineage.
8. Search specifically for disconfirming evidence for medium/high-impact claims.
9. Assign evidence strength: `weak`, `moderate`, `strong`.
10. Assign claim confidence only after considering all supporting and contradicting evidence.

## Tools
Official docs, specifications, source code, release notes, research papers, vendor docs, trusted secondary analysis, issue trackers, repository history, logs, and domain-specific read-only sources.

## Constraints
- Citation presence is not proof of entailment.
- Search snippets alone are weak evidence.
- User-generated content must not silently outweigh authoritative primary evidence.
- Generated summaries are not independent evidence.

## Expected output
Evidence records with relationship, strength, lineage, qualifiers, and resulting confidence.

## Verification
For every verified claim, a reviewer must be able to trace the conclusion to evidence that directly addresses the claim.

## Failure handling
When sources disagree, preserve both and downgrade status to unresolved/blocked when the conflict is material.

## Stop conditions
Stop when required evidence strength is met, when authoritative contradiction blocks verification, or when the bounded research budget is exhausted.