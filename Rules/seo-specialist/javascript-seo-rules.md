# JavaScript SEO Rules
## Purpose
Ensure client-rendered applications expose stable, discoverable, meaningful search content.
## Scope
Rendering, routing, hydration, links, metadata, and dynamic content.
## MUST
- Verify critical content, links, canonical signals, and metadata in the rendered output available to crawlers.
- Use stable crawlable URLs for search-relevant application states.
- Test rendering changes with representative slow, failed, and crawler-like execution conditions.
## MUST NOT
- Require user-only interactions to reveal all critical indexable content.
- Ship client routing that returns misleading success pages for missing URLs.
## SHOULD
- Prefer rendering architectures that deliver important content reliably without unnecessary execution dependency.
## Exceptions
Highly interactive states need not be indexable when they have no independent search value.
## Verification
Rendered HTML inspection, crawler rendering, browser tests, server logs, and URL inspection.