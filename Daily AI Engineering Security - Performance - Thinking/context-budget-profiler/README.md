# Context Budget Profiler

## Category
Token

## Problem
Modern coding-agent sessions can consume substantial fixed context before the task starts because of tool schemas, MCP servers, plugins, skills, project instructions, and duplicated metadata. Built-in views do not always provide enough source-level attribution to decide what can be deferred or deduplicated safely.

## Evidence
See `evidence/research.md` for current signals from OpenAI Codex repository guidance and 2026 Codex/Claude Code issues covering context bounds, deferred MCP loading, fixed metadata overhead, and context accounting.

## Proposed improvement
Use a deterministic profiler to inventory context fragments, estimate their relative token cost, identify exact normalized duplicates and hotspots, classify required content, and require before/after plus representative-task verification before any optimization is accepted.

## Architecture
1. Export context fragments into a JSON inventory.
2. `scripts/context_profiler.py` validates and profiles the inventory.
3. `skills/profile-context-budget.md` defines the investigation procedure.
4. `rules/token-budget-rules.md` prevents unsafe token-only optimization.
5. `workflows/measure-optimize-verify.md` enforces baseline → hypothesis → remeasure → regression verification.
6. `hooks/pre-context-budget-check.md` provides a CI/pre-change gate.
7. `subagents/context-verifier.md` independently checks the claim.

## Package tree
```text
context-budget-profiler/
├── README.md
├── evidence/research.md
├── skills/profile-context-budget.md
├── rules/token-budget-rules.md
├── subagents/context-verifier.md
├── workflows/measure-optimize-verify.md
├── hooks/pre-context-budget-check.md
└── scripts/context_profiler.py
```

## Installation
Python 3.9+; no third-party dependencies.

## Inventory format
```json
[
  {
    "name": "project-instructions",
    "source": "repo",
    "kind": "instructions",
    "text": "...",
    "required": true
  },
  {
    "name": "database-mcp-tools",
    "source": "mcp:database",
    "kind": "tool-schema",
    "text": "...",
    "required": false
  }
]
```

## Usage
```bash
python scripts/context_profiler.py context-inventory.json > report.json
```

The built-in estimator uses UTF-8 byte length divided by four, rounded up. It is intentionally deterministic for relative comparisons and MUST NOT be represented as an exact provider tokenizer or billed-token count.

## Workflow
Capture an unchanged baseline, profile sources/hotspots/duplicates, classify required vs conditional material, form one bounded optimization hypothesis, create a candidate inventory, remeasure with the same estimator, run representative tasks, and obtain independent verification.

## Metrics
- Estimated fixed tokens before the task.
- Tokens by source/kind.
- Required-token share.
- Exact normalized duplicate groups.
- Largest fragment sizes.
- Candidate savings percentage.
- Representative-task regression rate.
- Cache/latency/compaction metrics where the host exposes them.

## Verification
A token reduction is `Measured` only when before/after reports use the identical estimator and complete inventories. It is `Verified` only when required fragments remain and representative regression tasks pass the project's quality threshold.

## Safety
Never remove security, authorization, approval, correctness, or compliance instructions merely to meet a budget. Unknown relevance is not safe-to-remove. Prefer host-supported deferred loading over destructive prompt deletion.

## Failure handling
Invalid or incomplete inventories stop analysis. Failed optimization hypotheses leave the baseline unchanged. A hotspot may be retried with at most two distinct optimization hypotheses per run.

## Definition of Done
- Current evidence documented.
- Baseline inventory captured.
- Every fragment has source/kind attribution.
- Required fragments explicitly marked.
- Before/after reports use the same estimator.
- Savings, duplicate reduction, and regression results measured.
- No required security/correctness context is lost.
- Independent verifier reports `verified`.

## Customization
Replace the estimator with an exact tokenizer when the target model/provider exposes a stable one, but keep the estimator version in every report. Add project-specific source categories, budget thresholds, and regression suites without weakening the mandatory rules.
