#!/usr/bin/env python3
"""Validate a JSON document from stdin against a local JSON Schema (Draft 2020-12).

Returns structured errors as JSON. Does not access the network or Wix.
"""
import json
import sys
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker


def validate(document, schema):
    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    return [
        {"path": "/" + "/".join(map(str, e.absolute_path)), "message": e.message}
        for e in sorted(validator.iter_errors(document), key=lambda e: str(e.absolute_path))
    ]


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: python3 scripts/validate-json-schema.py <schema-path>  < document.json")
    schema = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    document = json.load(sys.stdin)
    print(json.dumps({"valid": not (errors := validate(document, schema)), "errors": errors}))


if __name__ == "__main__":
    main()
