import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/onboardingRoutes.js.
// Both endpoints are upserts — the same call handles first-time onboarding
// and later profile edits, so there's no separate "edit profile" endpoint.
// Note: there is no GET /onboarding/... endpoint. Onboarding completeness
// must be inferred elsewhere (e.g. a 404 from /suppliers/me, or the
// dashboard calls) — do not invent a status-check endpoint here.
export const onboardingApi = {
  // buyer only -> { profile }
  submitBuyer: (payload) => axiosClient.post('/onboarding/buyer', payload).then((res) => res.data),

  // supplier only -> { profile }
  submitSupplier: (payload) =>
    axiosClient.post('/onboarding/supplier', payload).then((res) => res.data),
};
