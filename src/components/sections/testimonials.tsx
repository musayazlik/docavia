import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { getContent } from "@/lib/content/store";
import { getTestimonials } from "@/lib/entities";

export async function Testimonials() {
  const [content, items] = await Promise.all([getContent(), getTestimonials()]);
  const section = content.testimonials;

  return (
    <TestimonialsCarousel
      eyebrow={section.eyebrow}
      title={section.title}
      titleAccent={section.titleAccent}
      items={items}
    />
  );
}
