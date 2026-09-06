# Documentation and Discovery Rules

## Purpose
Make production schemas understandable and discoverable without relying on tribal knowledge.

## Scope
Catalog descriptions, ownership, examples, lifecycle state, references, compatibility policy, and consumer discovery.

## MUST
- Production subjects MUST expose enough metadata for engineers to identify purpose, owner, lifecycle state, and compatibility expectations.
- Field descriptions MUST clarify domain semantics that are not obvious from names and primitive types.
- Deprecated contracts MUST document replacements and migration guidance.
- Registry documentation MUST distinguish normative contract requirements from examples or implementation notes.
- Documentation changes affecting semantics MUST be reviewed with the schema change.

## MUST NOT
- MUST NOT document a semantic change without updating the governed schema version or contract when the change is consumer-visible.
- MUST NOT use examples containing real secrets or sensitive production data.
- MUST NOT leave known ownership or lifecycle metadata stale after service transfer or retirement.

## SHOULD
- Link registry entries to authoritative service or domain documentation where useful.
- Generate searchable catalog metadata automatically from governed schema sources.

## Exceptions
Minimal documentation for short-lived experimental subjects requires explicit non-production scope and owner.

## Verification
Review catalog metadata, field descriptions, lifecycle records, generated documentation, and ownership links.