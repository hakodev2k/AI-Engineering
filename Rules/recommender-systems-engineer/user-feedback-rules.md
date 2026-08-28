# User Feedback Rules

## Purpose
Ensure explicit and implicit feedback is interpreted correctly and cannot silently corrupt personalization.

## Scope
Applies to clicks, skips, hides, likes, ratings, purchases, dwell signals, negative feedback, and feedback aggregation.

## MUST
- Feedback events MUST define semantics, timestamp, source, actor, and whether they are explicit or inferred.
- Negative feedback MUST be distinguished from missing interaction and ordinary non-selection.
- Event deduplication and ordering rules MUST be documented where repeated or delayed events are possible.
- Feedback used for training or online adaptation MUST be filtered for known bots, fraud, instrumentation errors, and invalid traffic where applicable.
- User controls such as hide, block, or dislike MUST propagate according to documented latency expectations.

## MUST NOT
- MUST NOT treat every click as positive satisfaction without considering downstream outcome or accidental interaction risk.
- MUST NOT erase explicit negative feedback through unrelated positive signals without a defined policy.
- MUST NOT silently change feedback semantics without versioning downstream consumers.

## SHOULD
- Feedback pipelines SHOULD preserve raw provenance for audit and reprocessing.
- Conflicting signals SHOULD use documented precedence rules.

## Exceptions
Exceptions require documented semantics, affected consumers, migration plan, and validation evidence.

## Verification
Inspect event contracts, aggregation logic, deduplication tests, user-control propagation tests, and training feature lineage.