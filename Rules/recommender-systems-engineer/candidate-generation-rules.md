# Candidate Generation Rules

## Purpose
Protect recall, latency, and policy constraints in candidate retrieval.

## Scope
Applies to retrieval indexes, ANN search, heuristic sources, graph retrieval, and candidate unions.

## MUST
- Candidate sources MUST define ownership, freshness, eligibility, and expected recall contribution.
- Retrieval changes MUST measure recall, latency, resource cost, and downstream ranking impact.
- Eligibility and safety exclusions MUST be enforced before candidates can reach ranking when required by policy.
- Index build and refresh processes MUST be reproducible and observable.
- Candidate-source failures MUST degrade predictably and MUST NOT silently widen eligibility.

## MUST NOT
- MUST NOT optimize retrieval latency by removing critical eligibility or safety checks.
- MUST NOT rely on one candidate source without documented failure behavior when availability matters.
- MUST NOT claim recall improvement without evaluation on representative traffic or benchmark data.

## SHOULD
- Candidate sources SHOULD be independently measurable.
- High-cost retrieval SHOULD use bounded fan-out and time budgets.

## Exceptions
Exceptions require evidence, risk analysis, and approval when policy coverage or availability is affected.

## Verification
Inspect retrieval configs, exclusion logic, benchmark results, index freshness metrics, and failure-mode tests.