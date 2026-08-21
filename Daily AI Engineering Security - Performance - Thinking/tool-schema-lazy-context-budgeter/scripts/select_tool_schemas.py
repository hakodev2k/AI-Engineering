#!/usr/bin/env python3
"""Measure and select tool schemas under a configurable context budget.

Input JSON:
{
  "task": "create a GitHub issue",
  "tools": [{"name":"...","description":"...","inputSchema":{...}}],
  "recent_tools": ["..."]
}
Token estimation uses a deterministic chars/4 approximation unless --chars-per-token is changed.
Exit: 0 selection produced, 2 invalid input, 3 budget cannot fit required core tools.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path


def load(path: Path):
    try: value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain an object")
    return value


def estimate(value, cpt):
    text=json.dumps(value,ensure_ascii=False,separators=(",",":"))
    return max(1, int((len(text)+cpt-1)//cpt))


def words(text):
    return {w for w in re.findall(r"[a-z0-9_./-]+", text.lower()) if len(w)>=3}


def main():
    p=argparse.ArgumentParser(); p.add_argument("input",type=Path); p.add_argument("--config",type=Path,required=True); p.add_argument("--chars-per-token",type=int,default=4)
    a=p.parse_args()
    try:
        if a.chars_per_token<=0: raise ValueError("chars-per-token must be > 0")
        d,c=load(a.input),load(a.config)
        task=d.get("task"); tools=d.get("tools"); recent=d.get("recent_tools",[])
        if not isinstance(task,str) or not isinstance(tools,list) or not isinstance(recent,list): raise ValueError("task string, tools list, recent_tools list required")
        normalized=[]; names=set()
        for i,t in enumerate(tools):
            if not isinstance(t,dict) or not isinstance(t.get("name"),str) or not t["name"]: raise ValueError(f"tools[{i}] invalid")
            if t["name"] in names: raise ValueError(f"duplicate tool {t['name']}")
            names.add(t["name"]); normalized.append(t)
        total=sum(estimate(t,a.chars_per_token) for t in normalized)
        count_threshold=int(c.get("activate_lazy_loading_when_tool_count_at_least",10)); token_threshold=int(c.get("activate_lazy_loading_when_schema_tokens_at_least",5000))
        lazy=len(normalized)>=count_threshold or total>=token_threshold
        budget=int(c.get("max_full_schema_tokens_per_request",6000)); max_tools=int(c.get("max_selected_tools",12)); core=set(c.get("core_tools",[])); recent_set=set(str(x) for x in recent)
        if not lazy and c.get("fallback_include_all_when_under_budget",True): selected=normalized; reasons={t["name"]:"all-tools-under-threshold" for t in selected}
        else:
            task_words=words(task); scored=[]
            for t in normalized:
                hay=" ".join([t.get("name",""), t.get("description","")]); overlap=len(task_words & words(hay))
                score=overlap*int(c.get("keyword_match_boost",3)) + (int(c.get("recent_tool_boost",2)) if t["name"] in recent_set else 0) + (100000 if t["name"] in core else 0)
                scored.append((score,t["name"],t))
            scored.sort(key=lambda x:(-x[0],x[1]))
            selected=[]; reasons={}; used=0
            for score,name,t in scored:
                cost=estimate(t,a.chars_per_token)
                required=name in core
                if required and used+cost>budget:
                    print(json.dumps({"decision":"blocked","error":f"core tool {name} exceeds remaining schema budget"}),file=sys.stderr); return 3
                if len(selected)>=max_tools and not required: continue
                if used+cost>budget and not required: continue
                if score<=0 and not required: continue
                selected.append(t); used+=cost; reasons[name]="core" if required else ("recent/relevance" if score>0 else "selected")
            if not selected and normalized:
                cheapest=min(normalized,key=lambda t:estimate(t,a.chars_per_token)); cost=estimate(cheapest,a.chars_per_token)
                if cost<=budget: selected=[cheapest]; reasons[cheapest["name"]]="safe-fallback-cheapest"
        selected_tokens=sum(estimate(t,a.chars_per_token) for t in selected)
        compact_chars=int(c.get("compact_description_chars",160))
        catalog=[{"name":t["name"],"description":str(t.get("description",""))[:compact_chars]} for t in normalized]
        result={"decision":"lazy" if lazy else "all","tool_count":len(normalized),"all_schema_tokens_est":total,"selected_schema_tokens_est":selected_tokens,"saved_schema_tokens_est":max(0,total-selected_tokens),"selected_tools":[t["name"] for t in selected],"reasons":reasons,"compact_catalog":catalog}
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,ensure_ascii=False)); return 0

if __name__=="__main__": raise SystemExit(main())
