import PageContainer from './PageContainer';

// Phase 1 is foundation-only — no real pages yet. This stands in for every
// route's element so the router/layouts/guards are fully wired and runnable
// end-to-end. Phase 2 replaces each usage in routes/AppRoutes.jsx with the
// real page component; this file itself is deleted once nothing references it.
const PagePlaceholder = ({ name }) => (
  <PageContainer>
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Phase 2</p>
      <h2 className="text-lg font-semibold text-slate-700">{name}</h2>
      <p className="text-sm text-slate-500">This page hasn't been built yet.</p>
    </div>
  </PageContainer>
);

export default PagePlaceholder;
