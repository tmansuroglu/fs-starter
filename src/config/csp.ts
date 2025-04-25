import helmet from "helmet"

export const htmlHelmet = helmet({
  // removes the X-Powered-By header to prevent attackers from fingerprinting your framework
  hidePoweredBy: true,
  // enforces HTTPS for one year (including subdomains) and opts you into browser preload lists to stop downgrade and MITM attacks
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // only sends the Referer header for same-origin requests to avoid leaking full URLs externally
  referrerPolicy: { policy: "strict-origin" },
  // blocks your pages from being framed anywhere to stop clickjacking attacks
  frameguard: { action: "deny" },
  // adds X-Content-Type-Options: nosniff to prevent browsers from MIME-sniffing responses and executing malicious content
  noSniff: true,
  // restricts resource loading so only your origin can fetch them, preventing unauthorized cross-origin reads
  crossOriginResourcePolicy: { policy: "same-origin" },
  // isolates your top-level browsing context to prevent certain cross-site attacks by requiring same-origin opener
  crossOriginOpenerPolicy: { policy: "same-origin" },
  // requires that any embedded resource explicitly allow cross-origin loading, preventing mixed-content leaks
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  // disables legacy Adobe/Flex cross-domain XML policies to reduce Flash/Acrobat attack surface
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  // whitelists every resource type to your own origin only and upgrades all HTTP subresources to HTTPS to block XSS and mixed-content
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
})

export const apiHelmet = helmet({
  // removes the X-Powered-By header to prevent attackers from fingerprinting your framework
  hidePoweredBy: true,
  // enforces HTTPS for one year (including subdomains) and opts you into browser preload lists to stop downgrade and MITM attacks
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // never sends the Referer header on API responses to avoid leaking URL details
  referrerPolicy: { policy: "no-referrer" },
  // blocks API routes from being framed to stop clickjacking of JSON endpoints
  frameguard: { action: "deny" },
  // adds X-Content-Type-Options: nosniff to prevent MIME-sniffing of API responses
  noSniff: true,
  // restricts resource loading so only your origin can fetch them, preventing unauthorized cross-origin reads
  crossOriginResourcePolicy: { policy: "same-origin" },
  // blocks all resource types by default except fetch/XHR back to your domain to lock down JSON-only endpoints
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      connectSrc: ["'self'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'none'"],
      imgSrc: ["'none'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
})
