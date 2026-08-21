# Data Contract Engineering

**Purpose:** establish an executable agreement between producer and consumers.

**Trigger:** new dataset, new consumer, schema change or recurring ambiguity.

**Inputs:** owner, source, fields, types, keys, semantics, classification, freshness, consumers, retention.

**Preconditions:** authoritative owner identified; unresolved semantics marked as open questions.

**Procedure**
1. Capture dataset purpose, producer, consumers and source of truth.
2. Define fields, types, nullability, keys and event/business time.
3. Define freshness, delivery mode, partitions, retention and late-data behavior.
4. Define compatibility policy and allowed evolution.
5. Define quality expectations and quarantine policy.
6. Classify sensitive fields and required access controls.
7. Review downstream assumptions and migration needs.
8. Validate with `scripts/validate-data-contract.py`.

**Decisions:** compatible vs breaking change; reject/accept/quarantine invalid records.

**Outputs:** schema-valid contract, decision record if exceptional, consumer migration notes.

**Quality:** no ambiguous required fields; explicit owners and SLAs; compatibility is testable.

**Failure:** missing semantics -> stop and request domain-owner decision; conflicting consumers -> expose conflict and options.

**Stop condition:** approval is required for breaking contracts or sensitive-data policy exceptions.
