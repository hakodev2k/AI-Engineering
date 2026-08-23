# Few-Shot Example Rules

## Purpose
Use examples to clarify behavior without allowing examples to become hidden, brittle requirements.

## Scope
Demonstrations, exemplars, counterexamples, and synthetic examples embedded in prompts.

## MUST
- Examples MUST be consistent with the explicit prompt contract.
- Mandatory behavior implied by examples MUST also be stated explicitly when omission could cause ambiguity.
- Examples MUST cover representative patterns rather than only idealized happy paths when examples materially guide behavior.
- Sensitive or production-derived examples MUST be sanitized before inclusion.

## MUST NOT
- MUST NOT include contradictory examples without explaining which behavior is intended.
- MUST NOT use examples containing secrets, personal data, or proprietary content without authorization.
- MUST NOT overfit evaluation cases by copying them directly into the prompt unless that is the intended product behavior.

## SHOULD
- Prefer diverse examples that teach decision boundaries rather than superficial wording patterns.
- Negative examples SHOULD explain the prohibited property when useful.

## Exceptions
Simple deterministic formatting tasks may use examples as the primary specification when the contract remains unambiguous.

## Verification
Review examples against requirements, scan for sensitive data, compare against evaluation sets, and test unseen variants.