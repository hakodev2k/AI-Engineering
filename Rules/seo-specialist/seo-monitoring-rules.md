# SEO Monitoring Rules
## Purpose
Detect material search visibility failures early and distinguish incidents from normal variance.
## Scope
Traffic, indexation, crawling, templates, rankings, sitemaps, and search features.
## MUST
- Monitor critical organic KPIs and technical health at a frequency appropriate to business risk.
- Define thresholds or anomaly logic for material drops and route alerts to named owners.
- Correlate alerts with releases, crawling, indexation, analytics health, and external search changes before concluding cause.
## MUST NOT
- Treat every ranking fluctuation as an incident.
- Suppress recurring alerts without resolving or explicitly accepting their cause.
## SHOULD
- Segment monitoring by template, market, device, brand/non-brand, and business criticality where useful.
## Exceptions
Low-risk sites may use less frequent monitoring when recovery cost is low.
## Verification
Alert history, dashboard health, synthetic checks, Search Console data, server logs, and incident records.