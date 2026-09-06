# Terminology and Glossary Governance

## Purpose
Create and govern terminology assets so AI outputs, UI, retrieval content, and human translations use consistent domain language across locales.

## When to use
Use when products contain specialized vocabulary, brand terminology, regulated wording, or recurring translation inconsistencies.

## Inputs
Source terminology, domain documents, translation memories, product strings, policy terms, market feedback, and target locales.

## Preconditions
Domain owners can validate meaning and preferred usage.

## Context to inspect
Inspect existing glossaries, style guides, prompts, UI catalogs, support language, model instructions, and retrieval corpora for conflicting terms.

## Core knowledge
A glossary needs concept identity, source term, locale variants, forbidden variants, context, part of speech, ownership, and lifecycle. A one-to-one word list is insufficient for polysemy and inflection.

## Procedure
1. Extract high-impact recurring terms from product and domain content.
2. Group terms by underlying concept rather than surface spelling.
3. Capture approved and prohibited variants with usage notes.
4. Record grammatical and contextual constraints where relevant.
5. Review terminology with domain and locale experts.
6. Integrate terms into translation, prompt, retrieval, and QA workflows.
7. Add automated checks for prohibited or inconsistent variants where practical.
8. Version changes and communicate downstream impact.

## Decision points
Enforce a single preferred term when consistency or compliance matters; allow controlled synonyms when naturalness or user vocabulary is more important.

## Common failure patterns
Flat word lists, missing context, stale terms, unowned changes, over-enforcement of awkward literal forms, and inconsistent application between UI and generated text.

## Verification
Sample outputs and source assets across locales, confirm approved terms appear in correct contexts, and verify prohibited variants are caught where controls exist.

## Expected output
A governed multilingual terminology set with ownership, context, allowed variants, prohibited variants, and version history.

## Stop conditions
Stop when domain meaning cannot be validated or terminology changes create unresolved legal or safety implications.