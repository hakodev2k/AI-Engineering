# Final Context Verification Hook

**Trigger:** Immediately before declaring the downstream AI task verified.

**Preconditions:** Current `context-manifest.json` exists and reflects latest relevant edits/evidence.

**Action:** Run `python scripts/verify_manifest.py context-manifest.json --policy config/policy.json`, then Context Verifier checks high-impact summaries and stale evidence.

**Expected result:** Script exits 0 and verifier returns `verified`.

**Failure behavior:** One refresh may be attempted if total refresh attempts remain below two. Otherwise stop and preserve manifest plus verifier findings.

**Blocking:** Yes.
