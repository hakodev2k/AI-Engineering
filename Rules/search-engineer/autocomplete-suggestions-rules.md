# Autocomplete and Suggestions

## Purpose
Keep typeahead, spelling, and query suggestions useful, safe, fast, and resistant to leakage.

## Scope
Prefix search, popular queries, spelling correction, suggestions, and query recommendations.

## MUST
- Apply content, privacy, tenancy, and policy filters before suggestions become visible.
- Define minimum evidence or confidence thresholds for behavior-derived suggestions.
- Keep suggestion latency within a separately measured interactive budget.
- Evaluate suggestions for harmful, sensitive, misleading, and low-quality completions.

## MUST NOT
- expose another user's private query history through suggestions.
- Promote rare sensitive queries merely because they exist in logs.
- Force spelling corrections when identifiers or domain terms may be intentional.

## SHOULD
- Offer reversible corrections or alternatives when intent is uncertain.
- Monitor zero-result and abandonment effects after suggestion changes.

## Exceptions
Exceptions require privacy/safety analysis, relevance evidence, and explicit approval where exposure risk exists.

## Verification
Use privacy tests, policy test sets, latency tests, suggestion-quality evaluation, and production monitoring.