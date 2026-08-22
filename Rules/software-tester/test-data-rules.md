# Test Data Rules

## Purpose
Keep test data representative, controlled, secure, and reproducible.
## Scope
Synthetic, masked, seeded, generated, and environment test data.
## MUST
- Define required data states and ownership for critical scenarios.
- Protect personal, confidential, and regulated data according to applicable controls.
- Make reusable test data setup deterministic or document unavoidable dependencies.
## MUST NOT
- Copy production secrets or sensitive customer data into lower environments without approved protection.
- Let shared mutable data silently determine test outcomes.
## SHOULD
- Prefer synthetic or properly masked data that preserves relevant distributions and constraints.
## Exceptions
Approved production-derived data requires documented necessity, minimization, access controls, and retention.
## Verification
Inspect datasets, access controls, setup scripts, masking evidence, cleanup, and reproducibility.