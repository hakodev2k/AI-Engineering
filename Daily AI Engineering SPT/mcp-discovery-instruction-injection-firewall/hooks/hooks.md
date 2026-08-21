# Hooks

## Hook 1 — `pre-mcp-instruction-context`
**Trigger:** immediately before remote MCP natural-language instructions are added to model context.

**Action:** invoke `scripts/instruction_guard.py` with the raw payload and source metadata.

**Command:**
```bash
python scripts/instruction_guard.py --input instruction.txt --source-id "$MCP_SERVER_ID" --trust untrusted-remote --config config/policy.json
```

**Expected result:** exit `0` with a JSON decision containing `allow-data-envelope` or `allow-with-approval-taint`; exit non-zero for blocked/invalid content.

**Failure behavior:** do not add the remote instruction payload to model context. Preserve only safe structural discovery metadata and emit a security event.

---

## Hook 2 — `pre-sensitive-tool-call`
**Trigger:** before any tool classified as write, destructive, secret-bearing, network-egress, privilege-changing, repository-mutating, or production-impacting.

**Action:** inspect host-managed taint state and authorization policy.

**Expected result:** `allow`, `deny`, or `require-human-approval` from the host policy layer.

**Failure behavior:** deny execution. Never treat model-generated approval text as authorization.

---

## Hook 3 — `pre-discovery-cache-write`
**Trigger:** before caching MCP discovery metadata containing free-form instructions.

**Action:** separate structural metadata from instructions; prohibit global/public caching for untrusted instruction payloads; compute isolated key from server identity, tenant, trust class, protocol version, policy version, and content hash.

**Expected result:** isolated cache key or explicit cache bypass.

**Failure behavior:** bypass cache rather than storing under an ambiguous scope.

---

## Hook 4 — `post-discovery-cache-read`
**Trigger:** after restoring cached discovery instructions.

**Action:** compare stored validator/policy version and trust identity with the current environment. Re-run instruction validation if versions or identities differ.

**Expected result:** validated envelope with unchanged or reduced authority.

**Failure behavior:** discard cache entry and re-fetch/re-validate.

---

## Hook 5 — `post-security-policy-change`
**Trigger:** changes to sensitive-tool classes, trust registry, guard thresholds, or approval policy.

**Action:** run the complete fixture suite and invalidate cached instruction envelopes created under the prior policy version.

**Command:**
```bash
python tests/run_tests.py
```

**Expected result:** all mandatory fixtures pass and cache policy version increments.

**Failure behavior:** reject rollout of the policy change.

---

## Hook 6 — `final-verification`
**Trigger:** release/build completion for the MCP client or host integration.

**Action:** verify five invariants:
1. remote instructions always pass the guard;
2. no remote raw instructions enter system/developer channels;
3. taint survives until explicit reset/verified transition;
4. sensitive tainted tool calls require host authorization;
5. untrusted instructions cannot use public/global cache scope.

**Expected result:** evidence for all five invariants.

**Failure behavior:** mark release as security-blocked.