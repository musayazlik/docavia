/* Every editable string on the site, mirroring src/lib/content/defaults.ts.
   `icon` fields hold a CMS icon name; core.js falls back to the lucide icon at
   the same index when the name is empty. */

window.DOCAVIA = window.DOCAVIA || {};

(function (D) {
  D.content = {
    infoBar: {
      items: [
        {
          icon: "",
          title: "Emergency Care",
          lines: ["24/7 Emergency Support", "+1 234 567 890"],
          actionLabel: "",
          actionHref: ""
        },
        {
          icon: "",
          title: "Opening Hours",
          lines: ["Mon – Fri", "08:00 – 20:00"],
          actionLabel: "",
          actionHref: ""
        },
        {
          icon: "",
          title: "Appointment",
          lines: ["Schedule your consultation"],
          actionLabel: "Book Now",
          actionHref: "appointment.html"
        }
      ]
    },

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
      image: "assets/images/hero-doctor.jpg",
      patientAvatar1: "assets/images/avatar-p1.jpg",
      patientAvatar2: "assets/images/patient-sophia.jpg",
      patientAvatar3: "assets/images/avatar-p3.jpg"
    },

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
        { icon: "", title: "Personalized Care", description: "Treatment plans shaped around your history and goals." },
        { icon: "", title: "Experienced Specialists", description: "Board-certified doctors across 30+ medical services." },
        { icon: "", title: "Modern Technology", description: "Accurate diagnostics with the latest medical equipment." },
        { icon: "", title: "Easy Appointments", description: "Book online in under two minutes — no phone queues." }
      ]
    },

    services: {
      eyebrow: "Our Services",
      title: "Care for Every",
      titleAccent: "Stage of Life.",
      intro:
        "From everyday check-ups to specialist programs, thirty medical services under one calm roof — always with the same standard of attention.",
      items: [
        { icon: "", title: "General Medicine", description: "Everyday primary care, annual check-ups and preventive screenings for the whole family." },
        { icon: "", title: "Cardiology", description: "Advanced heart care — from ECG and stress testing to long-term cardiovascular programs." },
        { icon: "", title: "Dental Care", description: "Gentle dentistry with modern imaging, hygiene treatments and cosmetic procedures." },
        { icon: "", title: "Pediatrics", description: "Compassionate care for newborns, children and teens through every growth stage." },
        { icon: "", title: "Neurology", description: "Diagnosis and treatment for headaches, sleep disorders and neurological conditions." },
        { icon: "", title: "Physiotherapy", description: "Personalized rehabilitation programs that restore movement and build lasting strength." }
      ]
    },

    whyUs: {
      eyebrow: "Why Docavia",
      title: "Healthcare You Can",
      titleAccent: "Trust.",
      description:
        "Choosing a doctor is choosing peace of mind. Here is what every patient can expect from us — on the first visit and every one after.",
      badgeValue: "98%",
      badgeLabel: "Patient Satisfaction",
      features: [
        { title: "Expert Specialists", description: "A hand-picked team of senior physicians, each a leader in their field." },
        { title: "Advanced Technology", description: "Digital diagnostics, imaging and labs — all under one calm roof." },
        { title: "Patient-Centered Care", description: "Unrushed consultations where you are heard first and treated second." },
        { title: "Seamless Appointments", description: "Online booking, smart reminders and zero paperwork on arrival." }
      ]
    },

    stats: {
      items: [
        { value: 25, suffix: "+", label: "Years Experience" },
        { value: 50, suffix: "+", label: "Medical Specialists" },
        { value: 12, suffix: "K+", label: "Happy Patients" },
        { value: 30, suffix: "+", label: "Medical Services" }
      ]
    },

    doctors: {
      eyebrow: "Our Specialists",
      title: "Meet the People",
      titleAccent: "Behind Your Care.",
      viewAllLabel: "View All Doctors",
      items: [
        { name: "Dr. Emily Carter", specialty: "Cardiologist", bio: "Interventional cardiology with a preventive, lifestyle-first approach.", image: "assets/images/doctor-emily.jpg" },
        { name: "Dr. James Wilson", specialty: "Neurologist", bio: "Specialist in headache medicine, sleep disorders and neuro-diagnostics.", image: "assets/images/doctor-james.jpg" },
        { name: "Dr. Olivia Martin", specialty: "Pediatrician", bio: "Gentle, family-centered care from the first check-up to adolescence.", image: "assets/images/doctor-olivia.jpg" },
        { name: "Dr. Daniel Brooks", specialty: "General Practitioner", bio: "Everyday medicine done thoroughly — prevention, screening and follow-up.", image: "assets/images/doctor-daniel.jpg" }
      ]
    },

    appointmentCta: {
      eyebrow: "Book an Appointment",
      title: "Your Health Deserves the",
      titleAccent: "Right Attention.",
      description:
        "Tell us what you need and we will match you with the right specialist — usually within one working day.",
      buttonLabel: "Schedule Appointment"
    },

    howItWorks: {
      eyebrow: "How It Works",
      title: "Getting Care Should",
      titleAccent: "Be Simple.",
      description:
        "Three unhurried steps stand between you and the right care — designed to respect your time.",
      steps: [
        { title: "Find Your Doctor", description: "Browse specialists by field, read profiles and choose the right match for your needs." },
        { title: "Choose Your Time", description: "Pick a slot that fits your week and confirm instantly — no waiting on hold." },
        { title: "Get Expert Care", description: "Meet your doctor, receive a clear plan and follow up online whenever needed." }
      ]
    },

    testimonials: {
      eyebrow: "Testimonials",
      title: "Care That Patients",
      titleAccent: "Remember.",
      items: [
        { quote: "The entire experience was simple, professional and reassuring. From booking my appointment to meeting the doctor, everything felt effortless.", name: "Sophia Anderson", role: "Patient — Cardiology", avatar: "assets/images/patient-sophia.jpg" },
        { quote: "I never feel like a number here. My doctor took time to explain every option and the follow-up care has been exceptional.", name: "Emma Collins", role: "Patient — Physiotherapy", avatar: "assets/images/avatar-p1.jpg" },
        { quote: "Booking took two minutes and the reminders kept me on track. The clinic itself feels calm and genuinely welcoming.", name: "Rachel Nguyen", role: "Patient — Pediatrics", avatar: "assets/images/avatar-p3.jpg" }
      ]
    },

    articles: {
      eyebrow: "Health Journal",
      title: "Insights for",
      titleAccent: "Better Health.",
      viewAllLabel: "All Articles"
    },

    faq: {
      eyebrow: "FAQ",
      title: "Questions?",
      titleAccent: "We're Here to Help.",
      description:
        "Everything you need to know before your visit. If you can't find your answer here, our care team is one call away.",
      callLabel: "Call us anytime",
      items: [
        { question: "How do I book an appointment?", answer: "Choose a doctor and a time that suits you through our online booking, or call our front desk. You will receive an instant confirmation with everything you need to know." },
        { question: "Can I choose my doctor?", answer: "Yes. Every specialist's profile lists their field, experience and availability, so you can confidently pick the doctor who feels right for you." },
        { question: "Do you offer online consultations?", answer: "We do. Many follow-ups and first assessments can be held as secure video consultations — ideal for reviews, prescriptions and specialist advice." },
        { question: "What should I bring to my appointment?", answer: "Bring a photo ID, your insurance card if applicable, a list of current medications and any recent test results or referral letters." },
        { question: "Do you accept insurance?", answer: "We work with all major insurance providers. Our team verifies your coverage before your visit so there are no surprises." }
      ]
    },

    finalCta: {
      title: "Ready to Take Better",
      titleAccent: "Care of Your Health?",
      description:
        "Book an appointment with one of our specialists and take the next step toward better health.",
      primaryCta: "Book Appointment",
      secondaryCta: "Contact Us"
    },

    openingHours: {
      items: [
        { day: "Monday", hours: "08:00 – 20:00" },
        { day: "Tuesday", hours: "08:00 – 20:00" },
        { day: "Wednesday", hours: "08:00 – 20:00" },
        { day: "Thursday", hours: "08:00 – 20:00" },
        { day: "Friday", hours: "08:00 – 20:00" },
        { day: "Saturday", hours: "09:00 – 14:00" },
        { day: "Sunday", hours: "Closed" }
      ]
    },

    pages: {
      about: {
        label: "About",
        eyebrow: "About Docavia",
        title: "Medicine With the",
        titleAccent: "Human Touch.",
        description:
          "We are a team of specialists who believe great care starts with listening — and never stops at the prescription."
      },
      services: {
        label: "Services",
        eyebrow: "What We Offer",
        title: "Complete Care,",
        titleAccent: "Under One Roof.",
        description:
          "Thirty medical services from everyday check-ups to advanced specialist programs — always with the same standard of attention."
      },
      doctors: {
        label: "Doctors",
        eyebrow: "The Team",
        title: "Experts Who",
        titleAccent: "Listen First.",
        description:
          "Fifty board-certified physicians across thirty fields — hand-picked not only for their credentials, but for how they treat people."
      },
      blog: {
        label: "Blog",
        eyebrow: "Health Journal",
        title: "Insights for",
        titleAccent: "Better Health.",
        description:
          "Practical, physician-reviewed articles on prevention, heart health and everyday wellbeing — no scare tactics, just clarity."
      },
      contact: {
        label: "Contact",
        eyebrow: "Contact Us",
        title: "We're Here",
        titleAccent: "When You Need Us.",
        description:
          "Questions about a service, your visit or an appointment? Reach out — a real person from our care team will answer."
      },
      appointment: {
        label: "Appointment",
        eyebrow: "Book a Visit",
        title: "Book Your Visit in",
        titleAccent: "Under Two Minutes.",
        description:
          "Pick the department, the doctor and the time that suits you — our care team confirms every request personally, usually within one working day."
      }
    }
  };

  /* Inline sections that live directly in a page instead of a shared group. */
  D.inline = {
    aboutStory: {
      title: "Our Story",
      heading: "Fifteen Years of",
      headingAccent: "Better Care.",
      paragraphs: [
        "Docavia began in a single rented room with one physician, one nurse and a waiting list that never shrank. Fifteen years later we run multiple clinics — but the promise has not changed: every patient is listened to before they are treated.",
        "Today our specialists work across thirty medical services under one roof, supported by diagnostics and technology that were unimaginable when we started. What still matters most is the thing that built the practice in the first place — time, attention and care that does not rush you."
      ],
      quote:
        "The best clinic is not the one with the most equipment. It is the one where you leave feeling heard.",
      quoteCite: "Dr. Emily Carter — Founder & Medical Director"
    },
    aboutValues: { eyebrow: "Our Values", title: "What We", titleAccent: "Stand For." },
    assurances: {
      items: [
        { icon: "shield-check", title: "Insurance Accepted", description: "We work with all major providers and verify your coverage before you arrive." },
        { icon: "receipt-text", title: "Transparent Pricing", description: "Clear written estimates for every procedure — no surprises on the invoice." },
        { icon: "monitor-smartphone", title: "Records Online", description: "Results, referrals and prescriptions in your patient portal within 24 hours." }
      ]
    },
    referral: {
      title: "Not sure which service",
      titleAccent: "fits your need?",
      description:
        "Describe your symptoms in a message and our care team will point you to the right department — usually the same working day.",
      buttonLabel: "Book a Consultation"
    },
    careers: {
      title: "A great clinic is",
      titleAccent: "its people.",
      description:
        "We hire for judgment and warmth as much as credentials. If you want to do the best work of your career, we would like to meet you.",
      buttonLabel: "Join the Team"
    },
    nextSteps: {
      title: "What Happens Next",
      steps: [
        { title: "We review your request", description: "Our care team reads your details and picks the right specialist." },
        { title: "We call to confirm", description: "Usually within one working day, on the number you gave us." },
        { title: "You get a reminder", description: "A confirmation email with the time, place and what to bring." }
      ],
      footnote: "Prefer to talk to someone now?"
    },
    gettingHere: {
      eyebrow: "Getting Here",
      title: "Easy to Reach,",
      titleAccent: "Easy to Park.",
      transport: [
        { icon: "car", title: "Free patient parking", description: "60 spaces on site, including four accessible bays." },
        { icon: "train-front", title: "Metro & rail", description: "Four minutes' walk from the mainline station." },
        { icon: "bus", title: "Bus lines", description: "14, 22 and 41 stop directly outside the entrance." },
        { icon: "bike", title: "Cycling", description: "Covered bike racks and a repair stand by the door." }
      ]
    },
    contactChannels: {
      items: [
        { icon: "phone", title: "Call Us", line1: "+1 234 567 890", line2: "Mon – Fri, 08:00 – 20:00", actionLabel: "Call now", actionHref: "tel:+1234567890" },
        { icon: "mail", title: "Email Us", line1: "hello@docavia.com", line2: "Replies within one working day", actionLabel: "Write an email", actionHref: "mailto:hello@docavia.com" },
        { icon: "map-pin", title: "Visit Us", line1: "123 Medical Avenue", line2: "New York, NY", actionLabel: "Get directions", actionHref: "https://www.google.com/maps/search/?api=1&query=123+Medical+Avenue+New+York+NY", external: true },
        { icon: "clock", title: "Opening Hours", line1: "Mon – Fri · 08:00 – 20:00", line2: "Saturday · 09:00 – 14:00", actionLabel: "", actionHref: "" }
      ]
    },
    emergency: {
      title: "24/7 Emergency Line",
      description:
        "For anything urgent outside clinic hours, call the line below. A member of our clinical team answers, day or night."
    },
    heroVisual: {
      card1: { value: "500+", label: "Experienced Doctors" },
      card2: { value: "24/7", label: "Medical Support" },
      pill: "Next slot available today"
    }
  };
})(window.DOCAVIA);
