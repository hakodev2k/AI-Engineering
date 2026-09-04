# Session Prefix Persistence Integrity Guard

**Category:** Token

## Problem
Long-context agent sessions depend on prompt/prefix caching to keep resumed work affordable and responsive. A session can persist semantically correct conversation data yet reconstruct different cache-sensitive bytes after resume, or fail to persist the canonical prefix at all. The next request then performs a large cold prefill/cache creation even though the user is continuing the same session.

## Evidence
See `evidence/research.md`. Current public signals include Hermes Agent issue #96570 (2026-08-27), Claude Code issue #42338 (2026-04-02), and Hermes Agent issue #77320 (2026-08-03). Together they show missing persisted system prompts, cache invalidation on session resume, and replay-byte drift that forces repeated re-prefill.

## Existing approach
Providers/backends support implicit or explicit prompt caching. Agent runtimes commonly persist conversation history, system prompts, session rows, and sometimes exact API sidecars. Cache hit/creation telemetry can reveal regressions after calls occur.

## Existing limitations
Semantic reconstruction is not necessarily byte/token-identical reconstruction. A non-empty stored prompt can still replay differently. Downstream cache metrics tell operators that reuse failed but do not prove whether the durable session boundary corrupted the canonical prefix. Legitimate provider/model/toolset changes also need a clean rebaseline path.

## Proposed improvement
Persist a non-secret manifest of the exact stable prefix from a known-good request, bound to runtime identity. Before the first expensive request after resume, reconstruct the production prefix and compare exact segment order/bytes deterministically. Diagnose drift before spending a cold prefill, then verify the repair using provider cache/input-token and latency metrics without removing correctness-critical context.

## Architecture
```text
session-prefix-persistence-integrity-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-resume-prefix-check.md
├── rules/
│   └── prefix-persistence-rules.md
├── scripts/
│   └── prefix_persistence_guard.py
├── skills/
│   └── session-prefix-integrity-audit.md
├── subagents/
│   └── prefix-verifier.md
├── tests/
│   └── test_prefix_persistence_guard.py
└── workflows/
    └── resume-cache-integrity.md
```

## Installation
Requires Python 3.10+ and no third-party Python packages. Copy this directory intact.

## Configuration
`config/policy.json` defines required runtime-identity fields and exact-match behavior. Adapt field names only when the host has authoritative equivalents. Do not disable the non-empty-prefix or exact-byte invariants merely to obtain a passing result.

## Input format
Both baseline and resumed JSON documents contain:

```json
{
  "runtime_identity": {
    "provider": "provider-id",
    "model": "model-id",
    "toolset_hash": "sha256-or-version",
    "renderer_version": "renderer-version"
  },
  "prefix_segments": [
    {"name": "system", "content": "exact model-visible bytes as UTF-8 text"},
    {"name": "history-1", "content": "exact replay representation"}
  ]
}
```

The checker consumes content for comparison but prints only hashes, lengths, names, and first-difference location.

## Usage
```bash
python scripts/prefix_persistence_guard.py \
  --baseline baseline.json \
  --resumed resumed.json \
  --config config/policy.json
```

Exit codes: `0` exact same-runtime match; `2` mismatch or explicit rebaseline required; `3` invalid input.

Run deterministic tests:

```bash
python -m unittest tests/test_prefix_persistence_guard.py
```

## Workflow
Observe exact provider-boundary prefix -> measure current resume cache/token/TTFT baseline -> diagnose persistence/replay drift -> form a specific hypothesis -> repair -> measure again -> repeat only within three bounded repair attempts -> independently verify exact prefix integrity, cache metrics, and quality regressions.

## Metrics
- first-resumed-call input tokens
- cache creation/write tokens
- cache read/hit tokens and ratio
- resume time-to-first-token and total latency
- prefix hash match rate
- missing-prefix-state rate
- first-difference segment/byte distribution
- tokens/task and cost/task
- correctness/quality regression rate

## Verification
**Implemented:** deterministic checker, rules, audit skill, workflow, hook, tests, configuration, and independent verifier exist.

**Measured:** deployment-specific before/after provider/backend usage and latency evidence must be collected on representative long sessions.

**Verified:** unchanged-runtime resumed prefixes match exactly; provider/backend telemetry shows restored or materially improved cache reuse/latency; critical-context regression tests pass; no required context was removed to achieve the result.

## Safety
Prompt contents can contain sensitive data. Routine logs must emit only hashes, byte lengths, segment names, and indexes. Store baseline/resume inputs using the host's protected session mechanism and delete debugging copies according to local retention policy. Never weaken security, authorization, task constraints, or correctness context to reduce tokens.

## Failure handling
Detection: null/empty state, runtime-identity change, segment drift, byte drift, invalid manifest, or unexplained cache miss despite exact match. Evidence: retain non-secret manifest/hash data and provider usage metrics. Retry: input collection twice for transient failures, one provider-measurement retry for transport faults, at most three repair cycles total. Fallback: preserve full required context and accept availability/cost impact rather than dropping context; mark the run unverified. Escalation: prompt/persistence owner, then provider/performance owner if hashes match but cache misses persist. Stop: verified improvement, justified explicit rebaseline, correctness regression, or exhausted repair budget.

## Definition of Done
Research evidence documented; baseline captured; existing limitations/root cause identified; exact-prefix manifest persisted; resume preflight implemented; deterministic tests pass; before/after cache/token/latency metrics collected; critical-context quality tests pass; risks documented; independent verifier records Verified; no secrets are exposed; no blocking issue remains.

## Customization
Hosts may split the prefix into more granular segments to improve diagnosis, but segment order and exact bytes must reflect the actual provider request. Add runtime-identity dimensions when serialization behavior depends on additional adapters, protocol versions, or cache-control layouts.
