/* Slim proof strip: the strongest trust signal pulled out of body
   text (server component, static). A client quote slot is reserved
   below — fill it in when the AIxWings quote is available. */
export function ProofStrip() {
  return (
    <div className="proof-strip">
      <span>commissioned graduation project, now pitched for funding</span>
      <i aria-hidden="true">·</i>
      <span>live on Vercel</span>
      <i aria-hidden="true">·</i>
      <span>installable PWA</span>
      {/* quote slot — e.g.
      <blockquote className="proof-quote">
        "…" <cite>— AIxWings client</cite>
      </blockquote> */}
    </div>
  );
}
