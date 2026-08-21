# Rules — Prompt Cache Stability

## MUST
- MUST measure a baseline before modifying prompt assembly.
- MUST distinguish static-prefix drift from provider TTL expiry or provider-side cache behavior.
- MUST fingerprint declared-static request segments across repeated equivalent runs.
- MUST report the earliest divergence in a declared-static segment.
- MUST preserve correctness-critical context even when it reduces cacheability.
- MUST treat ordering as significant unless the provider/request schema guarantees semantic equivalence and canonicalization is under host control.
- MUST sanitize request dumps before storing or sharing them.
- MUST verify improvements with repeated runs and cache/token telemetry when available.
- MUST record intentional baseline changes explicitly.

## MUST NOT
- MUST NOT claim a cache improvement from lower prompt size alone.
- MUST NOT remove security, tool schemas, instructions, or required history merely to improve hit rate.
- MUST NOT mutate historical messages/tool results after they become part of a cacheable prefix unless unavoidable and measured.
- MUST NOT place per-turn timestamps, random IDs, session paths, git status, or other volatile fields inside a segment declared static without justification.
- MUST NOT hide a regression by resetting the baseline automatically.
- MUST NOT infer provider cache hits solely from latency.

## SHOULD
- SHOULD use deterministic serialization and stable list ordering where semantics allow.
- SHOULD isolate dynamic metadata after stable cache breakpoints where provider APIs permit it.
- SHOULD monitor cache-read ratio and cache-creation/uncached tokens per turn.
- SHOULD keep provider TTL and breakpoint behavior in configuration rather than hard-coded assumptions.
- SHOULD gate host/extension upgrades using a representative request-dump regression corpus.
