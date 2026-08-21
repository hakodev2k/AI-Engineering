# Final Verification Hook

**Trigger:** after edits and before declaring the task verified.

**Preconditions:** investigation evidence exists and target hosts are known.

**Actions:** run `python -m unittest tests/test_dns_gate.py`; rerun `scripts/dns_gate.py`; inspect repository diff; confirm any approval-required action has explicit approval evidence; perform application/TLS failover verification when the task concerns failover.

**Expected result:** tests pass, gate exits 0 for intended healthy state, no forbidden addresses or unapproved protected mutations, and independent verifier reports `verified`.

**Failure behavior:** block completion. A transient diagnostic may be retried within the policy budget; deterministic failures return to planning and may undergo at most two fix-test cycles.

**Blocking:** yes.
