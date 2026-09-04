# Localization Performance Rules

## Purpose
Keep internationalization features scalable without sacrificing correctness or locale coverage.

## Scope
Applies to locale data loading, translation catalogs, formatter creation, resource caching, font payloads, and localized rendering paths.

## MUST
- Performance changes to locale-aware code MUST preserve formatting and fallback correctness across representative locales.
- Translation and locale-data loading MUST define caching, invalidation, and failure behavior appropriate to deployment architecture.
- Large locale assets MUST be measured for startup, transfer, memory, and rendering impact before optimization claims are accepted.
- Formatter reuse or caching MUST be safe for the locale, timezone, currency, and option set that determine output.
- Performance regressions on critical localized journeys MUST be measured with the same production-relevant evidence used for source-locale journeys.

## MUST NOT
- Locale data, plural rules, script support, or translations MUST NOT be removed solely to reduce bundle size without confirming supported-locale requirements.
- A process-global formatter MUST NOT be reused across incompatible locale contexts.
- Performance improvements MUST NOT be claimed from intuition alone; before/after evidence is required.

## SHOULD
- Locale assets SHOULD be loaded on demand when this reduces cost without introducing visible fallback or availability defects.
- Font and catalog subsetting SHOULD be automated and validated against actual supported content.

## Exceptions
Exceptions require measurements, affected locales, correctness analysis, rollback strategy, and approval when user-visible support is reduced.

## Verification
Use bundle analysis, profiling, memory measurements, network traces, representative locale benchmarks, cold/warm cache tests, and correctness regression suites before and after changes.