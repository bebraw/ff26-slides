// Stryker disable all: Route descriptions are static health metadata, not branching logic.
export const exampleRoutes = [
  { path: "/", purpose: "Index of Future Frontend 2026 slide and print tools" },
  { path: "/slides", purpose: "Future Frontend 2026 break slide deck" },
  { path: "/opening", purpose: "Future Frontend 2026 opening slide deck" },
  { path: "/schedule", purpose: "Printable daily conference schedules" },
  { path: "/speaker-checkin", purpose: "Printable daily speaker check-in sheets" },
  { path: "/api/health", purpose: "JSON health endpoint for tooling and smoke tests" },
  { path: "/slides.js", purpose: "Typed browser module for slide navigation" },
];
// Stryker restore all
