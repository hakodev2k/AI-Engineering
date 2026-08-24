# Query Understanding

## Purpose
Ensure query parsing, normalization, intent detection, and rewriting preserve user intent.

## Scope
Tokenization, normalization, spelling, synonyms, intent classification, query rewriting, and filters.

## MUST
- Preserve the original query and derived transformations in debuggable form subject to privacy policy.
- Validate transformations on ambiguous, multilingual, malformed, and domain-specific queries.
- Bound automatic rewriting so uncertain transformations cannot silently replace materially different intent.
- Version behavior that can materially change retrieval semantics.

## MUST NOT
- Remove meaningful operators, identifiers, negation, or filters without an explicit semantic rule.
- Treat model confidence as evidence of correct intent.
- Introduce unreviewed global synonyms that create broad semantic collisions.

## SHOULD
- Prefer reversible transformations and expose diagnostics for major rewrite stages.
- Use domain dictionaries only with ownership and regression tests.

## Exceptions
Material exceptions require examples, measured impact, rollback criteria, and reviewer approval.

## Verification
Use golden-query tests, transformation traces, multilingual cases, ambiguity tests, and regression evaluation.