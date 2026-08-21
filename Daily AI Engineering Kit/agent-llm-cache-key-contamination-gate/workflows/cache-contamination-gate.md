# LLM Cache Key Contamination Gate Workflow

## Trigger
Use when adding, changing, or reviewing caching around LLM, RAG, tool-using, personalized, or tenant-aware responses.

## Entry conditions
- Repository and target cache path are identified.
- Test environment is available.
- No production mutation is required for initial analysis.

## Inputs
Repository, current cache code, identity/data scope, prompt construction, model configuration, tool schema, response format, TTL requirements.

## Flow
```text
Trigger
  ↓
Boundary analysis
  ↓
Key specification
  ↓
Deterministic gate tests
  ↓
Implementation/change
  ↓
Independent verification
  ↓
Approval if production migration/purge is needed
  ↓
Complete
```

## Stages
### 1. Context and boundary analysis
Owner: Cache Boundary Reviewer.
Use `skills/cache-boundary-analysis.md`. Produce a boundary inventory with evidence.
Checkpoint: no unexplained tenant/user/data-scope dependency remains.

### 2. Key design
Owner: implementation/planning agent.
Use `skills/cache-key-design.md` and `config/cache-policy.yaml`.
Produce key material specification, TTL, namespace/version, invalidation notes, and required tests.
Checkpoint: missing mandatory key fields result in BLOCK.

### 3. Deterministic validation
Run:
`python scripts/cache_key_gate.py --request examples/request-safe.json --policy config/cache-policy.yaml`
Expected: PASS.
Run the risky example and verify that policy/key material reflects a distinct tenant/data scope.

### 4. Implementation
Apply the smallest safe cache change. Preserve authorization checks on cache hits. Do not expose raw prompts or secrets in cache keys/logs.
Checkpoint: diff contains only intended cache/test/config changes.

### 5. Tests
Run `python -m pytest tests/test_cache_key_gate.py` plus project-specific cache/integration tests.
Retry policy: at most 2 implementation correction cycles for deterministic test failures. Preserve failing command, output, and diff for each cycle.

### 6. Independent verification
Owner: Cache Verification Agent.
Verify same inputs => same key; tenant/data-scope/prompt/tool/format changes => different keys when policy requires them; TTL is bounded; missing required fields block caching.

### 7. Approval
Explicit human approval is required before production cache purge, cache namespace migration that invalidates production data, production configuration change, or permission/security relaxation.

## Failure paths
- Missing identity/data scope: BLOCK caching and escalate.
- Tool/test transient failure: retry command once; if repeated, record environment/tool failure and stop.
- Validation failure: return to implementation, maximum 2 cycles.
- Production-only reproducibility requirement: collect non-sensitive evidence and request approval/access rather than escalating permissions silently.

## Stop conditions
Stop immediately before destructive cache purge, production configuration mutation, secret change, authorization weakening, or any irreversible deployment action without approval.

## Produced artifacts
Boundary inventory, key specification, gate result, tests, verification report using `templates/cache-review-report.md`.

## Definition of Done
- All relevant cache boundaries are identified with evidence.
- Required isolation fields are represented in key material.
- Deterministic tests pass.
- Project-specific relevant tests pass.
- No raw secrets or prompts are stored in cache keys.
- TTL satisfies policy.
- Independent verification is PASS.
- Required production approval exists when applicable.
- No unresolved blocking risk remains.
