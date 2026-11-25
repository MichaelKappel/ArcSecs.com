-- UTF-8 source stays canonical; the reading formats get appropriate title and archive links.
function Header(el)
  if el.level == 1 and el.identifier == 'beyond-spacetime' and FORMAT:match('latex') then
    return pandoc.RawBlock('latex', '\\thispagestyle{empty}\n\\vspace*{0.18\\textheight}\n\\begin{center}\n{\\Huge\\bfseries BEYOND SPACETIME\\par}\\vspace{1.6em}\n')
  end
  local label = pandoc.utils.stringify(el)
  if el.identifier == 'final-scientific-review' and FORMAT:match('latex') then return {pandoc.RawBlock('latex', '\\clearpage'), el} end
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
  if FORMAT:match('latex') and el.text:match('^[%w_%.%-%/:]+$') and (el.text:find('/',1,true) or el.text:match('%.csv$') or el.text:match('%.json$') or el.text:match('%.png$')) then
    return pandoc.RawInline('latex', '\\path{'..el.text..'}')
  end
end
-- Fit displayed equations without modifying the mathematics or labels.
function Math(el)
  if FORMAT:match('latex') and el.mathtype == 'InlineMath' then
    local s=el.text
    if s:find('\\kappa(\\Phi_X)=',1,true) or s:find('\\alpha(\\ell,E,\\mathrm{environment})',1,true) then return pandoc.RawInline('latex','\\mbox{$'..s..'$}') end
    -- Permit line breaks at existing separators and relations in long inline mathematics.
    if #s > 36 then
      local out,depth={},0
      local i=1
      while i<=#s do
        local c=s:sub(i,i)
        out[#out+1]=c
        if c=='{' then depth=depth+1 elseif c=='}' then depth=math.max(0,depth-1) end
        if depth==0 and (c==',' or c=='/' or c=='=' or c=='+' or c=='-') then out[#out+1]='\\allowbreak{}' end
        i=i+1
      end
      el.text=table.concat(out)
      return el
    end
  end
  if FORMAT:match('latex') and el.mathtype == 'DisplayMath' then
    local s = el.text
    local tag = s:match('\\tag%s*{([^}]+)}')
    if tag then s = s:gsub('\\tag%s*{[^}]+}', '') end
    s = s:gsub('^%s+', ''):gsub('%s+$', ''):gsub('\n%s*\n', '\n')
    local body = '\\maxsizebox{' .. (tag and '\\dimexpr\\linewidth-3.6em\\relax' or '\\linewidth') .. '}{!}{$\\displaystyle '..s..'$}'
    if tag then body = body .. '\\tag{' .. tag .. '}' end
    return pandoc.RawInline('latex','\\['..body..'\\]')
  end
end

function Table(el)
  if FORMAT:match('latex') and pandoc.utils.stringify(el):find('Number of loss events',1,true) then
    el.colspecs={{pandoc.AlignDefault,0.34},{pandoc.AlignDefault,0.33},{pandoc.AlignDefault,0.33}}
    return el
  end
end

function Str(el)
  if FORMAT:match('latex') and el.text=='Incident/reflected/outgoing' then return pandoc.RawInline('latex','Incident/\\allowbreak{}reflected/\\allowbreak{}outgoing') end
end
