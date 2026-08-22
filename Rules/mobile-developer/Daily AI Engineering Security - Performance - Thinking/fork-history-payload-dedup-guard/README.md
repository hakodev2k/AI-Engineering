# Fork History Payload Dedup Guard

## Category
Token

## Problem
Full-history forks can copy archival/superseded compaction snapshots and repeated inline image payloads into every child. This multiplies local storage, inherited context bytes/tokens, repeated processing, and request failure risk.

## Evidence
See `evidence/research.md`. Current reports include a ~468 MB failing fork replaying 20 historical compactions before WebSocket termination and an independent ~110 GiB multi-agent session tree where compacted records represented nearly all bytes in representative child rollouts.

## Existing approach
Agent runtimes compact context to keep model-visible history manageable and use full-history forks when a child needs parent context. Append-only rollout history also preserves audit/recovery state.

## Existing limitations
Archival rollout semantics and effective model-visible state can be conflated. Earlier compacted snapshots may be inherited even after later snapshots supersede them, and inline binary payloads may be copied repeatedly rather than referenced. Full-history defaults frequently lack byte/token preflight.

## Proposed improvement
Analyze parent history before a large fork. Quantify compaction and duplicate-payload amplification, project an effective context from the latest compacted state plus required suffix, enforce inherited byte/token budgets, and independently verify context quality before adopting a reduced fork policy.

## Architecture
```text
fork-history-payload-dedup-guard/
├── README.md
├── evidence/research.md
├── skills/fork-context-analysis.md
├── rules/fork-budget-rules.md
├── subagents/context-verifier.md
├── workflows/measure-optimize-verify.md
├── hooks/pre-fork-budget.md
├── scripts/fork_history_analyzer.py
└── tests/test_fork_history_analyzer.py
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into the orchestrator/runtime repository. The analyzer is read-only.

## Configuration
Choose a preflight threshold and maximum inherited-history byte budget based on runtime/model constraints. Example invocation with a 64 MiB budget:

`python scripts/fork_history_analyzer.py parent-rollout.jsonl --max-inherited-bytes 67108864`

`--large-string-bytes` controls when strings are content-hashed for duplicate-byte accounting; default is 256 KiB.

## Usage
Run the analyzer against a parent rollout before a large full-history fork. Exit `0` means the estimated effective projection is parseable and within the configured byte budget. Exit `1` blocks full-history fork creation. Exit `2` indicates invalid input or I/O failure.

The analyzer never rewrites history. It estimates an effective projection as the latest `compacted` record plus subsequent records when a compaction exists. Runtime integration must still preserve required semantics and pass independent context verification.

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → measure baseline → diagnose duplicate/superseded bytes → form projection hypothesis → implement selection/reference behavior outside canonical history → measure again → independent context verification → complete.

## Metrics
Track inherited bytes/fork, estimated tokens/fork from the runtime tokenizer when available, compacted bytes, superseded-compaction bytes, duplicate large-string bytes, child storage growth, fork latency, request reconnect/retry rate, task coverage, and quality regression rate.

## Verification
Run `python -m unittest tests/test_fork_history_analyzer.py`. Tests verify latest-compaction projection, duplicate large-string hashing, and fail-closed handling for invalid history. Runtime adoption additionally requires representative baseline-vs-optimized task evaluation.

## Safety
Canonical parent rollout files are never modified. Security instructions, permission/approval state, unresolved decisions, and correctness-critical constraints must not be removed merely to reduce tokens. Sensitive large payloads are represented in metrics by hashes and byte counts, not copied into reports.

## Failure handling
Detection: analyzer budget or parse failure, abnormal fork storage growth, or repeated request disconnects. Evidence: byte/type/hash metrics. Retry: maximum two optimization attempts, each with a changed hypothesis. Fallback: bounded recent-context fork only when required context is explicitly preserved. Escalation: human/runtime owner when safe reduction cannot meet budget. Stop: quality regression, unresolved required context, or two failed attempts.

## Definition of Done
**Implemented:** deterministic analyzer, rules, hook, workflow, and verifier exist. **Measured:** baseline and optimized inherited bytes/tokens/storage/latency are collected. **Verified:** effective context stays within budget, required-context checklist is complete, representative task quality remains within tolerance, retry/disconnect risk does not regress, and canonical history remains unchanged.

## Customization
Integrate an exact tokenizer for model-specific estimates, add content-addressed blob references where the runtime supports them, and enrich record-type detection for the host rollout schema. Keep all destructive repair paths outside this package and behind explicit human approval.