# Infrastructure Analysis
## Purpose
Analyze adversary infrastructure while controlling false associations.
## Scope
Domains, IPs, certificates, hosting, DNS, registration, and network relationships.
## MUST
- Timestamp infrastructure observations and preserve supporting evidence.
- Distinguish ownership, control, hosting, resolution, and mere co-location.
- Require multiple meaningful relationships before expanding a malicious cluster.
## MUST NOT
- Mark shared hosting or CDN infrastructure malicious solely by adjacency.
- Treat historical resolution as current control.
## SHOULD
- Use temporal and behavioral pivots to reduce coincidence-driven clustering.
## Exceptions
Weak associations may be retained as leads if labeled unconfirmed and excluded from blocking.
## Verification
Review graph edges, timestamps, provenance, enrichment, and false-positive analysis.