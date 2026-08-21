# Workflows

## Workflow A — Ingest Remote MCP Instructions Safely

**Trigger:** MCP discovery/initialization returns natural-language instructions.

**Goal:** prevent server-controlled instructions from acquiring trusted prompt authority.

**Inputs:** raw instruction text, server identity, tenant/session identity, policy version.

**Baseline:** document current path from MCP transport → discovery parsing → prompt/context assembly → tool execution.

**Context:** trusted server registry, validator config, sensitive-tool registry, audit sink.

**Stages**
1. **Observe** — capture source identity and payload size before prompt assembly.
2. **Normalize** — normalize Unicode/line endings and reject prohibited control characters.
3. **Classify source** — assign trust class.
4. **Validate payload** — run deterministic guard and produce reason codes.
5. **Decide** — block, allow as untrusted data, or allow with approval taint.
6. **Envelope** — expose only bounded normalized content in an explicit `UNTRUSTED_REMOTE_INSTRUCTIONS` data section.
7. **Propagate taint** — attach taint metadata to context/session state.
8. **Audit** — write structured event containing source, hash, policy version, decision, and reason codes.
9. **Verify** — assert trusted instruction channels contain no remote raw payload.

**Responsible agents:** Security Policy Agent → Implementation Agent → Verification Agent.

**Tools:** instruction guard, application integration layer, test runner.

**Outputs:** decision record, safe envelope or block result, audit event.

**Checkpoints**
- CP1: source identity resolved;
- CP2: deterministic validation completed;
- CP3: no raw remote text in trusted instruction channel;
- CP4: audit event emitted;
- CP5: taint state available to tool authorization.

**Metrics:** classification coverage, blocked/tainted rates, bypass count, false-positive count.

**Retry policy:** maximum 1 retry for transient audit/storage failure; validation/policy errors do not retry automatically.

**Stop conditions:** malformed payload, hard size limit, missing policy, unresolved identity for a sensitive context, or guard failure.

**Failure path:** reject instructions, preserve base MCP structural metadata when safe, surface security error, never downgrade to unguarded ingestion.

**Verification:** regression fixtures plus runtime assertion that remote payload origin cannot map to system/developer authority.

**Definition of Done:** every remote instruction ingestion path invokes the guard before context assembly and all mandatory fixtures pass.

---

## Workflow B — Authorize Tool Calls After Tainted Context

**Trigger:** model proposes a tool call after untrusted MCP instructions were accepted into context.

**Goal:** stop prompt-injected content from causing sensitive side effects.

**Inputs:** taint state, tool name, arguments summary, user policy, side-effect class.

**Baseline:** inventory tools and classify current approval behavior.

**Stages**
1. Resolve tool risk class.
2. Read taint state from host-managed context metadata.
3. Evaluate host-side authorization policy.
4. If sensitive + tainted, present explicit human approval request including source server and effect summary.
5. Reject model-generated approval claims.
6. Execute only after policy returns allow.
7. Audit decision and result.

**Outputs:** `allow`, `deny`, or `require-human-approval` decision plus audit record.

**Checkpoints:** risk class known; taint available; approval source valid; arguments remain within approved scope.

**Metrics:** sensitive tainted calls, approvals/denials, unauthorized executions (target 0), self-approval bypasses (target 0).

**Retry policy:** no retry for denial; at most 1 approval re-request if arguments materially change and user is shown the new scope.

**Stop conditions:** ambiguous authorization, policy failure, changed arguments after approval, forbidden tool class.

**Failure path:** deny the action and preserve context for inspection.

**Verification:** adversarial tests for filesystem write, repository write, secret access, external network post, privilege change, and destructive deletion.

**Definition of Done:** no sensitive tainted tool call can execute without a host-verifiable allow decision.

---

## Workflow C — Safe Discovery Cache

**Trigger:** discovery metadata is about to be cached or restored.

**Goal:** prevent cross-user/session amplification of malicious instructions.

**Inputs:** server identity, tenant/session, trust class, protocol version, validator/policy version, payload hash.

**Baseline:** inspect existing cache key and cache scope.

**Stages**
1. Split structural metadata from free-form instructions.
2. Disable global/public caching for raw untrusted instructions by default.
3. Build cache key from server identity + tenant + trust class + protocol version + policy version + payload hash.
4. Apply short TTL for allowed untrusted envelopes.
5. On restore, compare current policy/validator versions.
6. Revalidate if versions changed or identity cannot be proven.
7. Reject reuse across trust boundaries.

**Outputs:** cache bypass, isolated cache entry, or validated restored envelope.

**Checkpoints:** identity included; tenant included; trust class included; policy version included.

**Metrics:** global cache hits for untrusted instructions (target 0), cross-tenant reuse (target 0), revalidation count.

**Retry policy:** one re-fetch on cache corruption; otherwise bypass cache.

**Stop conditions:** missing identity, ambiguous tenant, failed integrity check, stale validator policy with failed revalidation.

**Failure path:** bypass cache and fetch/revalidate fresh metadata.

**Verification:** two-tenant and two-server fixtures prove no reuse across boundaries.

**Definition of Done:** cache semantics cannot raise the authority or broaden the audience of untrusted instructions.