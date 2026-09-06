# Speculative Decoding Rules

## Purpose
Improve autoregressive decoding performance without compromising output correctness or introducing uncontrolled latency variance.

## Scope
Draft models, acceptance criteria, verification models, token proposals, rollback, and decoding compatibility.

## MUST
- Speculative decoding MUST preserve the target model's defined output distribution within the algorithm's correctness guarantees.
- Draft and target model compatibility assumptions MUST be explicit.
- Acceptance rate, latency, throughput, and quality impact MUST be measured on representative traffic.
- Fallback to standard decoding MUST be available when speculative execution is unsupported or unstable.
- Resource accounting MUST include draft-model memory and compute overhead.

## MUST NOT
- MUST NOT report speculative speedup without including verifier cost.
- MUST NOT use incompatible tokenizers or sampling semantics without validated transformation logic.
- MUST NOT conceal output changes caused by altered decoding semantics.

## SHOULD
- Segment measurements by sequence length and sampling configuration.
- Prefer adaptive use when benefit depends strongly on request characteristics.

## Exceptions
Alternative speculative methods require correctness evidence, bounded rollout, and approval.

## Verification
Inspect distribution checks, benchmark reports, fallback tests, tokenizer compatibility tests, and resource profiles.