# Localized Routing and SEO Rules

## Purpose
Make localized web content discoverable without creating ambiguous, duplicate, or unstable URLs.

## Scope
Applies to locale URLs, routing, canonical links, alternate-language metadata, redirects, sitemaps, and indexable localized content.

## MUST
- Public localized URLs MUST follow a stable locale-routing policy and MUST resolve each supported variant deterministically.
- Canonical and alternate-language metadata MUST reflect actual equivalent content and supported locale targets.
- Locale redirects MUST preserve deep-link intent and MUST avoid redirect loops.
- Search-indexable localized pages MUST expose the intended language and regional variant accurately.
- Locale removal or URL restructuring MUST include an approved redirect and deindexing strategy.

## MUST NOT
- Geo-IP detection MUST NOT permanently override an explicit user locale choice.
- Multiple localized URLs MUST NOT claim conflicting canonicals for the same content set.
- Unsupported locale routes MUST NOT return misleading success pages in an unrelated language when a clear fallback or not-found behavior is required.

## SHOULD
- Locale selectors SHOULD use crawlable, durable links where appropriate.
- Sitemaps SHOULD represent supported localized variants consistently with routing metadata.

## Exceptions
Exceptions require documented SEO/product rationale, affected routes, migration impact, and verification evidence.

## Verification
Inspect route maps, response status codes, redirects, canonical and alternate tags, sitemaps, locale persistence, crawler-visible HTML, and representative deep links.