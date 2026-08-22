# Hook: Pre-Memory Write Check

## Trigger
Immediately before any record is committed to durable agent memory, checkpoint storage, vector/graph memory, or long-term summary store.

## Preconditions
The candidate write has a complete provenance envelope and the active tenant/profile identity is known.

## Action
1. Validate the envelope with `scripts/validate_memory_record.py`.
2. Compare `tenant_id` with the active tenant/profile.
3. If content is instruction-like and originates from `user`, `tool`, or `retrieval`, keep authority at `untrusted-observation`/`user-assertion` or quarantine according to host policy.
4. Block `operator-policy` or `confirmed-preference` unless confirmation metadata is present and authenticated by the host.
5. Preserve lineage for derived summaries/merges.

## Command
```bash
python scripts/validate_memory_record.py pending-memory.json --expected-tenant "$ACTIVE_TENANT"
```

## Expected result
Exit 0; required provenance present; tenant matches; no invalid authority transition.

## Failure behavior
Exit 2 indicates malformed/unreadable input and blocks the write. Exit 3 indicates policy/tenant validation failure and blocks or quarantines the write. Do not silently downgrade a failed operator-policy write into a different policy record; require explicit reclassification evidence.

## Blocking
Yes for durable writes that fail provenance, tenant, or authority requirements. The host may quarantine content as non-authoritative observation if that behavior is explicitly configured and auditable.