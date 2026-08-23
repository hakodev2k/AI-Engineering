# Innovation and Experimentation Rules

## Purpose
Enable technology exploration without converting experiments into unmanaged enterprise dependencies.

## Scope
Proofs of concept, emerging technologies, pilots, sandboxes, and innovation programs.

## MUST
- Experiments MUST define hypothesis, success criteria, scope, data classification, cost boundary, owner, and end condition.
- Production adoption MUST undergo normal security, architecture, operational, procurement, and lifecycle evaluation.
- Experiment outcomes MUST record evidence, limitations, and adoption or termination decision.

## MUST NOT
- MUST NOT expose production secrets or sensitive data to unapproved experimental services.
- MUST NOT allow successful prototypes to become production systems by default.

## SHOULD
- Prefer low-cost, reversible experiments that test the highest-risk assumptions first.

## Exceptions
Production-like experiments require explicit approval and controls proportional to exposed risk.

## Verification
Review experiment charters, access/configuration, results, costs, teardown evidence, and adoption decisions.