import React from 'react';
import { companyInfo } from '../data/companyInfo';

/**
 * Continuously scrolling client logos.
 *
 * The list is rendered twice and the track translated by exactly -50%, so the
 * second copy is in the first copy's place when the animation loops and the
 * scroll never visibly jumps. Duplicating in markup rather than cloning in JS
 * keeps it working with no script at all.
 *
 * The duplicate is aria-hidden so a screen reader hears each client once, and
 * the whole strip is also given as a plain list to assistive tech via the
 * visually hidden caption.
 */
export default function ClientsStrip() {
  const clients = companyInfo.clients;
  if (!clients?.length) return null;

  /*
   * Each row repeats the client list until it is comfortably wider than any
   * viewport, and the row itself is then rendered twice.
   *
   * Both halves matter. The outer duplication is what makes -50% loop without a
   * jump; the inner repetition is what stops a short list from running out of
   * logos mid-scroll. With two clients a single row is only ~600px, so on a
   * 1900px screen the track walked straight off its own end and left a gap.
   *
   * Only the first row is announced; every repeat is hidden from assistive tech
   * so a screen reader hears each client once.
   */
  const REPEAT = 4;
  const sequence = Array.from({ length: REPEAT }, () => clients).flat();

  const Row = ({ hidden }) => (
    <ul className="clients-row" aria-hidden={hidden || undefined}>
      {sequence.map((c, i) => (
        <li key={`${c.name}-${hidden ? 'dup' : 'main'}-${i}`}>
          <img
            src={`${import.meta.env.BASE_URL}${c.logo}`}
            alt={hidden || i >= clients.length ? '' : c.name}
            aria-hidden={i >= clients.length || undefined}
            width={180}
            height={50}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="clients-band" aria-labelledby="clients-title">
      <div className="container-custom">
        <div className="clients-head">
          <span className="label-tech">Our clients</span>
          <h2 id="clients-title" className="clients-title">
            Trusted by established manufacturers
          </h2>
        </div>
      </div>

      {/* Full-bleed: the marquee reads better running edge to edge than boxed
          inside the content column. */}
      <div className="clients-marquee">
        <div className="clients-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
