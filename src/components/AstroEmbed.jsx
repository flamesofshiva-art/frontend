import { useEffect, useRef } from 'react';

const EMBED_SCRIPT_SRC = 'https://shastralife.com/embed.js';

function ensureScriptLoaded() {
  if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
  const script = document.createElement('script');
  script.src = EMBED_SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Embeds a Shastra Life astrology calculator (partner arrangement).
 * See embed-guide.md for the full option list and all 122 tool slugs.
 */
export default function AstroEmbed({
  tool,
  height = 400,
  accent = 'c9432a', // vermillion, without '#' — data-attribute form doesn't need encoding
  bg = 'transparent',
  title = false,
  frameTitle,
}) {
  const ref = useRef(null);

  useEffect(() => {
    ensureScriptLoaded();
    // If the embed script already scanned the page before this div existed
    // (e.g. tab switch, route change), ask it to pick up new placeholders.
    const t = setTimeout(() => {
      if (window.AstroEmbed?.render) window.AstroEmbed.render();
    }, 50);
    return () => clearTimeout(t);
  }, [tool]);

  return (
    <div
      ref={ref}
      data-astro-tool={tool}
      data-height={height}
      data-accent={`#${accent}`}
      data-bg={bg}
      data-title={title ? '1' : undefined}
      data-frame-title={frameTitle}
    />
  );
}
