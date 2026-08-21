# Preflight Hook

**Trigger:** before investigation or implementation involving an external hostname.

**Preconditions:** repository root; Python 3.9+; configured `config/policy.json`; explicit host list.

**Action:** `python scripts/dns_gate.py --policy config/policy.json --output dns-evidence.json <host...>`

**Expected result:** exit 0 and evidence status `verified` for baseline-safe resolution, or a structured failed artifact identifying affected hosts.

**Failure behavior:** exit 1 blocks readiness claims and routes to investigation; exit 2 blocks execution as invalid configuration/input. Never auto-edit DNS/network configuration.

**Blocking:** yes for readiness/completion claims; a failed baseline may continue only into diagnosis.
