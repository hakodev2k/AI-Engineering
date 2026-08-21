# Engineering Rules

## MUST
- Every durable memory MUST carry tenant, source identity/type/trust, writer, timestamp, content digest and state.
- Derived memory MUST retain parent lineage.
- Memory write classification MUST run before an entry becomes retrievable.
- Retrieval MUST filter tenant and security state before semantic/vector ranking.
- `quarantined` and `revoked` entries MUST NOT enter model context.
- Missing provenance MUST fail closed when the policy enables fail-closed mode.
- Trust upgrades MUST be explicit, auditable and human-approved when configured.
- Revoking a poisoned source MUST invalidate all known descendants before incident closure.
- Security decisions MUST emit stable reason codes.
- Cross-tenant retrieval MUST return zero records.
- Incident evidence MUST be preserved before destructive purge.
- A model MUST NOT be the sole authority that declares its own retrieved memory trustworthy.

## MUST NOT
- MUST NOT infer trust from vector similarity, graph proximity, storage location or repeated retrieval.
- MUST NOT silently rewrite a quarantined item into a trusted summary.
- MUST NOT remove provenance during summarization, embedding, compaction or migration.
- MUST NOT automatically lower thresholds after a false-positive complaint.
- MUST NOT use unrestricted shared namespaces where tenant isolation is required.
- MUST NOT treat sanitizer success as proof of semantic safety.
- MUST NOT restore revoked memory without fresh source validation and explicit re-ingestion.
- MUST NOT log secrets merely to improve security evidence.

## SHOULD
- SHOULD separate active, quarantine and revoked namespaces physically when the backend supports it.
- SHOULD include source/trust labels in the model-facing context envelope so retrieved data is visibly untrusted where appropriate.
- SHOULD benchmark benign false-positive and poisoned-fixture detection rates before enforcement.
- SHOULD cap lineage depth and detect cycles.
- SHOULD sign or otherwise protect high-value provenance records when the store is exposed to multiple writers.
- SHOULD version policies and store the policy version used for each classification.
- SHOULD periodically audit old entries when a scanner/policy changes.
- SHOULD use independent verification for high-impact revocation or trust-restoration decisions.