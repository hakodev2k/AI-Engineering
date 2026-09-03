# Context Window and Token Budget Routing

## Purpose
Route requests according to context size, expected output length, token economics, and truncation risk.

## When to use
Use when candidate models differ in context limits, token pricing, output ceilings, or long-context quality.

## Inputs
Prompt size, attachments, retrieved context, expected output, model context/output limits, tokenizer behavior, prices.

## Context to inspect
Prompt construction, retrieval expansion, tool schemas, conversation history, truncation logic, provider token accounting, and long-context evaluations.

## Core knowledge
Nominal context limits do not guarantee equal quality near the limit. Routing should reserve output and tool-call headroom, estimate tokens using the correct tokenizer or conservative approximation, and distinguish capacity from demonstrated long-context quality.

## Procedure
1. Calculate or estimate total input tokens including hidden/system/tool content.
2. Reserve required output and operational headroom.
3. Eliminate models that cannot fit the request safely.
4. Apply task-specific long-context quality thresholds.
5. Compare total expected token cost among eligible models.
6. Consider compression or retrieval reduction before escalating solely for context capacity.
7. Record truncation/compression decisions.
8. Test boundary sizes around every model limit.

## Decision points
Compress context when relevance can be preserved; choose a larger-context model when omission risk is greater than added cost; reject when no compliant model can process required evidence intact.

## Common failure patterns
Ignoring tool-schema tokens, reserving no output budget, relying on character counts, silent truncation, and assuming larger context means better reasoning.

## Verification
Verify tokenizer calculations, boundary tests, no silent truncation, and quality on representative long-context cases.

## Expected output
A token-aware routing policy with headroom rules, overflow behavior, and tested context boundaries.

## Stop conditions
Stop when required evidence cannot fit any eligible route without unsafe information loss.