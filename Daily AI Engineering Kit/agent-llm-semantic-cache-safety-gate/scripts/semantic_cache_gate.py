#!/usr/bin/env python3
import argparse, hashlib, json, math, re, sys, time
from pathlib import Path

WORD_RE = re.compile(r"[a-z0-9_]+", re.I)
SECRET_RE = re.compile(r"(?i)(authorization\s*:|bearer\s+[A-Za-z0-9._~+/-]{12,}|api[_-]?key\s*[=:]|password\s*[=:]|secret\s*[=:]|token\s*[=:])")
PII_RE = re.compile(r"(?i)(\b\d{3}-\d{2}-\d{4}\b|\b(?:\d[ -]*?){13,19}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})")

def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))
def tokens(s): return set(WORD_RE.findall(s.lower()))
def similarity(a,b):
    x,y=tokens(a),tokens(b)
    if not x or not y: return 0.0
    return len(x & y) / math.sqrt(len(x)*len(y))
def digest(s): return hashlib.sha256(s.encode()).hexdigest()
def deny(reason, evidence=None): return {"decision":"bypass","reason":reason,"evidence":evidence or []}

def main():
    ap=argparse.ArgumentParser(description="Fail-closed semantic-cache eligibility and hit gate")
    ap.add_argument("--request", required=True); ap.add_argument("--entries", required=True); ap.add_argument("--policy", required=True)
    ap.add_argument("--out", default="semantic-cache-decision.json")
    args=ap.parse_args()
    try: req, entries, policy=load(args.request), load(args.entries), load(args.policy)
    except Exception as e: print(f"input error: {e}", file=sys.stderr); return 2
    required=["purpose","tenant","auth_scope","model","system_prompt_hash","toolset_hash","schema_version","prompt"]
    missing=[k for k in required if not req.get(k)]
    if missing: result=deny("missing-required-context", missing)
    elif len(req["prompt"]) > policy["max_prompt_chars"]: result=deny("prompt-too-large")
    elif req["purpose"] not in policy["allowed_purposes"]: result=deny("purpose-not-allowlisted")
    elif policy["deny_if_tool_calls_expected"] and req.get("expects_tool_calls",False): result=deny("tool-call-capable-request")
    elif policy["deny_if_secret_like_data_detected"] and SECRET_RE.search(req["prompt"]): result=deny("secret-like-data")
    elif policy["deny_if_personal_data_detected"] and PII_RE.search(req["prompt"]): result=deny("personal-data")
    elif policy["deny_if_mutation_intent_detected"] and any(re.search(r"\b"+re.escape(t)+r"\b",req["prompt"],re.I) for t in policy["mutation_terms"]): result=deny("mutation-intent")
    else:
        now=int(time.time()); candidates=[]
        for e in entries:
            if now-int(e.get("created_at",0)) > policy["max_entry_age_seconds"]: continue
            exact=[("tenant","require_exact_tenant"),("auth_scope","require_exact_auth_scope"),("model","require_exact_model"),("system_prompt_hash","require_exact_system_prompt_hash"),("toolset_hash","require_exact_toolset_hash"),("schema_version","require_exact_schema_version"),("locale","require_exact_locale")]
            if any(policy.get(flag,False) and e.get(field)!=req.get(field,"en" if field=="locale" else None) for field,flag in exact): continue
            score=similarity(req["prompt"],e.get("prompt",""))
            if score >= policy["similarity_threshold"]: candidates.append((score,e))
        if not candidates: result={"decision":"miss","reason":"no-safe-match","request_hash":digest(req["prompt"])}
        else:
            score,e=max(candidates,key=lambda x:x[0])
            result={"decision":"hit","reason":"safe-match","similarity":round(score,6),"entry_id":e.get("id"),"response":e.get("response"),"request_hash":digest(req["prompt"])}
    Path(args.out).write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps(result,ensure_ascii=False))
    return 0 if result["decision"] in ("hit","miss","bypass") else 3
if __name__=="__main__": raise SystemExit(main())
