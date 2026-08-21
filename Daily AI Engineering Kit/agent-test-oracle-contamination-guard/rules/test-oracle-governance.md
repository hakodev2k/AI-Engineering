# Test Oracle Governance

## MUST
- Define expected behavior from an identifiable evidence source before using the implementation as supporting context.
- Record source type, source identifier, risk, and evidence for every oracle claim.
- Mark implementation-derived sources as non-independent.
- Recompute oracle fingerprint after any claim or policy change.
- Run contamination detection after test generation or assertion edits.
- Require mutation evidence for risk levels configured in `config/oracle-policy.json`.
- Require an independent reviewer for high-risk work when policy says so.
- Bind review to the exact oracle fingerprint.
- Distinguish `tests-executed` from `oracle-verified`.
- Preserve failing mutation/contamination evidence when verification blocks.
- Require explicit human approval before any action listed under `approval_required_actions`.

## MUST NOT
- Use private helpers as the source of expected results.
- Copy current branch output into a golden snapshot and call it independent verification.
- Generate expected constants solely by reading the expression that computes the actual value.
- Treat test pass as proof when contamination blockers remain.
- Treat a timeout/tool failure as evidence that mutation requirements passed.
- Allow the implementation owner to be the sole high-risk reviewer.
- Change requirements, public contracts, domain rules, or security constraints merely to match the implementation.
- Silence warnings by deleting provenance fields.
- Retry validation failures; only transient tool failures may retry, at most once.
- Continue an autonomous loop indefinitely.

## SHOULD
- Prefer acceptance criteria, public contracts, domain rules, official documentation, historical regression evidence, and independently curated fixtures.
- Include at least one negative or boundary case for high-risk behavior.
- Use mutation testing or equivalent deliberate fault injection to prove the oracle rejects wrong behavior.
- Keep oracle claims small and behavior-specific.
- Keep generated tests readable enough that a reviewer can trace assertions to evidence.
- Reuse stable source identifiers so claims can be refreshed when requirements change.
