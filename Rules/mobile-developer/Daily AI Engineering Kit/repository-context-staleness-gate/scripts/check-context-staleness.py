#!/usr/bin/env python3
import hashlib, json, subprocess, sys
from pathlib import Path

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr); sys.exit(2)

def sha256(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024), b""): h.update(chunk)
    return h.hexdigest()

def git_rev(root):
    try:
        return subprocess.check_output(["git","-C",str(root),"rev-parse","HEAD"], text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return "unknown"

def main():
    if len(sys.argv)!=4: fail("usage: check-context-staleness.py <manifest.json> <repo-root> <report.json>")
    manifest_path, root, out = Path(sys.argv[1]), Path(sys.argv[2]).resolve(), Path(sys.argv[3])
    if not manifest_path.is_file() or not root.is_dir(): fail("manifest or repo root missing")
    data=json.loads(manifest_path.read_text(encoding="utf-8"))
    findings=[]; blocking=0
    for a in data.get("artifacts",[]):
        for s in a.get("sources",[]):
            p=(root/s["path"]).resolve()
            try:
                p.relative_to(root)
            except ValueError:
                status="unknown"; actual=None; err="path escapes repository"
            else:
                if not p.exists(): status="missing"; actual=None; err=None
                elif not p.is_file(): status="unknown"; actual=None; err="source is not a file"
                else:
                    try:
                        actual=sha256(p); status="fresh" if actual.lower()==s["sha256"].lower() else "stale"; err=None
                    except Exception as e:
                        status="unknown"; actual=None; err=str(e)
            if status!="fresh": blocking+=1
            findings.append({"artifact_id":a["id"],"path":s["path"],"status":status,"expected_sha256":s["sha256"],"actual_sha256":actual,"error":err})
    report={"repository":data.get("repository",""),"manifest_revision":data.get("revision",""),"current_revision":git_rev(root),"findings":findings,"blocking_count":blocking}
    out.parent.mkdir(parents=True, exist_ok=True); out.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"blocking_count":blocking,"current_revision":report["current_revision"]}))
    sys.exit(1 if blocking else 0)

if __name__=="__main__": main()
