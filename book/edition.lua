-- UTF-8 source stays canonical; the reading formats get appropriate title and archive links.
function Header(el)
  if el.level == 1 and el.identifier == 'beyond-spacetime' and FORMAT:match('latex') then
    return pandoc.RawBlock('latex', '\\thispagestyle{empty}\n\\vspace*{0.18\\textheight}\n\\begin{center}\n{\\Huge\\bfseries BEYOND SPACETIME\\par}\\vspace{1.6em}\n')
  end
  local label = pandoc.utils.stringify(el)
  if (el.level == 1 and (label:match('^Part ') or el.identifier == 'technical-reference-and-reproducibility' or el.identifier == 'the-twelve-arcsecs-foundations-the-authors-exact-project-charter')) or el.identifier == 'chapter-32a.-from-physical-outflow-to-the-telescope' then
    if FORMAT:match('latex') then return {pandoc.RawBlock('latex', '\\clearpage'), el} end
    if FORMAT:match('docx') then return {pandoc.RawBlock('openxml','<w:p><w:r><w:br w:type="page"/></w:r></w:p>'), el} end
  end
end
function Div(el)
  if el.classes:includes('edition-break') then
    if FORMAT:match('latex') then
      return pandoc.RawBlock('latex', '\\end{center}\n\\clearpage\n\\tableofcontents\n\\clearpage')
    elseif FORMAT:match('docx') then
      return pandoc.RawBlock('openxml','<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
    else
      return {}
    end
  end
end
function Link(el)
  if FORMAT:match('epub') and el.target:match('^%.%./docs/') then
    return {pandoc.Span(el.content), pandoc.Space(), pandoc.Str('(archive:'), pandoc.Space(), pandoc.Code(el.target:sub(4)), pandoc.Str(')')}
  end
end
-- Long file names and repository paths must be breakable without altering the path.
function Code(el)
  if FORMAT:match('latex') and el.text:match('^[%w_%.%-%/:]+$') and (el.text:find('/',1,true) or el.text:match('%.csv$') or el.text:match('%.json$')) then
    return pandoc.RawInline('latex', '\\path{'..el.text..'}')
  end
end
