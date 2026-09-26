import {
  BookOpenCheck,
  CalendarClock,
  CircleHelp,
  Clock,
  FileText,
  HeartPulse,
  LayoutTemplate,
  ListChecks,
  MessagesSquare,
  PhoneCall,
  Quote,
  Settings,
  Sparkles,
  Stethoscope,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "image";

export type FieldDef = {
  /** Dotted path within the group value, e.g. "about.title". */
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
};

export type ListDef = {
  key: string;
  label: string;
  /** Singular name used for the "add" button, e.g. "service". */
  itemLabel: string;
  fields: FieldDef[];
  help?: string;
};

export type ContentGroup = {
  /** DB key — one SiteContent row per group. */
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: "general" | "home" | "pages";
  fields: FieldDef[];
  lists: ListDef[];
};

const CONTACT_FIELDS: FieldDef[] = [
  { key: "name", label: "Site Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "phone", label: "Phone (display)", type: "text" },
  {
    key: "phoneHref",
    label: "Phone link",
    type: "text",
    placeholder: "tel:+1234567890",
  },
  { key: "email", label: "Email (display)", type: "text" },
  {
    key: "emailHref",
    label: "Email link",
    type: "text",
    placeholder: "mailto:hello@docavia.com",
  },
  { key: "address", label: "Street address", type: "text" },
  { key: "city", label: "City / region", type: "text" },
  { key: "copyright", label: "Footer copyright line", type: "text" },
  {
    key: "footerTagline",
    label: "Footer tagline",
    type: "textarea",
    help: "Short mission line under the logo in the footer.",
  },
];

export const contentGroups: ContentGroup[] = [
  {
    key: "site",
    title: "Site Settings",
    description:
      "Clinic identity and contact details used across the navbar, footer and every page.",
    icon: Settings,
    category: "general",
    fields: CONTACT_FIELDS,
    lists: [],
  },
  {
    key: "infoBar",
    title: "Info Bar",
    description:
      "The three-card strip under the homepage hero — emergency care, hours and the appointment shortcut.",
    icon: PhoneCall,
    category: "home",
    fields: [],
    lists: [
      {
        key: "items",
        label: "Info Cards",
        itemLabel: "card",
        help: "One line per row in the card. Leave the action empty to hide the link.",
        fields: [
          { key: "title", label: "Title", type: "text" },
          {
            key: "lines",
            label: "Lines",
            type: "textarea",
            help: "One line per row.",
          },
          { key: "actionLabel", label: "Action label", type: "text" },
          { key: "actionHref", label: "Action link", type: "text" },
        ],
      },
    ],
  },
  {
    key: "hero",
    title: "Hero",
    description:
      "The first screen of the homepage — headline, intro copy and both call-to-action buttons.",
    icon: Sparkles,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      {
        key: "titleAccent",
        label: "Title accent (italic part)",
        type: "text",
      },
      { key: "description", label: "Description", type: "textarea" },
      { key: "primaryCta", label: "Primary button", type: "text" },
      { key: "secondaryCta", label: "Secondary button", type: "text" },
      { key: "ratingValue", label: "Rating (e.g. 4.9/5)", type: "text" },
      { key: "ratingLabel", label: "Rating caption", type: "text" },
    ],
    lists: [],
  },
  {
    key: "about",
    title: "About",
    description:
      "Homepage about block — story copy, the experience badge and the four benefit bullets.",
    icon: HeartPulse,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonLabel", label: "Button", type: "text" },
      { key: "badgeValue", label: "Badge value", type: "text" },
      { key: "badgeLabel", label: "Badge label", type: "text" },
    ],
    lists: [
      {
        key: "benefits",
        label: "Benefits",
        itemLabel: "benefit",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "Services",
    description:
      "Homepage services grid — heading, intro paragraph and the six service cards.",
    icon: Stethoscope,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
    ],
    lists: [
      {
        key: "items",
        label: "Service Cards",
        itemLabel: "service",
        help: "Card colors and icons stay as designed; first and fourth cards use the accent styles.",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "whyUs",
    title: "Why Us",
    description:
      "Homepage why-Docavia block — heading, the satisfaction badge and the numbered feature list.",
    icon: Star,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "badgeValue", label: "Badge value", type: "text" },
      { key: "badgeLabel", label: "Badge label", type: "text" },
    ],
    lists: [
      {
        key: "features",
        label: "Features",
        itemLabel: "feature",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    ],
  },
  {
    key: "stats",
    title: "Stats",
    description:
      "The four counters shown under the why-us block (years, specialists, patients, services).",
    icon: TrendingUp,
    category: "home",
    fields: [],
    lists: [
      {
        key: "items",
        label: "Counters",
        itemLabel: "counter",
        fields: [
          { key: "value", label: "Value (number)", type: "number" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
  },
  {
    key: "doctors",
    title: "Doctors",
    description:
      "Homepage specialists grid — heading only. The doctors themselves are managed under Administration → Doctors.",
    icon: Users,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "viewAllLabel", label: "View-all button", type: "text" },
    ],
    lists: [],
  },
  {
    key: "appointmentCta",
    title: "Appointment Banner",
    description:
      "Dark banner driving visitors to the appointment page — heading, copy and button.",
    icon: CalendarClock,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonLabel", label: "Button", type: "text" },
    ],
    lists: [],
  },
  {
    key: "howItWorks",
    title: "How It Works",
    description:
      "The three-step booking explainer — heading, copy and the numbered steps.",
    icon: ListChecks,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    lists: [
      {
        key: "steps",
        label: "Steps",
        itemLabel: "step",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "text" },
        ],
      },
    ],
  },
  {
    key: "testimonials",
    title: "Testimonials",
    description:
      "Patient quotes carousel — heading only. The quotes themselves are managed under Adminstration → Testimonials.",
    icon: Quote,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
    ],
    lists: [],
  },
  {
    key: "articles",
    title: "Articles",
    description: "Homepage journal heading. Article posts live in the blog.",
    icon: BookOpenCheck,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "viewAllLabel", label: "View-all button", type: "text" },
    ],
    lists: [],
  },
  {
    key: "faq",
    title: "FAQ",
    description:
      "Questions accordion used on the homepage, services, contact and appointment pages.",
    icon: CircleHelp,
    category: "home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "callLabel", label: "Call caption", type: "text" },
    ],
    lists: [
      {
        key: "items",
        label: "Questions",
        itemLabel: "question",
        fields: [
          { key: "question", label: "Question", type: "text" },
          { key: "answer", label: "Answer", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "finalCta",
    title: "Closing Banner",
    description: "Closing banner of the homepage — heading, copy and buttons.",
    icon: Sparkles,
    category: "home",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "titleAccent", label: "Title accent (italic part)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "primaryCta", label: "Primary button", type: "text" },
      { key: "secondaryCta", label: "Secondary button", type: "text" },
    ],
    lists: [],
  },
  {
    key: "openingHours",
    title: "Opening Hours",
    description:
      "Weekly schedule card shown on the appointment page. Sunday is rendered as closed when hours are set to “Closed”.",
    icon: Clock,
    category: "pages",
    fields: [],
    lists: [
      {
        key: "items",
        label: "Week",
        itemLabel: "day",
        fields: [
          { key: "day", label: "Day", type: "text" },
          { key: "hours", label: "Hours", type: "text" },
        ],
      },
    ],
  },
  {
    key: "pages",
    title: "Page Intros",
    description:
      "Breadcrumb label, eyebrow, heading and intro of every inner page hero.",
    icon: LayoutTemplate,
    category: "pages",
    fields: (
      [
        ["about", "About"],
        ["services", "Services"],
        ["doctors", "Doctors"],
        ["blog", "Blog"],
        ["contact", "Contact"],
        ["appointment", "Appointment"],
      ] as const
    ).flatMap(([page, title]) => [
      { key: `${page}.eyebrow`, label: `${title} — eyebrow`, type: "text" as FieldType },
      { key: `${page}.title`, label: `${title} — title`, type: "text" as FieldType },
      {
        key: `${page}.titleAccent`,
        label: `${title} — title accent (italic part)`,
        type: "text" as FieldType,
      },
      {
        key: `${page}.description`,
        label: `${title} — description`,
        type: "textarea" as FieldType,
      },
    ]),
    lists: [],
  },
];

export function getGroup(key: string): ContentGroup | undefined {
  return contentGroups.find((group) => group.key === key);
}

/** Human-readable legend for docs and the dashboard empty state. */
export const upcomingAreas = [
  { icon: FileText, title: "Blog Articles", note: "Post CRUD + rich body editor" },
  { icon: MessagesSquare, title: "Comments Moderation", note: "Approve / reply / delete" },
  { icon: BookOpenCheck, title: "Legal Pages", note: "Privacy policy & terms editor" },
];
