# Research Authorization and Scope Rules

## Purpose
Ensure security research is performed only within explicit authority, with bounded objectives, documented targets, and controlled risk.

## Scope
Applies to vulnerability research, adversarial testing, protocol analysis, reverse engineering, fuzzing, exploit reproduction, and any activity that may affect systems, services, devices, data, or third parties.

## MUST
- Research MUST begin with documented authorization identifying the permitted systems, assets, accounts, environments, techniques, time window, and responsible owner.
- The researcher MUST distinguish in-scope assets from related but unauthorized dependencies, tenants, networks, domains, vendors, and third-party services.
- Ambiguous scope MUST be resolved before active testing continues.
- Research plans MUST identify foreseeable operational, privacy, legal, and security risks before intrusive techniques are used.
- Constraints imposed by the asset owner, program policy, contract, law, or coordinated-disclosure agreement MUST be treated as hard boundaries.
- Material scope changes MUST be documented and approved before execution.
- Where production assets are permitted, testing MUST use the least disruptive technique capable of producing adequate evidence.
- The researcher MUST preserve evidence showing the authorization and scope applicable at the time of testing.

## MUST NOT
- MUST NOT test assets merely because they are publicly reachable, technically related, discoverable through DNS, or owned by an affiliated organization.
- MUST NOT expand from an authorized target into an adjacent account, tenant, user, cloud subscription, supplier, or environment without explicit permission.
- MUST NOT bypass rate, safety, or data-access restrictions unless that action is specifically authorized.
- MUST NOT continue testing after authorization expires, is revoked, or becomes materially uncertain.
- MUST NOT interpret silence, implied interest, or historical permission as current authorization.

## SHOULD
- Scope definitions SHOULD use exact identifiers such as domain names, application IDs, repositories, IP ranges, tenant IDs, device models, or environment names where possible.
- High-risk techniques SHOULD be separately enumerated rather than covered by broad language.
- Research SHOULD favor isolated or non-production replicas when equivalent evidence can be obtained there.

## Exceptions
Emergency research outside normal scope requires an explicit legal or organizational mandate, documented necessity, identified authority, bounded duration, and post-action review. An AI agent MUST NOT infer such authority.

## Verification
Verify the authorization artifact, dates, target identifiers, approved techniques, exclusions, and owner approval before testing. During review, compare collected evidence and commands against the authorized scope and investigate every out-of-scope interaction.