# Crawlability Rules
## Purpose
Ensure search crawlers can reliably discover and request intended public content.
## Scope
Robots controls, navigation, sitemaps, status codes, and crawl paths.
## MUST
- Maintain crawlable internal paths to pages intended for search discovery.
- Validate robots.txt changes against affected URL patterns before release.
- Return accurate HTTP status codes for available, redirected, missing, and failed resources.
## MUST NOT
- Block resources required to understand primary page content without documented reason.
- Use robots.txt as a mechanism to remove already indexed sensitive URLs from search.
## SHOULD
- Keep XML sitemaps limited to canonical, indexable URLs and monitor processing errors.
## Exceptions
Crawl restrictions are valid for deliberate capacity, security, staging, or duplicate-control reasons when their indexing consequences are understood.
## Verification
Crawler tests, robots testing, server logs, sitemap reports, and URL inspection.