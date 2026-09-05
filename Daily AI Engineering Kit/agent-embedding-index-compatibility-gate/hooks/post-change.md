# Hook: Post Change

Trigger: after embedding/index-affecting edits or reindex work.

Action: capture candidate manifest; run `scripts/check_embedding_compat.py`; run `scripts/check_vector_samples.py`; run host build/tests; preserve compatibility and completeness evidence; hand to Verification Agent.

Expected: deterministic proof of compatibility or completed new generation.

Failure: incompatible reuse, partial rebuild, sample failure, or pending approval blocks completion.

Blocking: yes.
