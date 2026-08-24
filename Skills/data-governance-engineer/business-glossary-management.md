# Business Glossary Management

## Purpose
Create governed business definitions that make data meaning consistent, discoverable, and operationally useful.

## When to use
Use when teams disagree on metrics or terms, onboarding domains, building semantic layers, or resolving reporting inconsistencies.

## Inputs
Business terminology, reports, schemas, policies, metric definitions, stakeholder knowledge, existing glossary/catalog.

## Context to inspect
Inspect conflicting definitions, synonyms, calculations, domain context, authoritative sources, downstream reports, and ownership.

## Core knowledge
A glossary governs business meaning rather than merely documenting columns. Terms need scope, owner, status, relationships, examples, and links to physical assets. Homonyms may legitimately have domain-specific meanings.

## Procedure
1. Prioritize terms tied to critical decisions and data.
2. Collect current definitions and usage evidence.
3. Identify conflicts, synonyms, and ambiguous scope.
4. Draft precise definitions without circular language.
5. Record calculation/business rules where applicable.
6. Assign term owner and steward.
7. Link terms to domains, metrics, datasets, and policies.
8. Run stakeholder review and resolve conflicts explicitly.
9. Publish status and effective date.
10. Establish change, deprecation, and impact workflows.
11. Measure adoption and unresolved ambiguity.

## Decision points
Create separate terms when meanings genuinely differ by domain; unify when differences are accidental. Avoid forcing consensus that hides legitimate contextual distinctions.

## Common failure patterns
Dictionary-style definitions, ownerless terms, duplicate synonyms, glossary disconnected from datasets, undocumented calculation changes, and endless approval cycles.

## Verification
Test whether independent users can interpret representative metrics consistently and trace each governed term to accountable owners and relevant assets.

## Expected output
Approved terms with definitions, scope, relationships, ownership, status, and asset mappings.

## Stop conditions
Escalate material semantic disputes affecting financial, regulatory, contractual, or executive reporting.