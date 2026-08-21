#!/usr/bin/env python3
"""Audit and select MCP/tool schemas under a context budget.

Input catalog: JSON array or {"tools": [...]}; each tool should contain name and may
contain description, inputSchema/input_schema, outputSchema/output_schema.

Exit codes: 0 pass, 2 budget/selection policy violation, 3 invalid input, 4 I/O error.
The script is read-only and never contacts external services.
"""
from __future__ import annotations
import argparse, json, math, re, sys
from pathlib import Path

WORD_RE = re.compile(r"[A-Za-z0-9_./:-]+")


def load_json(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        print(f"error: cannot read {path}: {e}", file=sys.stderr)
        raise SystemExit(4)


def tools_from(data):
    tools = data.get("tools") if isinstance(data, dict) else data
    if not isinstance(tools, list):
        print("error: catalog must be an array or object with tools[]", file=sys.stderr)
        raise SystemExit(3)
    out = []
    for i, tool in enumerate(tools):
        if not isinstance(tool, dict) or not isinstance(tool.get("name"), str):
            print(f"error: tools[{i}] requires string name", file=sys.stderr)
            raise SystemExit(3)
        out.append(tool)
    return out


def compact_tool(tool, ignored):
    clone = dict(tool)
    for f in ignored:
        clone.pop(f, None)
    return clone


def estimate_tokens(obj):
    text = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    # Conservative dependency-free approximation; hosts should replace with the
    # provider tokenizer when exact accounting is available.
    return max(1, math.ceil(len(text.encode("utf-8")) / 3.6))


def terms(text):
    return {x.lower() for x in WORD_RE.findall(text or "") if len(x) > 1}


def tool_text(tool):
    return " ".join([
        tool.get("name", ""), tool.get("description", ""),
        json.dumps(tool.get("inputSchema", tool.get("input_schema", {})), ensure_ascii=False),
    ])


def lexical_score(query, tool):
    q = terms(query)
    t = terms(tool_text(tool))
    if not q or not t:
        return 0.0
    inter = len(q & t)
    # Favors overlap while mildly penalizing enormous tool descriptions.
    return inter / math.sqrt(len(q) * len(t))


def audit(tools, ignored):
    rows = []
    for t in tools:
        c = compact_tool(t, ignored)
        rows.append({"name": t["name"], "estimated_tokens": estimate_tokens(c)})
    rows.sort(key=lambda x: x["estimated_tokens"], reverse=True)
    return {"tool_count": len(rows), "estimated_schema_tokens": sum(r["estimated_tokens"] for r in rows), "tools": rows}


def select_tools(tools, query, cfg, required):
    ignored = set(cfg.get("ignored_schema_fields", []))
    pinned = set(cfg.get("pinned_tools", [])) | set(required)
    known = {t["name"] for t in tools}
    missing = sorted(pinned - known)
    if missing:
        return None, {"error": "required tools absent from catalog", "missing": missing}
    scored = sorted(((lexical_score(query, t), t) for t in tools), key=lambda x: (-x[0], x[1]["name"]))
    chosen, names, used = [], set(), 0
    target = int(cfg.get("target_schema_tokens", cfg.get("max_schema_tokens", 8000)))
    hard = int(cfg.get("max_schema_tokens", 8000))
    max_tools = int(cfg.get("max_selected_tools", 12))
    threshold = float(cfg.get("min_retrieval_score", 0.0))

    # Required/pinned first. They may exceed the target but not the hard budget.
    by_name = {t["name"]: t for t in tools}
    for name in sorted(pinned):
        t = by_name[name]
        tok = estimate_tokens(compact_tool(t, ignored))
        chosen.append((1.0, t, tok, "pinned")); names.add(name); used += tok

    for score, t in scored:
        if t["name"] in names or len(chosen) >= max_tools or score < threshold:
            continue
        tok = estimate_tokens(compact_tool(t, ignored))
        if used + tok > target and chosen:
            continue
        chosen.append((score, t, tok, "retrieved")); names.add(t["name"]); used += tok

    report = {
        "query": query,
        "selected_count": len(chosen),
        "catalog_count": len(tools),
        "estimated_schema_tokens": used,
        "hard_budget": hard,
        "target_budget": target,
        "selected": [{"name": t["name"], "score": round(s, 4), "estimated_tokens": tok, "reason": why} for s,t,tok,why in chosen],
        "required_tools": sorted(pinned),
        "required_tool_recall": 1.0 if pinned <= names else (len(pinned & names) / len(pinned) if pinned else 1.0),
    }
    if used > hard:
        report["error"] = "hard token budget exceeded by required/pinned selection"
    elif not chosen and tools:
        report["error"] = "no tools selected; use bounded fallback or explicit required tools"
    return [t for _,t,_,_ in chosen], report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("catalog")
    ap.add_argument("--config", default=str(Path(__file__).parents[1] / "config" / "tool-budget.json"))
    ap.add_argument("--query", default="")
    ap.add_argument("--required", action="append", default=[])
    ap.add_argument("--mode", choices=["audit", "select"], default="audit")
    ap.add_argument("--output")
    args = ap.parse_args()
    cfg = load_json(args.config)
    tools = tools_from(load_json(args.catalog))
    ignored = set(cfg.get("ignored_schema_fields", []))

    if args.mode == "audit":
        report = audit(tools, ignored)
        report["max_schema_tokens"] = int(cfg.get("max_schema_tokens", 8000))
        ok = report["estimated_schema_tokens"] <= report["max_schema_tokens"]
        report["status"] = "pass" if ok else "over-budget"
        print(json.dumps(report, indent=2, ensure_ascii=False))
        return 0 if ok else 2

    if not args.query.strip():
        print("error: --query is required in select mode", file=sys.stderr)
        return 3
    selected, report = select_tools(tools, args.query, cfg, args.required)
    ok = selected is not None and "error" not in report
    report["status"] = "pass" if ok else "blocked"
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if args.output and selected is not None:
        try:
            Path(args.output).write_text(json.dumps({"tools": selected}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        except OSError as e:
            print(f"error: cannot write output: {e}", file=sys.stderr)
            return 4
    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
