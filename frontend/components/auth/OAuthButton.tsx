"use client";

import { IconBrandApple, IconBrandGithub } from "@tabler/icons-react";

const providers = {
  google: { label: "Continue with Google", icon: null },
  github: { label: "Continue with GitHub", icon: IconBrandGithub },
  apple: { label: "Continue with Apple", icon: IconBrandApple },
} as const;

export function OAuthButton({ provider }: { provider: keyof typeof providers }) {
  const item = providers[provider];
  const Icon = item.icon;
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
    >
      {provider === "google" ? (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.4Z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.59A9.98 9.98 0 0 0 12 22Z"
          />
          <path
            fill="#FBBC05"
            d="M6.39 13.89A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.89V7.52H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.48l3.33-2.59Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.96 2.99 14.7 2 12 2a9.98 9.98 0 0 0-8.94 5.52l3.33 2.59C7.18 7.74 9.39 5.98 12 5.98Z"
          />
        </svg>
      ) : (
        Icon && <Icon size={18} stroke={1.7} />
      )}
      {item.label}
    </button>
  );
}
