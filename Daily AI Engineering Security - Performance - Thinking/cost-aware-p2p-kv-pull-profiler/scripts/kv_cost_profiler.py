#!/usr/bin/env python3
import argparse, csv, json, math, statistics, sys
from collections import defaultdict
from pathlib import Path

REQUIRED = {"mode","prefix_tokens","dest_load","topology","model","hardware","latency_ms","success"}

def load_rows(path):
    rows = []
    with Path(path).open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not REQUIRED.issubset(set(reader.fieldnames or [])):
            missing = sorted(REQUIRED - set(reader.fieldnames or []))
            raise ValueError("missing columns: " + ",".join(missing))
        for line, r in enumerate(reader, 2):
            try:
                mode = r["mode"].strip().lower()
                if mode not in {"pull","recompute"}: raise ValueError("mode")
                rows.append({
                    "mode": mode,
                    "prefix_tokens": int(r["prefix_tokens"]),
                    "dest_load": float(r["dest_load"]),
                    "topology": r["topology"].strip(),
                    "model": r["model"].strip(),
                    "hardware": r["hardware"].strip(),
                    "latency_ms": float(r["latency_ms"]),
                    "success": r["success"].strip().lower() in {"1","true","yes"}
                })
                if rows[-1]["prefix_tokens"] <= 0 or rows[-1]["latency_ms"] < 0: raise ValueError("nonpositive measurement")
            except Exception as exc:
                raise ValueError(f"invalid row {line}: {exc}")
    return rows

def fit_linear(points):
    if len(points) < 2: return None
    xs = [p[0] for p in points]; ys = [p[1] for p in points]
    xm, ym = statistics.fmean(xs), statistics.fmean(ys)
    denom = sum((x-xm)**2 for x in xs)
    if denom == 0: return {"intercept_ms": ym, "slope_ms_per_token": 0.0}
    slope = sum((x-xm)*(y-ym) for x,y in zip(xs,ys)) / denom
    return {"intercept_ms": ym - slope*xm, "slope_ms_per_token": slope}

def percentile(values, q):
    if not values: return None
    s = sorted(values); pos = (len(s)-1)*q; lo = math.floor(pos); hi = math.ceil(pos)
    if lo == hi: return s[lo]
    return s[lo]*(hi-pos) + s[hi]*(pos-lo)

def analyze(rows, min_samples=3):
    groups = defaultdict(lambda: {"pull": [], "recompute": []})
    for r in rows:
        key = (r["model"], r["hardware"], r["topology"], r["dest_load"])
        groups[key][r["mode"]].append(r)
    output = []
    for key, modes in sorted(groups.items(), key=lambda x: str(x[0])):
        model, hardware, topology, load = key
        good_pull = [r for r in modes["pull"] if r["success"]]
        good_rec = [r for r in modes["recompute"] if r["success"]]
        failed_rate = (sum(not r["success"] for r in modes["pull"]) / len(modes["pull"])) if modes["pull"] else 1.0
        record = {"model":model,"hardware":hardware,"topology":topology,"dest_load":load,
                  "pull_samples":len(modes["pull"]),"recompute_samples":len(modes["recompute"]),"failed_pull_rate":failed_rate}
        if len(good_pull) < min_samples or len(good_rec) < min_samples:
            record["status"] = "insufficient_evidence"; output.append(record); continue
        pf = fit_linear([(r["prefix_tokens"], r["latency_ms"]) for r in good_pull])
        rf = fit_linear([(r["prefix_tokens"], r["latency_ms"]) for r in good_rec])
        denom = rf["slope_ms_per_token"] - pf["slope_ms_per_token"]
        crossover = None if denom <= 0 else max(0.0, (pf["intercept_ms"] - rf["intercept_ms"]) / denom)
        record.update({"status":"measured","pull_model":pf,"recompute_model":rf,
                       "crossover_prefix_tokens":None if crossover is None else round(crossover),
                       "pull_p95_ms":percentile([r["latency_ms"] for r in good_pull],0.95),
                       "recompute_p95_ms":percentile([r["latency_ms"] for r in good_rec],0.95)})
        output.append(record)
    return output

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv_path"); ap.add_argument("--min-samples", type=int, default=3)
    args = ap.parse_args()
    if args.min_samples < 2: print("--min-samples must be >=2", file=sys.stderr); return 2
    try:
        result = analyze(load_rows(args.csv_path), args.min_samples)
    except Exception as exc:
        print(str(exc), file=sys.stderr); return 2
    print(json.dumps({"segments": result}, indent=2, sort_keys=True))
    return 0 if result and all(r["status"] == "measured" for r in result) else 3

if __name__ == "__main__":
    raise SystemExit(main())
