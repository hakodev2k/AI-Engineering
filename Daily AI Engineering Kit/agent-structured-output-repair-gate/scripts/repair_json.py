#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

def main():
    p=argparse.ArgumentParser(description="Conservative deterministic JSON envelope repair")
    p.add_argument("--input",required=True); p.add_argument("--output",required=True)
    a=p.parse_args(); text=pathlib.Path(a.input).read_text(encoding="utf-8").strip()
    # Only remove one complete Markdown JSON fence. Never invent fields or values.
    m=re.fullmatch(r"```(?:json)?\s*\n([\s\S]*?)\n```",text,re.I)
    if m: text=m.group(1).strip()
    try: value=json.loads(text)
    except json.JSONDecodeError as e:
        print(f"deterministic repair refused: {e}",file=sys.stderr); return 1
    pathlib.Path(a.output).write_text(json.dumps(value,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return 0
if __name__=="__main__": raise SystemExit(main())
