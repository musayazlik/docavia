export const site = {
  name: "Docavia",
  url: "https://docavia.com",
  tagline: "Modern Healthcare",
  phone: "+1 234 567 890",
  phoneHref: "tel:+1234567890",
  email: "hello@docavia.com",
  emailHref: "mailto:hello@docavia.com",
  address: "123 Medical Avenue",
  city: "New York, NY",
} as const;

export type NavChild = { label: string; href: string };
export type NavLink = { label: string; href: string; children?: NavChild[] };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/doctors" },
  {
    label: "Pages",
    href: "/about",
    children: [
      { label: "Book an Appointment", href: "/appointment" },
      { label: "Why Docavia", href: "/#why-us" },
      { label: "How It Works", href: "/services#how-it-works" },
      { label: "Testimonials", href: "/doctors#testimonials" },
      { label: "FAQ", href: "/contact#faq" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
