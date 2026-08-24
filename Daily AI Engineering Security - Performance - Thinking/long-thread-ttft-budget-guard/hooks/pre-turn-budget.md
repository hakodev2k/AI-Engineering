# Hook — Pre-Turn Size/Latency Budget

## Trigger
Before submitting another turn to a long-running thread.

## Preconditions
A current snapshot JSON exists with `history_bytes` and optionally `estimated_input_tokens` / recent `ttft_ms`.

## Action
Run `python scripts/ttft_profiler.py gate --snapshot <path> --warn-bytes <n> --block-bytes <n> --ttft-slo-ms <n>`.

## Expected result
Exit 0 PASS, exit 1 WARN, exit 2 BLOCK.

## Failure behavior
BLOCK prevents adding non-essential bulk context; the host must choose a correctness-preserving migration or explicit human override. Invalid input exits 3 and also blocks automated completion.

## Blocks completion
Only BLOCK/ERROR states block automated continuation.
