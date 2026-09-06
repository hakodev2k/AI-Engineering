# Multilingual Model and Vendor Selection

## Purpose
Select models, translation providers, speech services, and related vendors using locale-specific evidence rather than global benchmark claims.

## When to use
Use before adopting or replacing a model/provider that affects multilingual product behavior.

## Inputs
Target locales, task requirements, quality thresholds, latency and cost budgets, privacy/security constraints, availability requirements, and candidate services.

## Preconditions
Representative evaluation data and procurement constraints are available.

## Context to inspect
Inspect current provider performance, production traffic distribution, failure history, data-processing terms, rate limits, regional hosting, supported scripts, and API contracts.

## Core knowledge
Vendor quality varies sharply by language, domain, and task. Published support does not imply production-grade quality. Senior selection balances semantic quality, safety, latency, cost, privacy, operational maturity, portability, and exit risk.

## Procedure
1. Define weighted requirements by locale and task.
2. Shortlist candidates that satisfy mandatory security and deployment constraints.
3. Run identical representative workloads per locale.
4. Measure task quality, severe error rate, latency, availability, and cost.
5. Test formatting, terminology, safety, and code-switching behavior.
6. Review data retention, regional processing, support, and change-notification terms.
7. Assess migration and fallback complexity.
8. Document trade-offs and recommendation with evidence.

## Decision points
Use a single provider when quality is consistently acceptable and operational simplicity dominates. Route by locale or task only when measurable gains justify added complexity and consistency risk.

## Common failure patterns
Choosing from English benchmarks, trusting marketing locale lists, ignoring rate limits, underpricing review costs, and creating provider lock-in without export or fallback plans.

## Verification
Reproduce benchmark results on held-out cases and confirm contractual plus technical constraints against the intended production configuration.

## Expected output
A provider decision record with locale-level evidence, trade-offs, risks, and fallback strategy.

## Stop conditions
Stop when critical privacy terms are unresolved or representative locale quality cannot be measured reliably.