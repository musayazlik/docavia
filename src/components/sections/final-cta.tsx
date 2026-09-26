import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

export async function FinalCta({ onContactPage = false }: { onContactPage?: boolean }) {
  const finalCta = (await getContent()).finalCta;

  return (
    <section className="pb-24">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] border border-primary-light bg-primary-light/50 px-6 py-20 text-center shadow-card sm:px-8">
            {/* decorations */}
            <div
              aria-hidden="true"
              className="bg-dots absolute top-6 left-6 size-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
            />
            <div
              aria-hidden="true"
              className="bg-dots absolute right-6 bottom-6 size-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/50 blur-3xl"
            />
            <svg
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="absolute top-6 right-8 hidden size-12 text-primary/20 md:block"
            >
              <path
                d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-heading text-[2.1rem] leading-[1.12] font-bold tracking-[-0.025em] text-balance text-foreground sm:text-[2.6rem] lg:text-[3.1rem]">
                {finalCta.title}{" "}
                <em className="font-accent font-normal text-primary italic">
                  {finalCta.titleAccent}
                </em>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-[1.7] text-muted">
                {finalCta.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button href="/appointment" withArrow>
                  {finalCta.primaryCta}
                </Button>
                <Button href={onContactPage ? "#appointment" : "/contact"} variant="outline">
                  {finalCta.secondaryCta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
