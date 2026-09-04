# Documentation and Discoverability Rules

## Purpose
Make governed APIs understandable, discoverable, and supportable by intended consumers.

## Scope
Applies to API catalogs, reference documentation, examples, onboarding material, and operational notices.

## MUST
- Every supported API MUST have discoverable ownership, lifecycle state, audience, contract reference, and support path.
- Documentation MUST explain authentication expectations, core workflows, errors, limits, compatibility policy, and deprecation status where relevant.
- Examples MUST be executable or otherwise validated against the current contract when practical.
- Documentation changes that alter normative behavior MUST be reviewed as contract changes.
- Deprecated operations MUST be visibly marked with migration guidance.

## MUST NOT
- Documentation MUST NOT promise behavior that the deployed contract does not guarantee.
- Private implementation details MUST NOT be presented as stable consumer commitments.
- Critical migration requirements MUST NOT exist only in release notes that consumers are unlikely to discover.

## SHOULD
- API catalogs SHOULD support searching by capability, owner, lifecycle, and domain.
- Documentation SHOULD separate normative requirements from illustrative examples.

## Exceptions
Exceptions require a documented audience constraint, compensating support mechanism, approval, and review date.

## Verification
Review catalog metadata, rendered documentation, example validation, broken-link checks, onboarding tests, and contract-to-documentation diffs.