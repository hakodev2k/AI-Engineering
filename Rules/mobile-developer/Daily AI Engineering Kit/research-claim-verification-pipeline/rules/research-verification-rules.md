# Research Verification Rules

## MUST
- Decompose material conclusions into atomic claims with stable IDs.
- Record source provenance for every evidence item.
- Distinguish source content from agent inference.
- Record contradictory evidence when found.
- Use fresh evidence for claims whose truth can change over time.
- Prefer primary sources for high-impact technical, security, policy, compatibility, and API claims.
- Preserve material qualifiers such as version, region, environment, date, feature flag, and configuration.
- Run deterministic validation before declaring the matrix complete.
- Require independent review before a high-impact claim becomes `verified`.
- Require explicit human approval before using research to authorize production deployment/config changes, database schema changes, infrastructure changes, secret changes, security-control removal, breaking public API changes, force push/delete operations, or large dependency upgrades.

## MUST NOT
- Treat a citation as proof merely because it mentions related terms.
- Fabricate source metadata, dates, quotations, benchmark results, or URLs.
- Count multiple summaries of the same upstream source as independent corroboration.
- Hide evidence that contradicts the preferred conclusion.
- Upgrade confidence solely because many low-quality sources agree.
- Mark a claim verified when a blocking contradiction remains unresolved.
- Let the Claim Analyst approve its own high-impact claims.
- Retry research indefinitely.
- Treat script/tool failure as a passed gate.

## SHOULD
- Search for disconfirming evidence after finding initial support.
- Prefer exact specifications, source code, release notes, official docs, and papers over commentary where appropriate.
- Use secondary sources to explain or independently corroborate rather than replace available primary evidence.
- Keep recommendations separate from the factual claims that justify them.
- Explicitly state uncertainty when evidence is incomplete.