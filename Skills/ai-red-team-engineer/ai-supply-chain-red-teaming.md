# AI Supply Chain Red Teaming

## Purpose
Assess risks introduced by external models, datasets, adapters, prompts, packages, plugins, tools, and AI service providers.

## When to use
Use during vendor adoption, model upgrades, dependency changes, fine-tuning, plugin/tool onboarding, and incident investigation.

## Inputs
Dependency inventory, provider contracts, model/data provenance, package manifests, integration architecture, update policy, and trust requirements.

## Context to inspect
Identify externally controlled artifacts, update channels, signatures/hashes, credentials, network access, fallback providers, and data sent to third parties.

## Core knowledge
AI supply chains can introduce poisoned models/data, compromised packages, malicious plugins, provider behavior changes, provenance gaps, and unexpected data retention. Controls must address both integrity and operational dependency.

## Procedure
1. Inventory AI-specific and conventional dependencies.
2. Classify each by trust, privilege, update mechanism, and data access.
3. Verify provenance and integrity controls where available.
4. Test malicious or malformed provider/tool responses in isolation.
5. Test behavior when model versions or schemas change.
6. Evaluate dependency compromise blast radius.
7. Review credential scope and outbound data minimization.
8. Validate rollback, pinning, and fallback procedures.
9. Record residual third-party risks and owners.

## Decision points
Pin versions when reproducibility and safety outweigh rapid upgrades. Isolate high-privilege plugins and require stronger provenance for components that can execute actions.

## Common failure patterns
Silent model upgrades; unpinned packages; trusting provider output; broad plugin permissions; no inventory of fine-tuning data or adapters; fallback that bypasses controls.

## Verification
Demonstrate integrity checks, bounded permissions, safe failure on malformed dependencies, and tested rollback for critical components.

## Expected output
A prioritized AI supply-chain risk assessment with controls and verification evidence.

## Stop conditions
Escalate when provenance is unknown for high-privilege components or contractual/provider constraints prevent required assurance.