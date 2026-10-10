export function GenerationLoader({ elapsed, stop }: { elapsed: number; stop: () => void }) {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-100px)] max-w-3xl flex-col items-center justify-center">
      <div className="mb-5 text-center">
        <h1 className="text-lg font-semibold">Generating storyboard</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Elapsed{" "}
          <span className="tabular">{`${Math.floor(elapsed / 60)
            .toString()
            .padStart(2, "0")}:${Math.floor(elapsed % 60)
            .toString()
            .padStart(2, "0")}`}</span>
        </p>
      </div>
      <ImageGenerationLoader text="GENERATING STORYBOARD" />
      <button
        onClick={stop}
        className="mt-5 h-8 rounded-md px-3 text-xs text-[var(--text-secondary)] hover:bg-[var(--raised)] hover:text-[var(--text)]"
      >
        Stop waiting
      </button>
    </section>
  );
}

function ImageGenerationLoader({ text }: { text: string }) {
  return (
    <div className="aceternity-loader" aria-label="Generating video" role="status">
      <div className="aceternity-loader__band" />
      <div className="aceternity-loader__grid" aria-hidden="true">
        {Array.from({ length: 144 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="aceternity-loader__label">{text}</div>
      <div className="aceternity-loader__progress">
        <span />
      </div>
    </div>
  );
}
