# Deterministic Fixtures

Use JSON records with `scripts/cache_scope_guard.py`.

## Required cases
1. **Trusted public write** — verified `example-reviewed-server`, `tools/list`, public scope → exit 0, effective `public`.
2. **Untrusted public write** — unknown server, public scope → exit 4, effective `private`.
3. **Private same-context hit** — matching stored/current auth fingerprint → exit 0.
4. **Private cross-context hit** — different fingerprints → exit 5.
5. **Content digest mismatch** — stored/current SHA differ → exit 5.
6. **Server identity mismatch** — stored/current server IDs differ → exit 5.
7. **Malformed scope/negative TTL** → exit 2.
8. **Unknown identity** — empty server ID → exit 2; host must fail closed to no-store.

## Verification protocol
Run each case before and after integration. Record decision, exit code, effective scope, admission latency, and whether any model-visible attacker content crossed contexts. Security pass criterion is zero cross-context transfer and zero unauthorized shared-cache admission. Performance is secondary and must not alter the pass criterion.

## Bounded failure handling
A failed fixture may be rerun once to exclude harness error. A second failure is blocking and must be investigated rather than waived.
