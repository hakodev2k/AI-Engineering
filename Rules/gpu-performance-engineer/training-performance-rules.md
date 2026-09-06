# Training Performance Rules

## Purpose
Improve accelerator utilization and training throughput without invalidating optimization behavior or convergence.

## Scope
Step time, microbatching, gradient accumulation, optimizer execution, activation checkpointing, dataloading, and distributed training.

## MUST
- Training optimization MUST measure end-to-end step time and accelerator utilization on representative runs.
- Throughput changes MUST be evaluated with equivalent effective batch size and optimization semantics.
- Activation checkpointing, accumulation, or recomputation changes MUST quantify memory and compute trade-offs.
- Dataloader starvation MUST be ruled out before treating low GPU utilization as a device bottleneck.
- Performance changes MUST preserve required convergence and numerical behavior.

## MUST NOT
- MUST NOT compare training throughput across materially different sequence lengths, batch semantics, or precision modes without disclosure.
- MUST NOT sacrifice convergence evidence for faster benchmark steps.
- MUST NOT increase parallelism beyond communication or memory limits without scale testing.

## SHOULD
- SHOULD report samples, tokens, or other meaningful work units per second.
- SHOULD profile representative steady-state intervals after warm-up.

## Exceptions
Exceptions require documented benchmark constraints and training-owner approval.

## Verification
Review training traces, utilization, step-time breakdowns, convergence checks, and scale tests.