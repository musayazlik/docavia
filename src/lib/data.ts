import {
  Baby,
  Brain,
  CalendarCheck,
  Dumbbell,
  HeartPulse,
  Smile,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------- Info bar --------------------------------- */

export type InfoItem = {
  icon: LucideIcon;
  title: string;
  lines: string[];
  action?: { label: string; href: string };
};

export const infoItems: InfoItem[] = [
  {
    icon: HeartPulse,
    title: "Emergency Care",
    lines: ["24/7 Emergency Support", "+1 234 567 890"],
  },
  {
    icon: Stethoscope,
    title: "Opening Hours",
    lines: ["Mon – Fri", "08:00 – 20:00"],
  },
  {
    icon: CalendarCheck,
    title: "Appointment",
    lines: ["Schedule your consultation"],
    action: { label: "Book Now", href: "/appointment" },
  },
];

/* ----------------------------------- About ----------------------------------- */

export const aboutBenefits = [
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
] as const;

/* ---------------------------------- Services --------------------------------- */

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: "dark" | "tint";
};

export const services: Service[] = [
  {
    icon: Stethoscope,
    title: "General Medicine",
    description:
      "Everyday primary care, annual check-ups and preventive screenings for the whole family.",
  },
  {
    icon: HeartPulse,
    title: "Cardiology",
    description:
      "Advanced heart care — from ECG and stress testing to long-term cardiovascular programs.",
    highlight: "dark",
  },
  {
    icon: Smile,
    title: "Dental Care",
    description:
      "Gentle dentistry with modern imaging, hygiene treatments and cosmetic procedures.",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description:
      "Compassionate care for newborns, children and teens through every growth stage.",
    highlight: "tint",
  },
  {
    icon: Brain,
    title: "Neurology",
    description:
      "Diagnosis and treatment for headaches, sleep disorders and neurological conditions.",
  },
  {
    icon: Dumbbell,
    title: "Physiotherapy",
    description:
      "Personalized rehabilitation programs that restore movement and build lasting strength.",
  },
];

/* ----------------------------------- Why us ---------------------------------- */

export const whyUsFeatures = [
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
] as const;

/* ----------------------------------- Stats ----------------------------------- */

export const stats = [
  { value: 25, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Medical Specialists" },
  { value: 12, suffix: "K+", label: "Happy Patients" },
  { value: 30, suffix: "+", label: "Medical Services" },
] as const;

/* ---------------------------------- Doctors ---------------------------------- */

export type Doctor = {
  name: string;
  specialty: string;
  bio: string;
  image: string;
};

export const doctors: Doctor[] = [
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
];

/* -------------------------------- How it works ------------------------------- */

export const steps = [
  {
    number: "01",
    title: "Find Your Doctor",
    description:
      "Browse specialists by field, read profiles and choose the right match for your needs.",
  },
  {
    number: "02",
    title: "Choose Your Time",
    description:
      "Pick a slot that fits your week and confirm instantly — no waiting on hold.",
  },
  {
    number: "03",
    title: "Get Expert Care",
    description:
      "Meet your doctor, receive a clear plan and follow up online whenever needed.",
  },
] as const;

/* -------------------------------- Testimonials ------------------------------- */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
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
];

/* ---------------------------------- Articles --------------------------------- */

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export type ArticleAuthor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

export type Article = {
  slug: string;
  category: string;
  date: string;
  publishedAt: string;
  readingTime: number;
  title: string;
  description: string;
  image: string;
  author: ArticleAuthor;
  content: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "improve-your-heart-health",
    category: "Heart Health",
    date: "Sep 12, 2026",
    publishedAt: "2026-09-12",
    readingTime: 5,
    title: "5 Simple Ways to Improve Your Heart Health",
    description:
      "Small daily habits — from walking to better plate choices — that measurably strengthen your heart.",
    image: "/images/blog-heart.jpg",
    author: {
      name: "Dr. Emily Carter",
      role: "Cardiologist",
      avatar: "/images/doctor-emily.jpg",
      bio: "Interventional cardiology with a preventive, lifestyle-first approach.",
    },
    content: [
      {
        type: "paragraph",
        text: "Your heart beats roughly 100,000 times a day, and most of what keeps it strong is decided in ordinary moments — how you move, what you put on your plate, how you sleep. The good news is that heart health responds quickly to modest, consistent change. You do not need a dramatic overhaul; you need a handful of habits you can actually keep.",
      },
      {
        type: "heading",
        text: "1. Move for thirty minutes, most days",
      },
      {
        type: "paragraph",
        text: "Brisk walking counts. Aim for about 150 minutes of moderate movement a week — roughly thirty minutes on five days. It lowers blood pressure, improves cholesterol and helps your heart pump more efficiently. If thirty minutes feels like a lot, three ten-minute walks deliver most of the same benefit.",
      },
      {
        type: "heading",
        text: "2. Build your plate around plants",
      },
      {
        type: "paragraph",
        text: "Fill half your plate with vegetables and fruit, a quarter with whole grains and a quarter with lean protein. You do not have to give up anything you love forever — but shifting the proportions is the single most reliable dietary change for your heart.",
      },
      {
        type: "list",
        items: [
          "Choose olive oil over butter for everyday cooking",
          "Swap one processed snack a day for a handful of nuts",
          "Aim for fish twice a week — oily fish like salmon is ideal",
          "Keep added sugar under about 25 grams a day",
        ],
      },
      {
        type: "heading",
        text: "3. Know your numbers",
      },
      {
        type: "paragraph",
        text: "Blood pressure, cholesterol and resting heart rate are quiet signals — you cannot feel them change until they are significantly off. An annual check-up catches drift early, when it is easiest to correct. If you have a family history of heart disease, talk to your doctor about starting earlier.",
      },
      {
        type: "quote",
        text: "The best time to start caring for your heart was twenty years ago. The second best time is this week.",
        cite: "Dr. Emily Carter",
      },
      {
        type: "heading",
        text: "4. Protect your sleep",
      },
      {
        type: "paragraph",
        text: "Adults who regularly sleep fewer than seven hours carry a higher risk of high blood pressure and irregular heartbeat. A consistent bedtime, a cool dark room and no screens in the last half hour are small changes with outsized cardiovascular returns.",
      },
      {
        type: "heading",
        text: "5. Take stress seriously — gently",
      },
      {
        type: "paragraph",
        text: "Chronic stress keeps your nervous system in a low simmer that nudges blood pressure up and recovery down. Ten minutes of unhurried breathing, a walk without your phone, or simply protecting one evening a week makes a measurable difference. And when something feels wrong — chest pressure, unusual shortness of breath, pain that spreads to the arm or jaw — do not wait. Call us.",
      },
    ],
  },
  {
    slug: "when-to-schedule-a-health-check",
    category: "Prevention",
    date: "Sep 4, 2026",
    publishedAt: "2026-09-04",
    readingTime: 4,
    title: "When Should You Schedule a Health Check?",
    description:
      "A practical timeline for screenings and check-ups by age, so nothing important slips by.",
    image: "/images/blog-checkup.jpg",
    author: {
      name: "Dr. Daniel Brooks",
      role: "General Practitioner",
      avatar: "/images/doctor-daniel.jpg",
      bio: "Everyday medicine done thoroughly — prevention, screening and follow-up.",
    },
    content: [
      {
        type: "paragraph",
        text: "Most serious health problems announce themselves quietly first — a slow rise in blood pressure, a lab value drifting out of range. Screening exists to catch that quiet phase. The trick is knowing which checks matter at which age, so you get the protection without the unnecessary tests.",
      },
      {
        type: "heading",
        text: "In your twenties and thirties",
      },
      {
        type: "paragraph",
        text: "This is the foundation decade. A check-up every two to three years is usually enough if you feel well, but it should include blood pressure, a basic blood panel and a dental visit every six months. Keep your vaccinations current — protection from some childhood vaccines fades with time.",
      },
      {
        type: "list",
        items: [
          "Blood pressure: every routine visit, at minimum every 2–3 years",
          "Cholesterol baseline: once in your twenties, then as advised",
          "Dental cleaning: every six months",
          "Skin check: yearly if you have many moles or fair skin",
        ],
      },
      {
        type: "heading",
        text: "In your forties",
      },
      {
        type: "paragraph",
        text: "Annual check-ups become worthwhile from around forty. This is the decade when blood pressure, blood sugar and cholesterol commonly begin to drift, and when early detection pays its largest dividends. Most adults should also discuss bowel cancer screening, which typically starts between forty-five and fifty depending on your risk profile.",
      },
      {
        type: "heading",
        text: "Fifty and beyond",
      },
      {
        type: "paragraph",
        text: "Screening broadens: bowel cancer checks become routine, women discuss mammography and bone density, and men discuss prostate testing with their doctor. An annual visit now does double duty — it screens and it fine-tunes medications, vision, hearing and mobility so you stay independent longer.",
      },
      {
        type: "quote",
        text: "A check-up is not about finding something wrong. It is about having a baseline, so change becomes visible.",
      },
      {
        type: "heading",
        text: "Whenever something changes",
      },
      {
        type: "paragraph",
        text: "Timelines aside, the rule is simple: if something persistent changes — unexplained weight change, ongoing fatigue, a new pain that lasts more than a few weeks — book a visit now rather than waiting for a scheduled one. You know your body's rhythm better than any calendar does.",
      },
    ],
  },
  {
    slug: "why-better-sleep-matters",
    category: "Wellbeing",
    date: "Aug 27, 2026",
    publishedAt: "2026-08-27",
    readingTime: 4,
    title: "Why Better Sleep Matters More Than You Think",
    description:
      "Sleep is when your body repairs itself. Here is how to protect the hours that matter most.",
    image: "/images/blog-sleep.jpg",
    author: {
      name: "Dr. James Wilson",
      role: "Neurologist",
      avatar: "/images/doctor-james.jpg",
      bio: "Specialist in headache medicine, sleep disorders and neuro-diagnostics.",
    },
    content: [
      {
        type: "paragraph",
        text: "Sleep is not downtime. While you rest, your brain files the day's memories, your muscles repair, and your immune and hormonal systems recalibrate. Cut those hours short and nothing breaks immediately — which is exactly why poor sleep is so easy to ignore, and why its effects accumulate so quietly.",
      },
      {
        type: "heading",
        text: "What happens when you sleep badly",
      },
      {
        type: "paragraph",
        text: "Even a few short nights measurably dull attention, memory and mood. Months of fragmented sleep are associated with higher blood pressure, impaired blood-sugar control and a considerably higher risk of anxiety and low mood. Sleep is one of the few health levers that touches nearly every other system at once.",
      },
      {
        type: "heading",
        text: "Fix the rhythm first",
      },
      {
        type: "paragraph",
        text: "The single strongest sleep signal you can give your brain is a consistent schedule. Go to bed and get up at roughly the same time every day — including weekends. Your body builds its sleep pressure and wake drive around that anchor; keep the anchor steady and most mild sleep problems resolve within a few weeks.",
      },
      {
        type: "list",
        items: [
          "Get daylight within an hour of waking — it sets your body clock",
          "Cut caffeine after early afternoon; it lingers for 8+ hours",
          "Keep the bedroom cool, dark and screen-free in the last half hour",
          "Reserve the bed for sleep — not work, not scrolling",
        ],
      },
      {
        type: "heading",
        text: "When to talk to a doctor",
      },
      {
        type: "paragraph",
        text: "Loud snoring with daytime sleepiness, waking unrefreshed despite enough hours, or lying awake most nights for more than a month are all worth a consultation. Sleep apnea and chronic insomnia are common, treatable conditions — not things to simply put up with.",
      },
      {
        type: "quote",
        text: "Nothing you do during the day works as well as it should if the night before was short.",
        cite: "Dr. James Wilson",
      },
    ],
  },
];

/* ------------------------------- Blog comments ------------------------------- */

export type BlogComment = {
  id: string;
  author: string;
  /** Empty string renders an initials avatar instead of an image. */
  avatar: string;
  date: string;
  text: string;
  replies: BlogComment[];
};

export const seedComments: Record<string, BlogComment[]> = {
  "improve-your-heart-health": [
    {
      id: "c-heart-1",
      author: "Sophia Anderson",
      avatar: "/images/patient-sophia.jpg",
      date: "Sep 13, 2026",
      text: "The three ten-minute walks tip made the 150-minute goal feel achievable for the first time. Two weeks in and my resting heart rate is already trending down.",
      replies: [
        {
          id: "c-heart-1-r1",
          author: "Dr. Emily Carter",
          avatar: "/images/doctor-emily.jpg",
          date: "Sep 14, 2026",
          text: "Wonderful progress, Sophia! Consistency beats intensity every time — keep the walks enjoyable and the numbers will follow.",
          replies: [],
        },
      ],
    },
    {
      id: "c-heart-2",
      author: "Marcus Lee",
      avatar: "",
      date: "Sep 15, 2026",
      text: "Is it ever too late to start? I am 58 and have never really exercised.",
      replies: [],
    },
  ],
  "when-to-schedule-a-health-check": [
    {
      id: "c-check-1",
      author: "Rachel Nguyen",
      avatar: "/images/avatar-p3.jpg",
      date: "Sep 5, 2026",
      text: "Bookmarking the forties list. I had no idea bowel screening could start before fifty — will ask at my next visit.",
      replies: [],
    },
  ],
  "why-better-sleep-matters": [
    {
      id: "c-sleep-1",
      author: "Emma Collins",
      avatar: "/images/avatar-p1.jpg",
      date: "Aug 28, 2026",
      text: "The daylight-within-an-hour-of-waking tip sounded trivial but it has genuinely shifted my energy levels. Four weeks of consistent wake times now.",
      replies: [
        {
          id: "c-sleep-1-r1",
          author: "Dr. James Wilson",
          avatar: "/images/doctor-james.jpg",
          date: "Aug 29, 2026",
          text: "That anchor habit does most of the heavy lifting. Great to hear it is working for you, Emma.",
          replies: [],
        },
      ],
    },
  ],
};

/* ------------------------------------ FAQ ------------------------------------ */

export const faqs = [
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
] as const;

/* ----------------------------------- Footer ---------------------------------- */

export const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Doctors", href: "/doctors" },
      { label: "Services", href: "/services" },
      { label: "Appointment", href: "/appointment" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Cardiology", href: "/services" },
      { label: "General Medicine", href: "/services" },
      { label: "Dental Care", href: "/services" },
      { label: "Pediatrics", href: "/services" },
      { label: "Neurology", href: "/services" },
    ],
  },
] as const;
