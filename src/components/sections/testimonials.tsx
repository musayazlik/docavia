import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { getContent } from "@/lib/content/store";

export async function Testimonials() {
  const testimonials = (await getContent()).testimonials;

  return (
    <TestimonialsCarousel
      eyebrow={testimonials.eyebrow}
      title={testimonials.title}
      titleAccent={testimonials.titleAccent}
      items={testimonials.items.map((item) => ({ ...item }))}
    />
  );
}
