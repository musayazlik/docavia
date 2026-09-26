import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";
import { defaultContent } from "@/lib/content/defaults";
import { HeroVisual } from "./hero-visual";

export async function Hero() {
  const content = await getContent();
  const hero = content.hero;
  const heroAvatars = [
    hero.patientAvatar1,
    hero.patientAvatar2,
    hero.patientAvatar3,
  ].filter((src) => typeof src === "string" && src.trim().length > 0);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
      {/* atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-32 size-[36rem] rounded-full bg-primary-light/60 blur-3xl" />
        <div className="absolute top-1/2 -left-48 size-[30rem] rounded-full bg-secondary blur-3xl" />
        <div className="bg-dots absolute top-36 left-[4%] size-44 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)]" />
        <svg
          viewBox="0 0 48 48"
          className="absolute top-24 right-[8%] hidden size-14 text-primary/15 lg:block"
          aria-hidden="true"
        >
          <path
            d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12">
        <div className="min-w-0">
          <Reveal>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-heading mt-5 text-[2.7rem] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-foreground sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.35rem]">
              <span className="block">{hero.title}</span>
              <em className="font-accent block leading-[1.02] font-normal text-primary italic">
                {hero.titleAccent}
              </em>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
              {hero.description}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4 max-[479px]:flex-col max-[479px]:items-stretch">
              <Button href="/appointment" withArrow className="max-[479px]:w-full max-[479px]:justify-between">
                {hero.primaryCta}
              </Button>
              <Button href="#doctors" variant="outline" withArrow className="max-[479px]:w-full max-[479px]:justify-between">
                {hero.secondaryCta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-11 flex items-center gap-4">
              {heroAvatars.length > 0 && (
                <div className="flex -space-x-3">
                  {heroAvatars.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
              )}
              <div>
                <div
                  className="flex items-center gap-1.5"
                  aria-label={`Rated ${hero.ratingValue.replace("/5", "")} out of 5`}
                >
                  <span className="flex text-[#f2b01e]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </span>
                  <span className="font-heading text-sm font-bold text-foreground">
                    {hero.ratingValue}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {hero.ratingLabel}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <HeroVisual imageSrc={hero.image || defaultContent.hero.image} />
      </div>
    </section>
  );
}
