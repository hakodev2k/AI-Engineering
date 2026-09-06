# Locale-Specific Safety Evaluation

## Purpose
Evaluate whether AI safety behavior remains effective across languages, dialects, scripts, euphemisms, transliteration, and code-switching.

## When to use
Use before launching a locale, after policy or model changes, or when abuse appears concentrated in non-English traffic.

## Inputs
Safety policy, target locales, abuse taxonomy, model configuration, prompt stack, moderation systems, and red-team examples.

## Preconditions
Safety owners have defined prohibited and allowed behaviors.

## Context to inspect
Inspect system prompts, moderation models, blocklists, policy translations, incident reports, appeals, and locale-specific slang or obfuscation patterns.

## Core knowledge
Safety controls often degrade outside high-resource languages. Attackers may exploit transliteration, mixed scripts, homographs, dialects, or code-switching. Equivalent policy intent may require different wording and examples by locale.

## Procedure
1. Map policy categories to locale-relevant expressions.
2. Build benign and adversarial cases using native language patterns.
3. Include transliteration, spelling variation, code-switching, and obfuscation.
4. Test both model behavior and upstream/downstream moderation.
5. Measure false positives and false negatives separately.
6. Review severe misses with safety and locale experts.
7. Add regression cases for validated failures.
8. Re-run after model, policy, or moderation changes.

## Decision points
Prefer broader blocking only when harm severity justifies user-impact costs. Use model, classifier, rule, or human-review controls according to risk and locale performance.

## Common failure patterns
Direct policy translation, English-only red teaming, ignoring dialects, relying on keyword blocks, and treating false positives as harmless.

## Verification
Critical policy categories meet locale-specific thresholds and known bypass patterns are covered by regression tests.

## Expected output
A locale safety scorecard with tested attacks, failure modes, mitigations, and residual risks.

## Stop conditions
Stop and escalate when a high-severity locale bypass remains reproducible or policy interpretation lacks authoritative ownership.