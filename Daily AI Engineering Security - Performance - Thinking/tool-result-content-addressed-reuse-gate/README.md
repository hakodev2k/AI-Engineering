# Tool Result Content-Addressed Reuse Gate

## Topic
A reusable token-efficiency package that removes duplicate model-visible read-only tool payloads without skipping fresh tool execution.

## Category
Token

## Problem
Coding and agent runtimes can repeatedly read the same file/listing/diagnostics/search result and inject the full unchanged output again. This consumes tokens and context, raises cache-read/cost pressure, and can accelerate compaction. Execution caching is not a safe substitute because the world may have changed.

## Evidence
See `evidence/research.md`. Current independent signals include Docker Agent #3939 (2026-08-07), OpenAI Codex #33498 (2026-07-16), and Hermes Agent #84857 (2026-08-12), all reporting repeated unchanged reads/results and token/context waste. The evidence also shows compaction can invalidate dedup assumptions, so visibility must be tracked separately from content identity.

## Existing approach
Large-result truncation, provider prompt caching, model instructions, repeated-call suppression, execution caching, and reactive context compaction.

## Existing limitations
These approaches either retain duplicate context, risk stale observations, depend on probabilistic model behavior, or react only after context pressure has accumulated. A hash alone is insufficient after compaction if the original full payload is no longer visible to the model.

## Proposed improvement
Always execute eligible read-only tools. Hash the fresh result with tool identity and normalized arguments. Replace it with a short marker only when the output is identical, successful, explicitly read-only, economically worthwhile, and the earlier full payload is proven visible in the active context epoch. Context epoch changes invalidate visibility and force one full reinjection.

## Architecture
- `evidence/research.md` — observed evidence, gap, root causes, metrics.
- `config/policy.json` — eligibility, size, marker, and visibility policy.
- `skills/content-addressed-tool-result-reuse.md` — reusable measurement/implementation procedure.
- `rules/tool-result-reuse-rules.md` — enforceable correctness and token rules.
- `subagents/token-regression-verifier.md` — independent verifier.
- `workflows/measure-elide-verify.md` — bounded baseline/optimize/remeasure workflow.
- `hooks/post-tool-result-reuse-check.md` — post-execution, pre-context injection hook.
- `scripts/tool_result_reuse_gate.py` — deterministic full-vs-marker gate.
- `tests/test_tool_result_reuse_gate.py` — synthetic correctness regressions.

## Actual package tree
```text
tool-result-content-addressed-reuse-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-tool-result-reuse-check.md
├── rules/
│   └── tool-result-reuse-rules.md
├── scripts/
│   └── tool_result_reuse_gate.py
├── skills/
│   └── content-addressed-tool-result-reuse.md
├── subagents/
│   └── token-regression-verifier.md
├── tests/
│   └── test_tool_result_reuse_gate.py
└── workflows/
    └── measure-elide-verify.md
```

## Installation
Requires Python 3.11+ and only the Python standard library for the gate. Install `pytest` for the included test suite.

## Configuration
`eligible_read_only_tools` may be left empty to rely on an upstream explicit read-only annotation, or filled with a strict allowlist. Keep `require_explicit_read_only_annotation=true`, `never_elide_errors=true`, `invalidate_visibility_on_epoch_change=true`, and conservative marker economics unless measured evidence justifies a reviewed change.

## Usage
The application executes a tool normally, then builds a JSON envelope containing the fresh output and current visibility state:
```bash
python3 scripts/tool_result_reuse_gate.py result.json --policy config/policy.json
```
Exit `0` means emit the full payload and store/update `visibility_record`. Exit `10` means emit the returned reuse marker. Exit `2` means gate failure; fail safely to the full fresh result.

Run tests:
```bash
python3 -m pytest -q tests/test_tool_result_reuse_gate.py
```

## Workflow
Follow `workflows/measure-elide-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Integrate fresh-execution gate → Measure again → Force context lifecycle change → Independent verification → Complete.

## Metrics
Tokens/task; repeated-result bytes/tokens; emitted/saved bytes; reuse hit rate; tool execution count; full reinjections after epoch changes; context utilization; compaction count; latency/task; cost/task; task quality; false-elision count.

## Verification
**Implemented**: gate runs after tool execution and before context injection. **Measured**: the same representative workload has before/after telemetry. **Verified**: independent review confirms lower duplicate payload, unchanged fresh execution count, changed/error/side-effecting results remain full, context epoch changes force reinjection, and task quality does not regress.

## Safety
This is not an execution cache. It MUST NOT skip observations. It MUST NOT apply to side-effecting/unknown tools or errors. It MUST NOT reference an earlier payload after compaction/pruning/migration unless visibility is explicitly proven in the new epoch. When uncertain, emit the full fresh result.

## Failure handling
Detection: invalid decision, stale/false marker, quality regression, execution-count drop, or missing context lifecycle signal. Evidence: sanitized gate telemetry and benchmark traces. Retry policy: at most two diagnose/change/remeasure cycles. Fallback: disable elision for the affected tool or globally and emit full fresh output. Escalation: runtime/token-performance owner. Stop condition: any correctness regression or inability to prove visibility.

## Definition of Done
- Public evidence documented.
- Baseline duplicate token/byte volume captured.
- Eligible read-only tools identified.
- Fresh execution preserved.
- Gate integrated with context-epoch visibility.
- Changed/error/non-read-only fixtures remain full.
- Epoch change forces full reinjection.
- Tests pass.
- Before/after workload shows lower duplicate token/byte volume.
- Quality/regression checks pass.
- No false elision observed.
- Independent verifier marks `verified`.
- Risks documented and no blocking issue remains.

## Customization
Replace byte counts with provider-specific token counters, add durable telemetry, add per-tool canonicalizers, or integrate with runtime-native context epoch IDs. Do not canonicalize away meaningful output differences and do not promote inferred tool purity to trusted read-only status without explicit review.