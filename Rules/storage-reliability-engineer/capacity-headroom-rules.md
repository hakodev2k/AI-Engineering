# Capacity and Headroom Rules

## Purpose
Prevent capacity exhaustion from causing outages, rebalance storms, or unsafe recovery.

## Scope
Applies to usable capacity, metadata limits, inode/object counts, write amplification, and reserved recovery headroom.

## MUST
- Forecast capacity using growth rate, retention, replication overhead, and failure recovery needs.
- Maintain explicit headroom thresholds for normal operation and degraded recovery.
- Alert before capacity pressure threatens compaction, rebuild, or quorum behavior.

## MUST NOT
- Plan against raw device capacity instead of usable capacity.
- Consume emergency recovery headroom for routine growth without approval.
- Treat average utilization as sufficient when hotspots or skew can exhaust individual nodes.

## SHOULD
- Model multiple growth scenarios and seasonal peaks.
- Automate capacity reporting with ownership and forecast dates.

## Exceptions
Temporary headroom reductions require risk assessment, expiry, mitigation, and approval.

## Verification
Review capacity models, node-level utilization, forecast accuracy, and recovery-space tests.