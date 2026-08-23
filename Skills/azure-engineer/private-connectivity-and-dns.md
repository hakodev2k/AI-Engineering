# Private Connectivity and DNS

## Purpose
Implement reliable private access to Azure PaaS services and make name resolution predictable across Azure, hybrid networks, and multiple VNets.

## When to use
Use for Private Link, private endpoints, hybrid DNS, PaaS network isolation, or incidents where names resolve differently across networks.

## Inputs
Services, VNets, DNS zones, on-premises DNS servers, resolvers, required public/private behavior, and connectivity flows.

## Context to inspect
Inspect private endpoints, private DNS zones, VNet links, Azure DNS Private Resolver, custom DNS settings, conditional forwarders, public DNS, and service network configuration.

## Core knowledge
A private endpoint changes the network path but applications still depend on DNS mapping service names to private IPs. Split-horizon resolution and forwarding chains must be designed explicitly.

## Procedure
1. Trace the exact hostname used by each client.
2. Determine required private DNS zone names for the Azure service.
3. Map which VNets and on-premises clients need resolution.
4. Create/link private zones or integrate them with the existing DNS authority.
5. Configure inbound/outbound resolver endpoints and forwarding rules when hybrid resolution is needed.
6. Create private endpoints in correctly sized subnets.
7. Disable or restrict public access only after private resolution works.
8. Test resolution and TCP/TLS connectivity from every relevant network class.
9. Document ownership and lifecycle of endpoint DNS records.

## Decision points
Use Azure-managed private zones for straightforward Azure estates; integrate with enterprise DNS when centralized policy and hybrid clients require it. Do not disable public access before all required clients have a working private path.

## Common failure patterns
Creating endpoints without DNS, linking zones to the wrong VNets, stale manually managed A records, circular forwarding, assuming local developer resolution matches production, and mixing service endpoints with Private Link expectations.

## Verification
Resolve service FQDNs from Azure and hybrid clients, confirm returned IPs and routing, test TLS hostnames, and verify public access is blocked when intended.

## Expected output
A documented private-connectivity and DNS configuration with deterministic resolution and validated client paths.

## Stop conditions
Stop when DNS authority is unclear, required network paths are unavailable, or disabling public access would strand unverified consumers.