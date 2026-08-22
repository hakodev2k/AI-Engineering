# Crawl Budget and Log Analysis

## Purpose
Use server evidence to understand search-engine crawling and reduce waste on large or rapidly changing sites.

## When to use
Use for large inventories, faceted navigation, crawl anomalies, slow discovery, or excessive duplicate URLs.

## Inputs
Server/CDN logs, URL inventory, crawl data, robots rules, sitemaps, response times, and indexation evidence.

## Context to inspect
Bot identity validation, status codes, parameters, directories, timestamps, response latency, redirects, and important URL groups.

## Core knowledge
Crawl demand and capacity vary. Log data shows requests, not indexation or rankings. Bot traffic must be validated before conclusions.

## Procedure
1. Define period and URL segments.
2. Validate legitimate search crawler traffic.
3. Normalize and classify requested URLs.
4. Measure crawl frequency, status codes, latency, and wasted patterns.
5. Compare crawl activity with business importance and sitemap membership.
6. Find traps, redirect chains, errors, and low-value parameter spaces.
7. Design safe controls through architecture, links, parameters, robots, or URL cleanup.
8. Measure post-change behavior.

## Decision points
Prefer eliminating unwanted URL generation over robots blocking when feasible; blocking can hide evidence without removing URLs.

## Common failure patterns
Counting spoofed bots, treating crawl frequency as ranking, blocking before diagnosing, and analyzing aggregate logs without segments.

## Verification
Compare before/after logs, crawlability, discovery of important URLs, and error rates.

## Expected output
Segmented crawl findings, root causes, prioritized remediation, and measured results.

## Stop conditions
Stop if logs contain sensitive data requiring additional authorization.