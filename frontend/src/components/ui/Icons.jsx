// ─── Icon Library ─────────────────────────────────────────────
// All icons follow the same prop signature: ({ s, c })
//   s = size (px)   default 20
//   c = color       default "currentColor"

const mkProps = (s, c) => ({
  width: s, height: s,
  fill: "none", stroke: c, strokeWidth: "2",
  strokeLinecap: "round", strokeLinejoin: "round",
  viewBox: "0 0 24 24",
});

export const Icons = {
  book:        (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  file:        (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  flask:       (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M9 3h6v6l3 9H6L9 9V3z"/><line x1="6" y1="6" x2="18" y2="6"/></svg>,
  mortarboard: (s=20,c="currentColor") => <svg {...mkProps(s,c)}><polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/><line x1="12" y1="15" x2="12" y2="22"/><path d="M19 11v5.5a7 7 0 0 1-14 0V11"/></svg>,
  github:      (s=20,c="currentColor") => <svg width={s} height={s} fill={c} viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  linkedin:    (s=20,c="currentColor") => <svg width={s} height={s} fill={c} viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.208 0 22.225 0z"/></svg>,
  globe:       (s=20,c="currentColor") => <svg {...mkProps(s,c)}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  mail:        (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  scholar:     (s=20,c="currentColor") => <svg {...mkProps(s,c)}><circle cx="12" cy="10" r="3"/><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  sparkles:    (s=16,c="currentColor") => <svg {...mkProps(s,c)}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/></svg>,
  user:        (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  clock:       (s=14,c="currentColor") => <svg {...mkProps(s,c)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  extLink:     (s=15,c="currentColor") => <svg {...mkProps(s,c)}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  pen:         (s=20,c="currentColor") => <svg {...mkProps(s,c)}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  chevDown:    (s=20,c="currentColor") => <svg {...mkProps(s,c)}><polyline points="6 9 12 15 18 9"/></svg>,
  moon:        (s=18,c="currentColor") => <svg {...mkProps(s,c)}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:         (s=18,c="currentColor") => <svg {...mkProps(s,c)}><circle cx="12" cy="12" r="5"/>{[["12","1","12","3"],["12","21","12","23"],["4.22","4.22","5.64","5.64"],["18.36","18.36","19.78","19.78"],["1","12","3","12"],["21","12","23","12"],["4.22","19.78","5.64","18.36"],["18.36","5.64","19.78","4.22"]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>)}</svg>,
  menu:        (s=22,c="currentColor") => <svg {...mkProps(s,c)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:       (s=22,c="currentColor") => <svg {...mkProps(s,c)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};