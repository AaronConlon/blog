#!/usr/bin/env bash

set -euo pipefail

env_file="${1:-.env.production}"

if [[ ! -f "$env_file" ]]; then
  echo "Environment file not found: $env_file" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required" >&2
  exit 1
fi

repo="${GH_REPO:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

while IFS= read -r line || [[ -n "$line" ]]; do
  line="$(trim "$line")"

  if [[ -z "$line" || "$line" == \#* ]]; then
    continue
  fi

  if [[ "$line" != *=* ]]; then
    echo "Invalid environment entry in $env_file: $line" >&2
    exit 1
  fi

  name="$(trim "${line%%=*}")"
  value="$(trim "${line#*=}")"

  if [[ ! "$name" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then
    echo "Invalid environment variable name: $name" >&2
    exit 1
  fi

  if [[ ${#value} -ge 2 && "$value" == \"*\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ ${#value} -ge 2 && "$value" == \'*\' ]]; then
    value="${value:1:${#value}-2}"
  fi

  if [[ -z "$value" ]]; then
    echo "Empty value for environment variable: $name" >&2
    exit 1
  fi

  gh secret set "$name" --repo "$repo" --body "$value" >/dev/null
  echo "Synced GitHub secret: $name"
done < "$env_file"

echo "Production environment synchronized to $repo"
