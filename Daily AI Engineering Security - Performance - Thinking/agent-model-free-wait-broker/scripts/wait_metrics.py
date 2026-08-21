#!/usr/bin/env python3
import argparse, json, sys

WAIT_TOOLS = {"wait", "wait_agent", "status", "write_stdin", "poll", "wait_status"}


def read_jsonl(path):
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as e:
                raise ValueError(f"invalid JSONL at line {i}: {e}")
    return rows


def analyze(rows):
    model_turns = [r for r in rows if r.get("type") == "model_turn"]
    wait_only = []
    for r in model_turns:
        tools = r.get("tool_calls") or []
        names = [str(t.get("name", "")).lower() for t in tools if isinstance(t, dict)]
        if names and all(n in WAIT_TOOLS for n in names) and not r.get("decision") and not r.get("action"):
            wait_only.append(r)
    total_in = sum(int(r.get("input_tokens", 0) or 0) for r in model_turns)
    wait_in = sum(int(r.get("input_tokens", 0) or 0) for r in wait_only)
    total_out = sum(int(r.get("output_tokens", 0) or 0) for r in model_turns)
    wait_out = sum(int(r.get("output_tokens", 0) or 0) for r in wait_only)
    broker = [r for r in rows if r.get("type") == "broker_event"]
    lags = [float(r["detection_lag_seconds"]) for r in broker if r.get("detection_lag_seconds") is not None]
    return {
        "model_turns": len(model_turns),
        "wait_only_model_turns": len(wait_only),
        "wait_only_turn_ratio": (len(wait_only) / len(model_turns)) if model_turns else 0.0,
        "total_input_tokens": total_in,
        "wait_only_input_tokens": wait_in,
        "wait_only_input_token_ratio": (wait_in / total_in) if total_in else 0.0,
        "total_output_tokens": total_out,
        "wait_only_output_tokens": wait_out,
        "broker_events": len(broker),
        "max_detection_lag_seconds": max(lags) if lags else None,
        "avg_detection_lag_seconds": (sum(lags) / len(lags)) if lags else None
    }


def main():
    p = argparse.ArgumentParser(description="Measure wait-only model inference")
    p.add_argument("trace")
    p.add_argument("--json-out")
    args = p.parse_args()
    try:
        result = analyze(read_jsonl(args.trace))
        text = json.dumps(result, indent=2, sort_keys=True)
        print(text)
        if args.json_out:
            with open(args.json_out, "w", encoding="utf-8") as f:
                f.write(text + "\n")
        return 0
    except (OSError, ValueError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
