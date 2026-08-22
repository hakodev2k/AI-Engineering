# Skill: Azure Architecture Design

**Purpose:** turn workload requirements into an Azure design with explicit trade-offs.
**Trigger:** new workload, modernization, migration, scale/reliability redesign.
**Inputs:** users, traffic, data classification, RTO/RPO, regions, dependencies, budget, compliance, existing platform.
**Preconditions:** business objective and workload owner are known.
**Steps:**
1. Capture functional and quality requirements.
2. Map identity, network, compute, storage/data, messaging, integration, observability, backup, and DR needs.
3. Identify constraints and hard dependencies.
4. Generate viable options; avoid naming one service without alternatives when trade-offs matter.
5. Evaluate availability, scaling, latency, operability, security, cost, lock-in, and migration complexity.
6. Select the smallest architecture meeting current constraints plus credible near-term growth.
7. Document decisions, rejected options, assumptions, and validation plan.
**Output:** architecture decision set and deployment boundaries.
**Quality:** every major service has rationale, owner, failure mode, and observability path.
**Stop:** unresolved compliance, identity, data residency, or budget authority.
