# Taxonomy Alignment

## Purpose
Align competing taxonomies and controlled vocabularies so concepts can interoperate without erasing legitimate semantic differences.

## When to use
Use during source integration, ontology federation, master-data consolidation, external vocabulary adoption, or migrations between classification systems.

## Inputs
Source and target taxonomies, concept definitions, hierarchy edges, synonyms, mappings, usage examples, and governance rules.

## Preconditions
Obtain authoritative definitions and identify who can approve semantic mappings.

## Context to inspect
Broader/narrower relations, polysemy, deprecated terms, regional variants, version history, source ownership, and downstream classification behavior.

## Core knowledge
Mappings can express equivalence, close match, broader/narrower relationships, or contextual transformations. Senior practice avoids declaring equivalence merely because labels are similar.

## Procedure
1. Normalize labels and identifiers while preserving originals.
2. Compare definitions before names.
3. Classify candidate mappings by semantic strength.
4. Detect one-to-many and many-to-one mismatches.
5. Identify concepts with no safe equivalent.
6. Add transformation rules where context determines mapping.
7. Record provenance and confidence.
8. Review ambiguous mappings with domain owners.
9. Test downstream query and classification effects.
10. Version mappings alongside taxonomy releases.

## Decision points
Use exact equivalence only when extension and intended meaning align. Prefer weaker mapping relations when scope differs. Keep local concepts when forcing alignment would lose meaning.

## Common failure patterns
String-equality mapping; flattening hierarchical distinctions; losing deprecated-term redirects; bidirectional mappings that are not logically reversible; and undocumented manual exceptions.

## Verification
Sample mappings across hierarchy levels, test affected queries, check orphaned concepts, validate mapping direction, and compare classification outcomes before and after alignment.

## Expected output
A versioned mapping set with relation strength, provenance, exceptions, and validation evidence.

## Stop conditions
Stop when authoritative definitions conflict or a mapping would materially alter regulated or contractual classifications without approval.