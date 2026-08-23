# Lifecycle Hooks

## Pre-task freshness validation
- Trigger: before a RAG-dependent task or release check.
- Preconditions: metadata sample exists.
- Action: `python scripts/freshness_gate.py --policy config/freshness-policy.yaml --input <metadata.json> --output <result.json>`.
- Expected result: exit 0 and status `pass`.
- Failure behavior: block retrieval-dependent completion; preserve result.
- Blocking: yes.

## Post-reindex validation
- Trigger: after any scoped or approved reindex.
- Preconditions: ingestion reports completion.
- Action: recollect metadata, rerun freshness gate, then execute acceptance retrievals.
- Expected result: zero stale sampled documents and current versions returned.
- Failure behavior: return to diagnosis once; then stop/escalate.
- Blocking: yes.

## Final package verification
- Trigger: before distributing this kit.
- Preconditions: package files are present.
- Action: `python scripts/verify_package.py` and `python -m unittest tests/test_freshness_gate.py`.
- Expected result: both exit 0.
- Failure behavior: package is not complete.
- Blocking: yes.
