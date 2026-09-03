# Sandbox and Experiment Environments

## Purpose
Provide safe, reproducible environments where teams can test models, prompts, agents, and retrieval workflows without exposing production data, credentials, or capacity.

## When to use
Use when enabling rapid AI experimentation, notebooks, prototypes, or pre-production validation across multiple teams.

## Inputs
- Approved model/provider list
- Data classifications
- Identity and access controls
- Budget limits
- Environment isolation requirements

## Context to inspect
Inspect developer workflows, notebook platforms, local tooling, test data, secrets, network egress, production dependencies, cleanup practices, and experiment cost patterns.

## Core knowledge
Experiment velocity and governance are not opposites. Good sandboxes make safe behavior easy by default: synthetic or approved data, scoped credentials, capped budgets, isolated networks, reproducible dependencies, and expiration of temporary resources.

## Procedure
1. Define experiment environment classes and intended use.
2. Separate sandbox identity and resources from production.
3. Provide approved test datasets or synthetic-data workflows.
4. Restrict access to production systems and sensitive stores.
5. Issue scoped credentials and provider quotas.
6. Provide reproducible runtime images or dependency specifications.
7. Capture experiment configuration and model versions.
8. Add cost caps and automatic resource expiration.
9. Provide paths to promote validated artifacts into managed environments.
10. Detect and block accidental production credentials or secrets.
11. Test network and data-isolation boundaries.
12. Monitor adoption and common bypasses.

## Decision points
Use shared sandboxes for low-risk workloads and isolated environments for sensitive or high-resource experiments. Allow internet egress only when required and controlled.

## Common failure patterns
Production keys in notebooks, copied sensitive datasets, orphaned GPU resources, irreproducible local environments, prototypes becoming production services, and unlimited provider spend.

## Verification
Verify environment isolation, credential scope, data-access boundaries, cost caps, cleanup automation, and reproducibility using representative experiments.

## Expected output
A documented experimentation environment with safe defaults, quotas, isolation, reproducibility, and a promotion path.

## Stop conditions
Stop when required experiment data lacks approved handling rules or sandbox isolation cannot prevent access to protected production resources.