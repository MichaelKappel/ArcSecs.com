#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
pandoc ArcSecs_Scientific_Paper_Review_6.md --from=markdown+tex_math_dollars+raw_tex --standalone --to=latex --number-sections --toc --toc-depth=2 -o ArcSecs_Scientific_Paper_Review_6.tex
build_dir=$(mktemp -d); trap 'rm -rf "$build_dir"' EXIT
for i in 1 2 3; do xelatex -interaction=nonstopmode -halt-on-error -output-directory="$build_dir" ArcSecs_Scientific_Paper_Review_6.tex > "$build_dir/console.log" || { cat "$build_dir/console.log"; exit 1; }; done
cp "$build_dir/ArcSecs_Scientific_Paper_Review_6.pdf" .
cp "$build_dir/ArcSecs_Scientific_Paper_Review_6.log" appendices/review6_latex_build.log
