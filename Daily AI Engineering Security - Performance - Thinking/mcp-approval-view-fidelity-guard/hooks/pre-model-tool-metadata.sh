#!/usr/bin/env sh
set -eu
# Host hook: block unreviewable or unapproved MCP metadata before it enters model context.
# Usage: pre-model-tool-metadata.sh descriptor.json approval.json server-id
DESCRIPTOR=${1:?descriptor.json required}
APPROVAL=${2:?approval.json required}
SERVER=${3:?server identity required}
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 "$ROOT/scripts/mcp_descriptor_guard.py" verify "$DESCRIPTOR" "$APPROVAL" --server "$SERVER"
