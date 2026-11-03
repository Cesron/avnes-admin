# Dashboard de supervisión

Mode: Operate. Route: /dashboard, roles admin/coordinator only.

User decisions: analysis and comparison first, current week by default, all clubs visible to both roles; retain AVNES palette. User explicitly delegated design decisions, so composition is selected without another approval round. Build code-first for this operating interface.

Structural candidates considered: (1) club overview with drilldown, (2) weekly report with two sequential tables, (3) unified comparison workspace with club/group switch, (4) nested club accordion, (5) two-pane selected-club inspector, (6) coverage-first matrix, (7) compact printable ledger. Surface seed 1f84c277 dealt 3,2,6. Choose 3: comparisons share one scale and controls, without long repeated tables. Retain fixed column alignment and clear state vocabulary; no literal transit-board or decorative motifs.

FIRST VIEWPORT: title and weekly scope; compact summary strip with attendance, recorded coverage and pending count; dominant comparative workspace, aligned blue percentage bars paired with explicit counts and recording completeness. On no-data weeks, display a concise explanatory empty state with previous-week action; never render missing data as 0% attendance.

Signature interaction: switch between clubs and groups in the same comparison surface; search and order by name, attendance or pending count. Club rows link to the club-scoped weekly dashboard. A details disclosure shows exact counts. Pending activities remain below analysis with direct completion links.

Typography: existing Geist, fixed rem sizes, 30px page title, 18px section title, 14px controls/data; tabular numbers. Existing semantic tokens, borders as separation, restrained blue for measures/selection. Motion limited to control-state color changes; no animated chart entrances. Mobile stacks each entity into a labelled record with no horizontal scrolling. Preserve summary mathematics and server authorization. No new chart dependency, no artificial trend or target.


Extensión mensual: selector Semanas/Meses; semana actual por defecto. Mes calendario en hora de El Salvador, con navegación anterior/siguiente y retorno al período actual. Los enlaces de clubes conservan vista y período. Se mantiene la composición y la paleta existentes.
