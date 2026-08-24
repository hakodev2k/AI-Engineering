# Developer Portal and Discovery

## Purpose
Make governed APIs discoverable with trustworthy self-service documentation.

## Scope
Catalogs, ownership, specifications, examples, lifecycle state, and onboarding.

## MUST
- Published APIs MUST identify owner, lifecycle state, authentication requirements, and canonical contract.
- Documentation MUST match deployed behavior for supported versions.
- Examples MUST use non-secret placeholder data and valid contract semantics.
- Deprecated APIs MUST be visibly marked with migration guidance.

## MUST NOT
- MUST NOT publish stale specifications as authoritative.
- MUST NOT expose internal credentials, private infrastructure details, or sensitive production samples.

## SHOULD
- Portal content SHOULD be generated from version-controlled sources where practical.

## Exceptions
Manually maintained content requires an owner and explicit freshness review.

## Verification
Compare catalog entries to deployed versions, run documentation checks, validate examples, and inspect ownership metadata.