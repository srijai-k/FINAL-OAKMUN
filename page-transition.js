(function () {
  'use strict';

  /* ─────────────────────────────────────────
     CSS — injected into <head>
  ───────────────────────────────────────── */
  var CSS = [
    /* overlay */
    '#pt-overlay{',
      'position:fixed;inset:0;z-index:999999;',
      'background:radial-gradient(ellipse at 50% 45%, #081c2e 0%, #03080f 68%);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'opacity:1;pointer-events:all;',
      'transition:opacity .48s cubic-bezier(.4,0,.2,1);',
    '}',
    '#pt-overlay.pt-hidden{opacity:0;pointer-events:none;}',

    /* fire streaks */
    '.pt-streak{',
      'position:absolute;height:1.5px;border-radius:999px;',
      'top:var(--top);left:-320px;width:var(--w);opacity:0;',
      'background:linear-gradient(to right,transparent,var(--col) 35%,var(--col) 65%,transparent);',
      'animation:ptStreak var(--dur) var(--delay) infinite linear;',
    '}',
    '@keyframes ptStreak{',
      '0%{opacity:0;transform:translateX(0)}',
      '8%{opacity:var(--op,.55)}',
      '92%{opacity:var(--op,.55)}',
      '100%{opacity:0;transform:translateX(calc(100vw + 640px))}',
    '}',

    /* phoenix wrapper — bob */
    '#pt-phoenix-wrap{',
      'position:relative;display:flex;align-items:center;justify-content:center;',
      'filter:drop-shadow(0 0 20px rgba(48,205,215,.6)) drop-shadow(0 0 55px rgba(30,150,165,.25));',
      'animation:ptBob 2.6s ease-in-out infinite;',
    '}',
    '#pt-phoenix-wrap svg{width:min(240px,52vw);height:auto;}',
    '@keyframes ptBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}',

    /* wings */
    '.pt-wing-l{transform-origin:100% 50%;animation:ptWingL .65s ease-in-out infinite alternate;}',
    '.pt-wing-r{transform-origin:0%   50%;animation:ptWingR .65s ease-in-out infinite alternate;}',
    '@keyframes ptWingL{from{transform:rotate(-6deg) scaleY(.94)}to{transform:rotate(18deg) scaleY(1.05)}}',
    '@keyframes ptWingR{from{transform:rotate(6deg) scaleY(.94)}to{transform:rotate(-18deg) scaleY(1.05)}}',

    /* crest + tail */
    '.pt-crest{transform-origin:50% 100%;animation:ptCrest .44s ease-in-out infinite alternate;}',
    '@keyframes ptCrest{from{transform:scaleY(1) scaleX(1)}to{transform:scaleY(1.18) scaleX(.88)}}',
    '.pt-tail{transform-origin:50% 0%;animation:ptTail .75s ease-in-out infinite alternate;}',
    '@keyframes ptTail{from{transform:scaleY(1) skewX(-2deg)}to{transform:scaleY(1.13) skewX(3deg)}}',

    /* embers */
    '.pt-ember{',
      'position:absolute;border-radius:50%;',
      'width:var(--sz,3px);height:var(--sz,3px);background:var(--col,#BC9A6E);',
      'left:var(--x);top:var(--y);opacity:0;',
      'animation:ptEmber var(--dur) var(--delay) infinite ease-out;',
    '}',
    '@keyframes ptEmber{0%{opacity:.9;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.15)}}',

    /* label */
    '#pt-label{',
      'margin-top:40px;',
      'font-family:"Montserrat",sans-serif;font-size:11px;font-weight:700;',
      'letter-spacing:.32em;text-transform:uppercase;',
      'color:rgba(180,235,245,.35);',
    '}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ─────────────────────────────────────────
     BUILD OVERLAY DOM
  ───────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'pt-overlay';

  /* --- streaks --- */
  var STREAKS = [
    { top:'22%', w:'70px',  dur:'1.05s', delay:'1.10s', col:'#FF3750', op:'.28' },
    { top:'29%', w:'170px', dur:'1.00s', delay:'0.00s', col:'#30CDD7', op:'.55' },
    { top:'35%', w:'105px', dur:'0.82s', delay:'0.38s', col:'#B4EBF5', op:'.42' },
    { top:'41%', w:'235px', dur:'1.30s', delay:'0.18s', col:'#1E96A5', op:'.60' },
    { top:'48%', w:'78px',  dur:'0.90s', delay:'0.62s', col:'#30CDD7', op:'.38' },
    { top:'54%', w:'195px', dur:'1.12s', delay:'0.80s', col:'#BC9A6E', op:'.48' },
    { top:'60%', w:'125px', dur:'1.38s', delay:'0.28s', col:'#30CDD7', op:'.42' },
    { top:'66%', w:'88px',  dur:'0.76s', delay:'0.52s', col:'#B4EBF5', op:'.32' },
    { top:'72%', w:'155px', dur:'1.22s', delay:'0.95s', col:'#BC9A6E', op:'.38' },
    { top:'77%', w:'95px',  dur:'0.88s', delay:'0.72s', col:'#FF3750', op:'.22' },
  ];
  STREAKS.forEach(function (s) {
    var el = document.createElement('div');
    el.className = 'pt-streak';
    el.style.cssText = '--top:'+s.top+';--w:'+s.w+';--dur:'+s.dur+';--delay:'+s.delay+';--col:'+s.col+';--op:'+s.op;
    overlay.appendChild(el);
  });

  /* --- embers --- */
  var EMBERS = [
    { x:'45%', y:'24%', tx:'-26px', ty:'-58px', dur:'1.40s', delay:'0.00s', col:'#FF3750', sz:'4px' },
    { x:'53%', y:'21%', tx:' 32px', ty:'-52px', dur:'1.20s', delay:'0.32s', col:'#BC9A6E', sz:'3px' },
    { x:'43%', y:'27%', tx:'-38px', ty:'-42px', dur:'1.65s', delay:'0.72s', col:'#BC9A6E', sz:'2px' },
    { x:'57%', y:'25%', tx:' 22px', ty:'-62px', dur:'1.10s', delay:'1.05s', col:'#FF3750', sz:'3px' },
    { x:'48%', y:'22%', tx:' -8px', ty:'-68px', dur:'1.50s', delay:'0.50s', col:'#BC9A6E', sz:'2px' },
    { x:'50%', y:'73%', tx:'-20px', ty:' 48px', dur:'1.32s', delay:'0.22s', col:'#BC9A6E', sz:'3px' },
    { x:'47%', y:'76%', tx:' 25px', ty:' 54px', dur:'1.55s', delay:'0.82s', col:'#1E96A5', sz:'2px' },
    { x:'53%', y:'71%', tx:'-30px', ty:' 42px', dur:'1.05s', delay:'0.55s', col:'#30CDD7', sz:'4px' },
  ];
  EMBERS.forEach(function (e) {
    var el = document.createElement('div');
    el.className = 'pt-ember';
    el.style.cssText = '--x:'+e.x+';--y:'+e.y+';--tx:'+e.tx+';--ty:'+e.ty+';--dur:'+e.dur+';--delay:'+e.delay+';--col:'+e.col+';--sz:'+e.sz;
    overlay.appendChild(el);
  });

  /* ─────────────────────────────────────────
     PHOENIX SVG
     ViewBox 0 0 280 272
     Wing tips: (10,46) and (270,46) — 260px span
     Head circle: cx=155 cy=78 r=23, beak pointing right
     Body teardrop: cx~140 cy~158, from y=116 to y=204
     Crest flames: up to y=22
     Tail feathers: down to y=268
  ───────────────────────────────────────── */
  var wrap = document.createElement('div');
  wrap.id = 'pt-phoenix-wrap';
  wrap.innerHTML = '<svg viewBox="0 0 280 272" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'

    /* ── DEFS ── */
    + '<defs>'

    + '<linearGradient id="ptBG" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0%" stop-color="#30CDD7"/>'
    +   '<stop offset="100%" stop-color="#1E96A5"/>'
    + '</linearGradient>'

    /* left wing: gold tip → teal body */
    + '<linearGradient id="ptWLG" x1="0" y1=".5" x2="1" y2=".5">'
    +   '<stop offset="0%" stop-color="#BC9A6E"/>'
    +   '<stop offset="52%" stop-color="#30CDD7" stop-opacity=".88"/>'
    +   '<stop offset="100%" stop-color="#1E96A5" stop-opacity=".5"/>'
    + '</linearGradient>'

    /* right wing: mirrors */
    + '<linearGradient id="ptWRG" x1="1" y1=".5" x2="0" y2=".5">'
    +   '<stop offset="0%" stop-color="#BC9A6E"/>'
    +   '<stop offset="52%" stop-color="#30CDD7" stop-opacity=".88"/>'
    +   '<stop offset="100%" stop-color="#1E96A5" stop-opacity=".5"/>'
    + '</linearGradient>'

    /* crest/fire: teal base → gold mid → red tip */
    + '<linearGradient id="ptFG" x1="0" y1="1" x2="0" y2="0">'
    +   '<stop offset="0%" stop-color="#30CDD7"/>'
    +   '<stop offset="40%" stop-color="#BC9A6E"/>'
    +   '<stop offset="100%" stop-color="#FF3750"/>'
    + '</linearGradient>'

    /* tail: teal → gold → ember red */
    + '<linearGradient id="ptTG" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0%" stop-color="#1E96A5"/>'
    +   '<stop offset="50%" stop-color="#BC9A6E"/>'
    +   '<stop offset="100%" stop-color="#FF3750" stop-opacity=".42"/>'
    + '</linearGradient>'

    /* soft glow filter */
    + '<filter id="ptGF" x="-40%" y="-40%" width="180%" height="180%">'
    +   '<feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>'
    +   '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'
    + '</filter>'

    + '</defs>'

    /* ── TAIL FEATHERS (drawn behind body) ── */
    + '<g class="pt-tail">'
    /* 3 centre feathers — teal→gold→ember gradient */
    +   '<path d="M136 200 C130 220,122 244,112 265" stroke="url(#ptTG)" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
    +   '<path d="M140 202 C139 224,138 248,138 268" stroke="url(#ptTG)" stroke-width="4"   stroke-linecap="round" fill="none"/>'
    +   '<path d="M144 200 C150 220,158 244,168 265" stroke="url(#ptTG)" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
    /* 2 mid feathers — gold */
    +   '<path d="M132 198 C122 218,108 240, 92 260" stroke="#BC9A6E" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".58"/>'
    +   '<path d="M148 198 C158 218,172 240,188 260" stroke="#BC9A6E" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".58"/>'
    /* 2 outer feathers — ember */
    +   '<path d="M128 196 C114 218, 96 240, 76 258" stroke="#FF3750" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".34"/>'
    +   '<path d="M152 196 C166 218,184 240,204 258" stroke="#FF3750" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".34"/>'
    + '</g>'

    /* ── LEFT WING ──
       Top arc:    (122,152) → control(88,122),(46,92)  → tip(10,46)
       Bottom arc: tip(10,46) → control(34,80),(66,112) → root(88,188)
       Body overlaid on top covers the root seam.
    ── */
    + '<g class="pt-wing-l">'
    +   '<path d="M122 152 C88 122,46 92,10 46 C34 80,66 112,88 188 Z"'
    +        ' fill="url(#ptWLG)" opacity=".93"/>'
    /* inner covert shadow near body */
    +   '<path d="M122 152 C108 142,96 136,88 152 L88 188 Z" fill="#1E96A5" opacity=".30"/>'
    /* feather detail lines */
    +   '<g stroke="#B4EBF5" fill="none" stroke-linecap="round" opacity=".30">'
    +     '<path d="M104 142 C82 118,56 90,26 56"  stroke-width="1.1"/>'
    +     '<path d="M90  128 C70 106,46 82, 20 50"  stroke-width=".9"/>'
    +     '<path d="M116 150 C96 130,70 108,44 76"  stroke-width=".8"/>'
    +   '</g>'
    + '</g>'

    /* ── RIGHT WING (mirror) ── */
    + '<g class="pt-wing-r">'
    +   '<path d="M158 152 C192 122,234 92,270 46 C246 80,214 112,192 188 Z"'
    +        ' fill="url(#ptWRG)" opacity=".93"/>'
    +   '<path d="M158 152 C172 142,184 136,192 152 L192 188 Z" fill="#1E96A5" opacity=".30"/>'
    +   '<g stroke="#B4EBF5" fill="none" stroke-linecap="round" opacity=".26">'
    +     '<path d="M176 142 C198 118,224 90,254 56"  stroke-width="1.1"/>'
    +     '<path d="M190 128 C210 106,234 82, 260 50"  stroke-width=".9"/>'
    +     '<path d="M164 150 C184 130,210 108,236 76"  stroke-width=".8"/>'
    +   '</g>'
    + '</g>'

    /* ── BODY (teardrop, drawn over wing roots) ── */
    + '<path d="M140 116 C165 116,175 136,173 160 C171 182,157 200,140 208'
    +        ' C123 200,109 182,107 160 C105 136,115 116,140 116 Z"'
    +      ' fill="url(#ptBG)" filter="url(#ptGF)"/>'
    /* breast highlight stripe */
    + '<path d="M140 130 C152 130,158 144,157 164 C156 178,148 192,140 198'
    +        ' C132 192,124 178,123 164 C122 144,128 130,140 130 Z"'
    +      ' fill="#30CDD7" opacity=".28"/>'

    /* ── NECK ── */
    + '<path d="M128 120 C131 106,137 96,140 90 C143 96,149 106,152 120'
    +        ' C146 114,140 112,140 112 C140 112,134 114,128 120 Z" fill="#1E96A5"/>'

    /* ── HEAD ── */
    + '<circle cx="155" cy="78" r="24" fill="#1E96A5"/>'
    + '<circle cx="155" cy="78" r="19" fill="#30CDD7" filter="url(#ptGF)"/>'
    /* cheek sheen */
    + '<ellipse cx="163" cy="80" rx="6.5" ry="5.5" fill="#B4EBF5" opacity=".20"/>'

    /* ── BEAK (hooked, facing right) ── */
    /* upper mandible */
    + '<path d="M167 72 C176 70,186 74,184 81 C182 83,172 83,167 81 Z" fill="#BC9A6E"/>'
    /* lower mandible */
    + '<path d="M167 81 C173 81,180 83,178 88 C175 90,168 89,167 86 Z" fill="#9a7a52"/>'

    /* ── EYE ── */
    + '<circle cx="149" cy="72" r="6.5" fill="#001830"/>'
    + '<circle cx="149" cy="72" r="3.8" fill="#30CDD7" filter="url(#ptGF)"/>'
    /* catchlight */
    + '<circle cx="150.8" cy="70.5" r="1.6" fill="white" opacity=".92"/>'

    /* ── CREST FLAMES ── */
    + '<g class="pt-crest">'
    /* centre flame — tallest */
    +   '<path d="M155 62 C154 49,150 36,154 22 C158 36,156 49,155 62" fill="url(#ptFG)" opacity=".96"/>'
    /* flanking flames */
    +   '<path d="M149 64 C147 53,143 42,146 31 C149 42,150 53,149 64" fill="url(#ptFG)" opacity=".82"/>'
    +   '<path d="M161 64 C163 53,167 42,164 31 C161 42,160 53,161 64" fill="url(#ptFG)" opacity=".82"/>'
    /* outer plume — gold */
    +   '<path d="M145 66 C142 57,138 48,141 39 C144 48,145 57,145 66" fill="#BC9A6E" opacity=".66"/>'
    +   '<path d="M165 66 C168 57,172 48,169 39 C166 48,165 57,165 66" fill="#BC9A6E" opacity=".66"/>'
    /* inner ember tint */
    +   '<path d="M152 63 C151 54,148 46,151 37 C154 46,153 54,152 63" fill="#FF3750" opacity=".38"/>'
    + '</g>'

    + '</svg>';

  overlay.appendChild(wrap);

  /* --- label --- */
  var lbl = document.createElement('div');
  lbl.id = 'pt-label';
  lbl.textContent = 'Oakridge MUN XVI';
  overlay.appendChild(lbl);

  /* ─────────────────────────────────────────
     MOUNT + PAGE ENTRANCE
  ───────────────────────────────────────── */
  function mount() {
    document.body.appendChild(overlay);
    /* overlay starts at opacity:1; fade it out after a short pause */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(function () {
          overlay.classList.add('pt-hidden');
        }, 340);
      });
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }

  /* ─────────────────────────────────────────
     LINK INTERCEPTION (capture phase)
  ───────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    if (
      href.charAt(0) === '#' ||
      href.indexOf('mailto:') === 0 ||
      href.indexOf('tel:') === 0 ||
      href.indexOf('http://') === 0 ||
      href.indexOf('https://') === 0
    ) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank') return;

    e.preventDefault();
    overlay.classList.remove('pt-hidden');

    setTimeout(function () {
      window.location.href = href;
    }, 600);
  }, true);

})();
