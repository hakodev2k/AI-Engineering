# Embedding Index Safety Rules

## MUST
- Treat embedding model identity and dimensions as part of persisted-data schema.
- Capture baseline and candidate manifests.
- Use a new index generation for incompatible changes.
- Verify full rebuild completion before cutover.
- Validate sampled vector dimensions and normalization.
- Preserve the previous generation until rollback is no longer required.
- Use independent verification for production-impacting reindex work.

## MUST NOT
- Mix vectors from different model spaces in one generation.
- Assume equal dimensions imply compatibility.
- Change distance metric without explicit rebuild/validation.
- Mark a partial re-embedding complete.
- Delete old vectors/indexes without explicit approval.
- Change secrets, production config, infrastructure, or deploy production without approval.
- Retry indefinitely.

## SHOULD
- Use generation-stamped namespaces/collections.
- Keep query/document embedding config in one shared contract.
- Make reindex jobs resumable and idempotent.
- Measure retrieval quality separately from structural compatibility.
