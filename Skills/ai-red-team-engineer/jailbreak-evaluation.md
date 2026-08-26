# Jailbreak Evaluation

## Purpose
Evaluate resistance to attempts that manipulate an AI system into violating behavioral, safety, or product policies.

## When to use
Use before releases, after model/prompt changes, and when new jailbreak families emerge. Separate policy robustness testing from prompt-injection testing when their threat models differ.

## Inputs
Behavior policy, model configuration, system instructions, moderation layers, baseline evaluations, and authorized attack taxonomy.

## Context to inspect
Determine which controls are model-native versus application-enforced, how conversation state is retained, and whether outputs can cause external side effects.

## Core knowledge
Jailbreaks exploit instruction conflicts, role play, indirection, decomposition, encoded requests, context accumulation, refusal suppression, and policy ambiguity. Robustness must be measured across attack families and benign controls.

## Procedure
1. Translate policy into observable pass/fail criteria.
2. Establish benign and straightforward harmful baselines.
3. Create diverse attack families rather than paraphrase-only sets.
4. Test single-turn and multi-turn escalation.
5. Vary language, encoding, framing, and context length.
6. Score policy compliance, over-refusal, consistency, and severity.
7. Cluster failures by root cause.
8. Apply mitigations and rerun the unchanged holdout set.
9. Promote stable cases into continuous evaluation.

## Decision points
Prefer policy-layer or architectural fixes for systematic failures; prompt edits may be appropriate for narrow instruction ambiguity. Balance attack resistance against false refusals on legitimate use.

## Common failure patterns
Optimizing against a public benchmark; leaking the test set into prompts; measuring only refusal rate; ignoring partial harmful assistance; changing tests after mitigation.

## Verification
Require reproducible improvement on held-out adversarial cases with no unacceptable regression on benign utility and no new bypass through alternate modalities or turns.

## Expected output
Versioned evaluation evidence, failure clusters, severity assessment, and mitigation recommendations.

## Stop conditions
Escalate when policy intent is ambiguous, evaluation would require prohibited real-world harm, or a critical bypass affects deployed users.