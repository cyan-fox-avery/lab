/* Berry Delightful — basic placeholder sprites (SVG).
   Deliberately simple flat shapes: readable at a glance, obviously not final art.
   Avery is very visual when creating — these exist so the prototype can be *seen*,
   not just read. Real watercolour art comes later and will replace all of this. */

const SPRITES = (() => {
  const soil = (watered) =>
    `<ellipse cx="32" cy="55" rx="24" ry="8" fill="${watered ? "#6e4a2f" : "#9c6b46"}"/>`;

  const leaves = `
    <path d="M32 55 Q30 44 26 36" stroke="#4e7d3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32 55 Q34 44 38 36" stroke="#4e7d3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32 55 Q32 42 32 32" stroke="#4e7d3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="38" rx="8" ry="4.5" fill="#5da24a" transform="rotate(-28 24 38)"/>
    <ellipse cx="40" cy="38" rx="8" ry="4.5" fill="#5da24a" transform="rotate(28 40 38)"/>
    <ellipse cx="27" cy="30" rx="7" ry="4" fill="#6cb257" transform="rotate(-18 27 30)"/>
    <ellipse cx="37" cy="30" rx="7" ry="4" fill="#6cb257" transform="rotate(18 37 30)"/>
    <ellipse cx="32" cy="26" rx="6" ry="3.6" fill="#6cb257"/>`;

  const flowers = `
    <g>
      <circle cx="24" cy="24" r="4" fill="#ffffff"/><circle cx="24" cy="24" r="1.6" fill="#f2c531"/>
      <circle cx="40" cy="24" r="4" fill="#ffffff"/><circle cx="40" cy="24" r="1.6" fill="#f2c531"/>
      <circle cx="32" cy="18" r="4" fill="#ffffff"/><circle cx="32" cy="18" r="1.6" fill="#f2c531"/>
    </g>`;

  const berry = (cx, cy, s) => `
    <g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="M0 -8 C 7 -8 9 -2 4 4 C 1 8 -1 8 -4 4 C -9 -2 -7 -8 0 -8 Z" fill="#d63a4e"/>
      <circle cx="-3" cy="-2" r="0.9" fill="#f6d8a0"/><circle cx="3" cy="-2" r="0.9" fill="#f6d8a0"/>
      <circle cx="0" cy="2" r="0.9" fill="#f6d8a0"/><circle cx="-2" cy="5" r="0.9" fill="#f6d8a0"/>
      <circle cx="2" cy="5" r="0.9" fill="#f6d8a0"/>
      <path d="M-5 -8 L5 -8 L0 -4 Z" fill="#4e7d3a"/>
    </g>`;

  const berries = berry(22, 30, 1) + berry(42, 30, 1) + berry(32, 22, 1.15);

  // growth stage: 0 sprout, 1 growing, 2 flowering, 3 ripe
  function plant(stage, watered) {
    let top = "";
    if (stage === 0) {
      top = `<path d="M32 55 Q32 46 32 40" stroke="#4e7d3a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <ellipse cx="26" cy="42" rx="6" ry="3.4" fill="#6cb257" transform="rotate(-28 26 42)"/>
        <ellipse cx="38" cy="42" rx="6" ry="3.4" fill="#6cb257" transform="rotate(28 38 42)"/>`;
    } else if (stage === 1) top = leaves;
    else if (stage === 2) top = leaves + flowers;
    else top = leaves + berries;
    return `<svg viewBox="0 0 64 64" class="sprite" aria-hidden="true">${soil(watered)}${top}</svg>`;
  }

  function pig() {
    return `<svg viewBox="0 0 64 64" class="sprite" aria-hidden="true">
      <path d="M54 32 q7 -1 5 -9" stroke="#e58ba0" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <rect x="22" y="44" width="7" height="12" rx="3.5" fill="#e58ba0"/>
      <rect x="31" y="44" width="7" height="12" rx="3.5" fill="#e58ba0"/>
      <rect x="40" y="44" width="7" height="12" rx="3.5" fill="#e58ba0"/>
      <ellipse cx="36" cy="36" rx="20" ry="13" fill="#f2a9ba"/>
      <polygon points="13,25 8,14 21,21" fill="#f2a9ba"/>
      <circle cx="17" cy="32" r="10" fill="#f2a9ba"/>
      <ellipse cx="8.5" cy="34" rx="4.6" ry="3.6" fill="#e58ba0"/>
      <circle cx="7.2" cy="34" r="1.1" fill="#7c4356"/><circle cx="10" cy="34" r="1.1" fill="#7c4356"/>
      <circle cx="15" cy="29" r="2" fill="#3a2e2a"/><circle cx="15.7" cy="28.4" r="0.7" fill="#fff"/>
    </svg>`;
  }

  function basket() {
    return `<svg viewBox="0 0 64 64" class="sprite" aria-hidden="true">
      <path d="M14 30 h36 l-4 22 h-28 Z" fill="#b9804e"/>
      <path d="M14 36 h36 M16 42 h32 M18 48 h28" stroke="#8a5a30" stroke-width="2"/>
      <path d="M20 30 q12 -14 24 0" stroke="#8a5a30" stroke-width="3.5" fill="none"/>
      ${berry(26, 24, 0.9)}${berry(38, 24, 0.9)}
    </svg>`;
  }

  return { plant, pig, basket };
})();
