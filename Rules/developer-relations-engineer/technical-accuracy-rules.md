# Technical Accuracy Rules

## Purpose
Protect developer trust by making public technical guidance correct, current, and reproducible.

## Scope
Applies to articles, talks, tutorials, social posts, answers, examples, migration guidance, and release communication.

## MUST
- Technical claims MUST be verified against authoritative product behavior, documentation, source code, or reproducible tests before publication.
- Version-sensitive guidance MUST state the relevant product, API, SDK, runtime, or protocol version when behavior may differ.
- Known limitations and prerequisites MUST be disclosed when they affect successful use.
- Corrections to materially wrong public guidance MUST be issued promptly and preserve a clear correction trail.

## MUST NOT
- MUST NOT present speculation as documented product behavior.
- MUST NOT publish commands or code that have not been syntax-checked or otherwise validated where practical.
- MUST NOT hide known incompatibilities to make a demo appear simpler.

## SHOULD
- High-impact content SHOULD receive technical review by an appropriate subject-matter expert.
- Examples SHOULD prefer stable, supported interfaces over undocumented implementation details.

## Exceptions
Urgent communication may precede full validation only when uncertainty is explicit and follow-up verification is assigned.

## Verification
Reproduce examples, inspect cited sources, check versions, review subject-matter approval, and confirm correction handling for discovered errors.