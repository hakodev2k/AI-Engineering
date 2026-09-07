# Safety Post-Training

## Purpose
Tune safer model behavior while preserving legitimate helpfulness, avoiding blanket refusals, and making safety boundaries consistent across contexts.

## When to use
Use when post-training must improve harmful-request handling, policy compliance, safe completion quality, or robustness near policy boundaries. Do not treat safety tuning as a substitute for system-level authorization or external guardrails.

## Inputs
Safety policy, risk taxonomy, allowed/disallowed behavior examples, adversarial prompts, benign lookalikes, refusal and safe-completion demonstrations, base-model safety metrics, and product requirements.

## Preconditions
Policy owners have resolved major ambiguity and critical risk categories have independent evaluation coverage.

## Context to inspect
Review base refusal rate, over-refusal slices, jailbreak behavior, multilingual policy coverage, multi-turn attacks, tool-use implications, domain-specific exceptions, and interaction between model tuning and runtime guardrails.

## Core knowledge
Safety behavior is a boundary-learning problem. Training only explicit harmful prompts often teaches lexical shortcuts; training only refusals produces over-refusal. Strong safety tuning contrasts harmful cases with benign near-neighbors and teaches safe alternatives where useful. Safety must be evaluated under adversarial, multilingual, multi-turn, and indirect contexts because aggregate refusal accuracy is insufficient.

## Procedure
1. Translate policy into behavioral categories with concrete allow/refuse/safe-complete examples.
2. Establish base-model safety and helpfulness baselines by category.
3. Build contrastive datasets containing harmful prompts and benign lookalikes.
4. Include safe-completion demonstrations where partial assistance is allowed.
5. Add adversarial transformations: obfuscation, role-play, indirection, multilingual variants, and multi-turn escalation.
6. Balance severe rare risks without making them dominate ordinary interactions.
7. Train conservatively and evaluate after intermediate checkpoints.
8. Measure both unsafe compliance and unnecessary refusal.
9. Audit response rationale/style for information leakage or accidental harmful detail.
10. Test interactions with tool use, retrieval, and system instructions.
11. Compare tuned behavior with external guardrail behavior to avoid contradictory enforcement.
12. Run red-team and regression suites before release.
13. Document known residual risks and deployment mitigations.

## Decision points
Use model tuning for broad behavioral priors; use deterministic/runtime controls for permissions and high-consequence actions. Prefer safe completion over refusal when policy permits useful bounded assistance. Tighten a category only when measured risk outweighs helpfulness loss.

## Common failure patterns
Keyword-based refusals; excessive refusal tone; policy leakage; safety improvements limited to English; regressions after preference optimization; training on unrealistic jailbreaks only; assuming a judge model shares the same policy interpretation.

## Verification
Verify unsafe-compliance rate, over-refusal rate, severity-weighted failures, adversarial robustness, multilingual consistency, multi-turn behavior, and preservation of benign capabilities. Require independent review of critical failures.

## Expected output
A safety-tuned checkpoint with category-level evaluation, over-refusal analysis, red-team results, residual-risk register, and deployment recommendations.

## Stop conditions
Stop if policy ambiguity affects critical examples, safety gains require unacceptable benign refusal, adversarial failures worsen materially, or evaluation cannot distinguish allowed from disallowed behavior reliably.