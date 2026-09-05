#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any


def sha(b: bytes) -> str: return hashlib.sha256(b).hexdigest()
def err(path, code, message): return {"path": path, "code": code, "message": message}

def validate(value: Any, schema: dict, path: str = "$") -> list[dict]:
    out=[]; typ=schema.get("type")
    checks={"object":dict,"array":list,"string":str,"number":(int,float),"integer":int,"boolean":bool,"null":type(None)}
    if typ in checks and (not isinstance(value,checks[typ]) or (typ in ("number","integer") and isinstance(value,bool))):
        return [err(path,"type",f"expected {typ}")]
    if "enum" in schema and value not in schema["enum"]: out.append(err(path,"enum",f"value not in {schema['enum']}"))
    if isinstance(value,dict):
        props=schema.get("properties",{}); req=schema.get("required",[])
        for k in req:
            if k not in value: out.append(err(path+"."+k,"required","missing required property"))
        if schema.get("additionalProperties") is False:
            for k in value:
                if k not in props: out.append(err(path+"."+k,"additionalProperties","unexpected property"))
        for k,v in value.items():
            if k in props: out.extend(validate(v,props[k],path+"."+k))
    if isinstance(value,list) and isinstance(schema.get("items"),dict):
        for i,v in enumerate(value): out.extend(validate(v,schema["items"],f"{path}[{i}]"))
    if isinstance(value,str):
        if "minLength" in schema and len(value)<schema["minLength"]: out.append(err(path,"minLength",f"minimum length {schema['minLength']}"))
    if isinstance(value,(int,float)) and not isinstance(value,bool):
        if "minimum" in schema and value<schema["minimum"]: out.append(err(path,"minimum",f"minimum {schema['minimum']}"))
        if "maximum" in schema and value>schema["maximum"]: out.append(err(path,"maximum",f"maximum {schema['maximum']}"))
    return out

def main():
    p=argparse.ArgumentParser(); p.add_argument("--input",required=True,type=Path); p.add_argument("--schema",required=True,type=Path); p.add_argument("--report",required=True,type=Path); a=p.parse_args()
    try:
        raw=a.input.read_bytes(); data=json.loads(raw); schema=json.loads(a.schema.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        print(f"input error: {e}",file=sys.stderr); return 2
    errors=validate(data,schema); report={"status":"invalid" if errors else "valid","input_sha256":sha(raw),"errors":errors}
    a.report.parent.mkdir(parents=True,exist_ok=True); a.report.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    if errors:
        print(f"validation failed: {len(errors)} finding(s)",file=sys.stderr); return 1
    print("validation passed"); return 0
if __name__=="__main__": raise SystemExit(main())
