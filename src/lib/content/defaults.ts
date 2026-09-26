/**
 * Single source of truth for every editable copy on the site.
 *
 * The admin panel edits sparse JSON overrides stored in the `SiteContent`
 * table (one row per top-level group). At read time those overrides are
 * deep-merged over these defaults, so a missing key or an unreachable
 * database always degrades to the values below — the site can never break
 * because of the CMS layer.
 */

export const defaultContent = {
  /* ------------------------------ Site settings ----------------------------- */
  site: {
    name: "Docavia",
    tagline: "Modern Healthcare",
    phone: "+1 234 567 890",
    phoneHref: "tel:+1234567890",
    email: "hello@docavia.com",
    emailHref: "mailto:hello@docavia.com",
    address: "123 Medical Avenue",
    city: "New York, NY",
    copyright: "© 2026 Docavia. All rights reserved.",
    footerTagline:
      "Modern, patient-centered healthcare — expert specialists, effortless appointments and care built around you.",
  },

  /* -------------------------------- Info bar -------------------------------- */
  infoBar: {
    items: [
      {
        title: "Emergency Care",
        lines: ["24/7 Emergency Support", "+1 234 567 890"],
        actionLabel: "",
        actionHref: "",
      },
      {
        title: "Opening Hours",
        lines: ["Mon – Fri", "08:00 – 20:00"],
        actionLabel: "",
        actionHref: "",
      },
      {
        title: "Appointment",
        lines: ["Schedule your consultation"],
        actionLabel: "Book Now",
        actionHref: "/appointment",
      },
    ],
  },

  /* ---------------------------------- Hero ---------------------------------- */
  hero: {
    eyebrow: "Modern Healthcare",
    title: "Better Care Starts With the",
    titleAccent: "Right Doctor.",
    description:
      "Expert medical care designed around you. Connect with experienced specialists, book appointments easily and take the next step toward better health.",
    primaryCta: "Book Appointment",
    secondaryCta: "Find a Doctor",
    ratingValue: "4.9/5",
    ratingLabel: "Trusted by 12,000+ patients",
    image: "/images/hero-doctor.jpg",
    patientAvatar1: "/images/avatar-p1.jpg",
    patientAvatar2: "/images/patient-sophia.jpg",
    patientAvatar3: "/images/avatar-p3.jpg",
  },

  /* ------------------------------ About section ----------------------------- */
  about: {
    eyebrow: "About Docavia",
    title: "Healthcare Built",
    titleAccent: "Around You.",
    description:
      "We believe great healthcare starts with listening. Our clinics combine experienced specialists, modern technology and unhurried consultations — so every visit leaves you feeling informed and cared for.",
    buttonLabel: "Discover Docavia",
    badgeValue: "15+",
    badgeLabel: "Years of Experience",
    benefits: [
      {
        title: "Personalized Care",
        description: "Treatment plans shaped around your history and goals.",
      },
      {
        title: "Experienced Specialists",
        description: "Board-certified doctors across 30+ medical services.",
      },
      {
        title: "Modern Technology",
        description: "Accurate diagnostics with the latest medical equipment.",
      },
      {
        title: "Easy Appointments",
        description: "Book online in under two minutes — no phone queues.",
      },
    ],
  },

  /* ----------------------------- Services section ---------------------------- */
  services: {
    eyebrow: "Our Services",
    title: "Care for Every",
    titleAccent: "Stage of Life.",
    intro:
      "From everyday check-ups to specialist programs, thirty medical services under one calm roof — always with the same standard of attention.",
    items: [
      {
        title: "General Medicine",
        description:
          "Everyday primary care, annual check-ups and preventive screenings for the whole family.",
      },
      {
        title: "Cardiology",
        description:
          "Advanced heart care — from ECG and stress testing to long-term cardiovascular programs.",
      },
      {
        title: "Dental Care",
        description:
          "Gentle dentistry with modern imaging, hygiene treatments and cosmetic procedures.",
      },
      {
        title: "Pediatrics",
        description:
          "Compassionate care for newborns, children and teens through every growth stage.",
      },
      {
        title: "Neurology",
        description:
          "Diagnosis and treatment for headaches, sleep disorders and neurological conditions.",
      },
      {
        title: "Physiotherapy",
        description:
          "Personalized rehabilitation programs that restore movement and build lasting strength.",
      },
    ],
  },

  /* ------------------------------ Why-us section ----------------------------- */
  whyUs: {
    eyebrow: "Why Docavia",
    title: "Healthcare You Can",
    titleAccent: "Trust.",
    description:
      "Choosing a doctor is choosing peace of mind. Here is what every patient can expect from us — on the first visit and every one after.",
    badgeValue: "98%",
    badgeLabel: "Patient Satisfaction",
    features: [
      {
        title: "Expert Specialists",
        description:
          "A hand-picked team of senior physicians, each a leader in their field.",
      },
      {
        title: "Advanced Technology",
        description:
          "Digital diagnostics, imaging and labs — all under one calm roof.",
      },
      {
        title: "Patient-Centered Care",
        description:
          "Unrushed consultations where you are heard first and treated second.",
      },
      {
        title: "Seamless Appointments",
        description:
          "Online booking, smart reminders and zero paperwork on arrival.",
      },
    ],
  },

  /* --------------------------------- Stats ---------------------------------- */
  stats: {
    items: [
      { value: 25, suffix: "+", label: "Years Experience" },
      { value: 50, suffix: "+", label: "Medical Specialists" },
      { value: 12, suffix: "K+", label: "Happy Patients" },
      { value: 30, suffix: "+", label: "Medical Services" },
    ],
  },

  /* ----------------------------- Doctors section ----------------------------- */
  doctors: {
    eyebrow: "Our Specialists",
    title: "Meet the People",
    titleAccent: "Behind Your Care.",
    viewAllLabel: "View All Doctors",
    items: [
      {
        name: "Dr. Emily Carter",
        specialty: "Cardiologist",
        bio: "Interventional cardiology with a preventive, lifestyle-first approach.",
        image: "/images/doctor-emily.jpg",
      },
      {
        name: "Dr. James Wilson",
        specialty: "Neurologist",
        bio: "Specialist in headache medicine, sleep disorders and neuro-diagnostics.",
        image: "/images/doctor-james.jpg",
      },
      {
        name: "Dr. Olivia Martin",
        specialty: "Pediatrician",
        bio: "Gentle, family-centered care from the first check-up to adolescence.",
        image: "/images/doctor-olivia.jpg",
      },
      {
        name: "Dr. Daniel Brooks",
        specialty: "General Practitioner",
        bio: "Everyday medicine done thoroughly — prevention, screening and follow-up.",
        image: "/images/doctor-daniel.jpg",
      },
    ],
  },

  /* -------------------------- Appointment CTA band --------------------------- */
  appointmentCta: {
    eyebrow: "Book an Appointment",
    title: "Your Health Deserves the",
    titleAccent: "Right Attention.",
    description:
      "Tell us what you need and we will match you with the right specialist — usually within one working day.",
    buttonLabel: "Schedule Appointment",
  },

  /* ---------------------------- How it works --------------------------------- */
  howItWorks: {
    eyebrow: "How It Works",
    title: "Getting Care Should",
    titleAccent: "Be Simple.",
    description:
      "Three unhurried steps stand between you and the right care — designed to respect your time.",
    steps: [
      {
        title: "Find Your Doctor",
        description:
          "Browse specialists by field, read profiles and choose the right match for your needs.",
      },
      {
        title: "Choose Your Time",
        description:
          "Pick a slot that fits your week and confirm instantly — no waiting on hold.",
      },
      {
        title: "Get Expert Care",
        description:
          "Meet your doctor, receive a clear plan and follow up online whenever needed.",
      },
    ],
  },

  /* ------------------------------ Testimonials ------------------------------- */
  testimonials: {
    eyebrow: "Testimonials",
    title: "Care That Patients",
    titleAccent: "Remember.",
    items: [
      {
        quote:
          "The entire experience was simple, professional and reassuring. From booking my appointment to meeting the doctor, everything felt effortless.",
        name: "Sophia Anderson",
        role: "Patient — Cardiology",
        avatar: "/images/patient-sophia.jpg",
      },
      {
        quote:
          "I never feel like a number here. My doctor took time to explain every option and the follow-up care has been exceptional.",
        name: "Emma Collins",
        role: "Patient — Physiotherapy",
        avatar: "/images/avatar-p1.jpg",
      },
      {
        quote:
          "Booking took two minutes and the reminders kept me on track. The clinic itself feels calm and genuinely welcoming.",
        name: "Rachel Nguyen",
        role: "Patient — Pediatrics",
        avatar: "/images/avatar-p3.jpg",
      },
    ],
  },

  /* --------------------------- Articles section ------------------------------ */
  articles: {
    eyebrow: "Health Journal",
    title: "Insights for",
    titleAccent: "Better Health.",
    viewAllLabel: "All Articles",
  },

  /* ---------------------------------- FAQ ------------------------------------ */
  faq: {
    eyebrow: "FAQ",
    title: "Questions?",
    titleAccent: "We're Here to Help.",
    description:
      "Everything you need to know before your visit. If you can't find your answer here, our care team is one call away.",
    callLabel: "Call us anytime",
    items: [
      {
        question: "How do I book an appointment?",
        answer:
          "Choose a doctor and a time that suits you through our online booking, or call our front desk. You will receive an instant confirmation with everything you need to know.",
      },
      {
        question: "Can I choose my doctor?",
        answer:
          "Yes. Every specialist's profile lists their field, experience and availability, so you can confidently pick the doctor who feels right for you.",
      },
      {
        question: "Do you offer online consultations?",
        answer:
          "We do. Many follow-ups and first assessments can be held as secure video consultations — ideal for reviews, prescriptions and specialist advice.",
      },
      {
        question: "What should I bring to my appointment?",
        answer:
          "Bring a photo ID, your insurance card if applicable, a list of current medications and any recent test results or referral letters.",
      },
      {
        question: "Do you accept insurance?",
        answer:
          "We work with all major insurance providers. Our team verifies your coverage before your visit so there are no surprises.",
      },
    ],
  },

  /* ------------------------------- Final CTA --------------------------------- */
  finalCta: {
    title: "Ready to Take Better",
    titleAccent: "Care of Your Health?",
    description:
      "Book an appointment with one of our specialists and take the next step toward better health.",
    primaryCta: "Book Appointment",
    secondaryCta: "Contact Us",
  },

  /* ----------------------------- Opening hours ------------------------------- */
  openingHours: {
    items: [
      { day: "Monday", hours: "08:00 – 20:00" },
      { day: "Tuesday", hours: "08:00 – 20:00" },
      { day: "Wednesday", hours: "08:00 – 20:00" },
      { day: "Thursday", hours: "08:00 – 20:00" },
      { day: "Friday", hours: "08:00 – 20:00" },
      { day: "Saturday", hours: "09:00 – 14:00" },
      { day: "Sunday", hours: "Closed" },
    ],
  },

  /* ------------------------------ Page heroes -------------------------------- */
  pages: {
    about: {
      label: "About",
      eyebrow: "About Docavia",
      title: "Medicine With the",
      titleAccent: "Human Touch.",
      description:
        "We are a team of specialists who believe great care starts with listening — and never stops at the prescription.",
    },
    services: {
      label: "Services",
      eyebrow: "What We Offer",
      title: "Complete Care,",
      titleAccent: "Under One Roof.",
      description:
        "Thirty medical services from everyday check-ups to advanced specialist programs — always with the same standard of attention.",
    },
    doctors: {
      label: "Doctors",
      eyebrow: "The Team",
      title: "Experts Who",
      titleAccent: "Listen First.",
      description:
        "Fifty board-certified physicians across thirty fields — hand-picked not only for their credentials, but for how they treat people.",
    },
    blog: {
      label: "Blog",
      eyebrow: "Health Journal",
      title: "Insights for",
      titleAccent: "Better Health.",
      description:
        "Practical, physician-reviewed articles on prevention, heart health and everyday wellbeing — no scare tactics, just clarity.",
    },
    contact: {
      label: "Contact",
      eyebrow: "Contact Us",
      title: "We're Here",
      titleAccent: "When You Need Us.",
      description:
        "Questions about a service, your visit or an appointment? Reach out — a real person from our care team will answer.",
    },
    appointment: {
      label: "Appointment",
      eyebrow: "Book a Visit",
      title: "Book Your Visit in",
      titleAccent: "Under Two Minutes.",
      description:
        "Pick the department, the doctor and the time that suits you — our care team confirms every request personally, usually within one working day.",
    },
  },
} as const;

export type SiteContent = typeof defaultContent;
