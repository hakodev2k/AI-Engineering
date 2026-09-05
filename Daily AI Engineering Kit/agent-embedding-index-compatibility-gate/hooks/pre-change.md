# Hook: Pre Change

Trigger: before embedding model, vector-store, chunking, dimension, normalization, or distance-metric changes.

Action: capture baseline manifest; confirm query and document embedding paths; preserve current index generation; run baseline vector sample check.

Expected: evidence-backed baseline suitable for comparison and rollback.

Failure: invalid/unknown baseline blocks compatibility claims. Transient metadata reads retry max 2.

Blocking: yes.
