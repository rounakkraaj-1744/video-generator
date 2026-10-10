import Link from "next/link";
import { Logo } from "../brand/Logo";
import { OAuthButton } from "./OAuthButton";

export function AuthCard() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="w-full max-w-[400px]">
        <div className="relative mb-7 flex justify-center">
          <Logo />
        </div>
        <section className="relative rounded-2xl border border-[var(--border-strong)] bg-[color:var(--bg-panel)]/95 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="text-[22px] font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Sign in to continue to ReelForge.
            </p>
          </div>
          <div className="space-y-3">
            <OAuthButton provider="google" />
            <OAuthButton provider="github" />
            <OAuthButton provider="apple" />
          </div>
          <p className="mt-6 text-center text-[11px] leading-5 text-[var(--text-tertiary)]">
            By continuing, you agree to ReelForge&apos;s{" "}
            <span className="text-[var(--text-secondary)]">Terms</span> and{" "}
            <span className="text-[var(--text-secondary)]">Privacy Policy</span>.
          </p>
        </section>
        <p className="mt-5 text-center text-xs text-[var(--text-tertiary)]">
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Back to ReelForge
          </Link>
        </p>
      </div>
    </main>
  );
}
