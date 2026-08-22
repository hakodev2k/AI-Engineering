# Prompt Cache Stability Profiler

## Category
Performance

## Problem
Large agent prompts can be cacheable yet still suffer silent cache misses because supposedly stable prefixes change between turns/sessions. Tiny volatile fields, ordering changes, history reserialization, hook context mutation, or cache-policy timing can force large prefixes to be processed again.

## Evidence
See `evidence/research.md` for 2026 VS Code/Claude Code reports and VS Code's official Cache Explorer documentation.

## Existing approach
Providers expose prompt caching and some hosts expose cache telemetry/debug views. Teams often reduce prompt size or manually inspect token usage after costs rise.

## Existing limitations
Context-size measurement does not reveal byte/structure drift. Cache misses from prefix mutation, TTL expiry, and breakpoint behavior are easily conflated, and request assembly regressions often lack automated tests.

## Proposed improvement
Treat cacheability as a regression-tested contract. Declare static request segments, fingerprint them across equivalent runs, identify the earliest divergence, separate structural drift from TTL/provider behavior, and gate unexplained changes.

## Architecture
```text
sanitized request dumps
  -> static/dynamic segment declaration
  -> deterministic segment fingerprints
  -> earliest-divergence detector
  -> drift classification
  -> provider cache/token metrics
  -> regression gate
  -> independent verification
```

## Actual package tree
```text
prompt-cache-stability-profiler/
├── README.md
├── evidence/research.md
├── skills/profile-cache-stability.md
├── rules/cache-stability-rules.md
├── subagents/cache-regression-verifier.md
├── workflows/cache-regression-investigation.md
├── hooks/pre-complete-cache-regression.md
├── scripts/cache_stability_profiler.py
└── tests/test_cache_stability_profiler.py
```

## Installation
Python 3.9+ only; no third-party dependency is required for the profiler/tests.

## Configuration
Choose top-level request-dump segments expected to remain stable for an equivalent workload, for example `system` and `tools`. Keep provider TTL/breakpoint expectations in host-specific documentation; do not bake them into the fingerprint.

## Usage
```bash
python scripts/cache_stability_profiler.py compare \
  --baseline baseline.json \
  --current current.json \
  --static system tools \
  --fail-on-drift
```
The report contains hashes and divergence paths, not raw prompt content.

## Workflow
Follow `workflows/cache-regression-investigation.md`: baseline → fingerprint → locate drift → classify → minimal fix → repeat measure → independent verify.

## Metrics
Track static-prefix stability rate, cache-read ratio, uncached/cache-creation input tokens, latency, and result-quality regression. Cost may be calculated only when accurate provider pricing/usage telemetry is available.

## Verification
```bash
python tests/test_cache_stability_profiler.py
```
Then run at least three equivalent real workloads before and after the change. A structural pass alone does not prove provider cache usage; use provider telemetry where available.

## Safety
Sanitize request dumps. Never remove security controls, required tool schemas, task instructions, or correctness-critical history just to improve cache hit rate.

## Failure handling
Malformed or unsanitized dumps fail the profiler. Missing telemetry limits claims to structural stability. Three unsuccessful root-cause hypotheses stop the workflow and preserve evidence for escalation.

## Definition of Done
- Current evidence documented.
- Static segments explicitly defined.
- Baseline captured across repeated equivalent runs.
- Earliest accidental divergence identified or static stability proven.
- Change is minimal and does not remove required context.
- Unit tests pass.
- Repeated structural checks pass.
- Provider cache/token/latency metrics improve when telemetry is available.
- Independent verifier confirms no quality/security regression.

## Customization
Add host-specific segment extraction or provider telemetry adapters, but keep raw content out of reports and preserve the rules in `rules/cache-stability-rules.md`.
