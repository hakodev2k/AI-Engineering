# Skill: Network and Private Connectivity

**Purpose:** design safe Azure connectivity and name resolution.
**Trigger:** VNet integration, private endpoint, hybrid connectivity, ingress/egress change, DNS issue.
**Steps:** establish traffic sources/destinations → classify ports/protocols → inspect address space and routing → map NSG/firewall/WAF controls → design DNS resolution → assess private endpoint dependencies → validate return path and egress → test from representative clients.
**Decisions:** public vs private ingress, hub-spoke vs direct connectivity, centralized vs workload-specific egress, DNS zone ownership.
**Constraints:** no overlapping address assumptions; no public exposure without approval; shared DNS/route changes must be serialized.
**Output:** connectivity matrix, control points, test evidence, rollback.
