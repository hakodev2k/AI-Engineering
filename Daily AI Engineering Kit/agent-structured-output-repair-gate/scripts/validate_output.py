#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, re, sys

SENSITIVE = re.compile(r"password|secret|token|api[_-]?key|authorization", re.I)

def fail(msg):
    print(msg, file=sys.stderr); return 2

def main():
    p=argparse.ArgumentParser(description="Strict JSON structured-output validator")
    p.add_argument("--input", required=True); p.add_argument("--schema", required=True)
    p.add_argument("--max-bytes", type=int, default=1048576); p.add_argument("--report")
    a=p.parse_args(); ip=pathlib.Path(a.input); sp=pathlib.Path(a.schema)
    if not ip.is_file() or not sp.is_file(): return fail("input/schema file missing")
    raw=ip.read_bytes()
    if len(raw)>a.max_bytes: return fail("input exceeds byte limit")
    text=raw.decode("utf-8", errors="strict").strip()
    errors=[]
    if text.startswith("```") or text.endswith("```"): errors.append("markdown fences are forbidden")
    try: data=json.loads(text)
    except json.JSONDecodeError as e: data=None; errors.append(f"invalid JSON: line {e.lineno} column {e.colno}: {e.msg}")
    try: schema=json.loads(sp.read_text(encoding="utf-8"))
    except Exception as e: return fail(f"invalid schema: {e}")
    if data is not None:
        try:
            import jsonschema
            for e in sorted(jsonschema.Draft202012Validator(schema).iter_errors(data), key=lambda x:list(x.path)):
                errors.append(f"schema {list(e.path)}: {e.message}")
        except ImportError: return fail("dependency missing: pip install jsonschema")
        def walk(v,path="$"):
            if isinstance(v,dict):
                for k,x in v.items():
                    if SENSITIVE.search(str(k)): errors.append(f"sensitive field name rejected: {path}.{k}")
                    walk(x,f"{path}.{k}")
            elif isinstance(v,list):
                for i,x in enumerate(v): walk(x,f"{path}[{i}]")
        walk(data)
    report={"valid":not errors,"sha256":hashlib.sha256(raw).hexdigest(),"errors":errors}
    out=json.dumps(report,indent=2)
    if a.report: pathlib.Path(a.report).write_text(out+"\n",encoding="utf-8")
    print(out)
    return 0 if not errors else 1
if __name__=="__main__": raise SystemExit(main())
