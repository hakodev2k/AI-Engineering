# Privacy and Security Rules
## Purpose
Ensure SEO tooling and recommendations do not expose sensitive information or weaken security controls.
## Scope
Crawlers, analytics, logs, query data, staging sites, access, and public search exposure.
## MUST
- Treat query, URL, log, and analytics data according to applicable privacy and retention requirements.
- Verify that staging, preview, private, and sensitive content cannot become publicly discoverable through SEO changes.
- Use least-privilege access for search, analytics, crawling, and publishing tools.
- Require authorized approval before weakening authentication, access controls, or security headers for SEO reasons.
## MUST NOT
- Put secrets, personal data, private identifiers, or authentication tokens into indexable URLs or SEO reports unnecessarily.
- Disable security controls merely to make crawling easier.
## SHOULD
- Redact sensitive URL parameters and datasets in shared reports.
## Exceptions
Access to sensitive diagnostics requires documented need, authorized access, and appropriate handling controls.
## Verification
Permission review, URL samples, robots/index checks, log/report inspection, and security review for exceptional changes.