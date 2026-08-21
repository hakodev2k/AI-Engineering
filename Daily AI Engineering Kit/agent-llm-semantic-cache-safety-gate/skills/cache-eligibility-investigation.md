# Skill: Cache Eligibility Investigation

## Purpose
Determine whether an LLM request class can safely participate in semantic caching and identify every context dimension that can change the correct answer.

## When to use
Before adding semantic caching, after an authorization/model/tool change, or when investigating a suspicious cache hit.

## Inputs
Request path, system instructions, model configuration, tool definitions, authorization/tenant context, response schema, data classification, cache policy, representative prompts.

## Preconditions
Repository is readable; production writes are not required; sensitive samples are redacted or synthetic.

## Allowed tools
Repository search, tests, local scripts, logs with approved redaction, configuration readers, official provider documentation.

## Constraints
No production mutation, secret extraction, permission expansion, or policy weakening.

## Process
1. Locate the LLM call and every pre/post-processing step.
2. Trace all values that influence the answer: tenant, user scope, model, system prompt, tools, locale, schema, retrieval sources, feature flags and time-sensitive state.
3. Classify the operation as read-only or side-effect capable.
4. Identify sensitive inputs and whether they can reach the cache key or cached value.
5. Identify stale-answer tolerance and maximum defensible TTL.
6. Build positive equivalence examples and adversarial near-match examples.
7. Map each answer-affecting dimension to exact partitioning, bypass, or invalidation.
8. Run `scripts/semantic_cache_gate.py` against representative fixtures.
9. Record facts separately from hypotheses and unresolved questions.
10. Stop if safe equivalence cannot be demonstrated.

## Expected output
Eligibility decision, partition dimensions, bypass conditions, TTL recommendation, adversarial cases, evidence, unresolved risks.

## Verification
Every answer-affecting dimension is either exact-matched, explicitly irrelevant with evidence, or causes bypass.

## Failure handling
On missing authorization/tool/system-prompt context, mark ineligible rather than assuming equivalence. Tool/environment failures may be retried twice; preserve command/error evidence, then escalate.

## Stop conditions
Stop on uncertain cross-tenant behavior, side effects, unredacted sensitive data, missing required context, or approval-required policy weakening.
