# Compaction State Continuity Contract

**Category:** Token

## Problem
Automatic context compaction can replace model history while application or project state remains logically active. If deduplication assumes "already sent" means "still present," durable context can disappear after compaction. The opposite failure also occurs: re-injecting large static instruction registries in full after compaction can refill the window and trigger compaction thrashing.

## Evidence
See `evidence/research.md`. Fresh August 2026 signals include an open Codex issue where unchanged `additionalContext` disappears after automatic compaction, an open Codex proposal for structured loss-aware checkpoints, and open Claude Code reports where large re-injected project/agent instructions refill the context shortly after compaction.

## Existing approach
Automatic summarization/compaction, per-turn context deduplication, project-instruction reinjection, manual clear/compact controls, and product-specific continuation summaries.

## Existing limitations
Compaction creates a new effective context epoch, invalidating "already emitted" assumptions. Blind full reinjection preserves information but can destroy token savings and prompt-cache efficiency. Unstructured summaries may omit operational state or failed-attempt rationale.

## Proposed improvement
Use an epoch-aware continuity contract: every replacement context receives a stable epoch ID; durable active context is rehydrated once per epoch regardless of ordinary-turn deduplication; a bounded structured checkpoint preserves active goal, constraints, decisions, failed approaches and next action; a bounded raw operational tail remains lossless; token budgets prevent reinjection thrash.

## Architecture

```text
compaction-state-continuity-contract/
├── README.md
├── evidence/research.md
├── config/budget.json
├── schemas/checkpoint.schema.json
├── scripts/checkpoint_guard.py
├── tests/test_checkpoint_guard.py
├── skills/compaction-continuity-analysis.md
├── rules/compaction-contract.md
├── subagents/continuity-verifier.md
├── workflows/compact-rehydrate-verify.md
└── hooks/post-compaction.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
`config/budget.json` defines checkpoint and rehydration budgets. Budgets protect efficiency but MUST NOT permit deletion of correctness-critical active constraints.

## Usage

```bash
python scripts/checkpoint_guard.py \
  --before before.json \
  --after after.json \
  --checkpoint checkpoint.json \
  --policy config/budget.json
```

Exit `0` means continuity and budget checks pass; exit `3` blocks continuation.

## Workflow
Observe context → measure baseline tokens/state → select complete operation boundary → build bounded checkpoint → install replacement context → rehydrate durable active state for the new epoch → validate continuity and budget → independently verify → continue.

## Metrics
- durable-context recall after compaction
- checkpoint tokens / pre-compaction tokens
- rehydrated static tokens per new epoch
- compactions per 10 turns
- turns until next compaction
- repeated file/tool inspection after compaction
- continuation success/regression rate
- prompt-cache read/write behavior when available

## Verification

```bash
python -m unittest tests/test_checkpoint_guard.py
```

## Safety
Never remove active security constraints, authorization boundaries, or required task instructions merely to save tokens. Preserve tool-call/result pairing. Never continue from a partially installed checkpoint.

## Failure handling
Validation failure leaves the prior context authoritative when possible and blocks continuation into an incomplete replacement context. Maximum rebuild attempts: 1; then fall back to the platform's stable compaction path or escalate.

## Definition of Done
**Implemented:** epoch-aware rehydration, checkpoint validation, bounded tail, and hook are integrated.  
**Measured:** before/after token and continuity metrics are captured.  
**Verified:** active state survives compaction, token budgets are respected without critical context loss, fixtures pass, and independent reviewer confirms replay/resume consistency.

## Customization
Classify context by lifetime (`durable`, `epoch`, `turn`) and criticality. Adjust budgets only with continuation-quality and token measurements.