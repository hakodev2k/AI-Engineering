# User Flow Rules
## Purpose
Design complete end-to-end journeys rather than isolated screens.
## Scope
Entry, branching, interruption, recovery, and completion.
## MUST
- Map prerequisites, decisions, alternate paths, failures, exits, and completion for critical journeys.
- Account for authentication, permissions, unavailable data, and interrupted sessions where relevant.
- Define safe return behavior after partial completion.
## MUST NOT
- Optimize only the happy path.
- Trap users without a legitimate safe exit.
## SHOULD
- Validate critical journeys with realistic data and constraints.
## Exceptions
Rare branches may be deferred only with explicit fallback and risk.
## Verification
Walk through flow diagrams and prototypes against representative edge cases.