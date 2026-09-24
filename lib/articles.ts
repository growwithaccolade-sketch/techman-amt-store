export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  sections: Array<{ heading: string; body: string }>;
};

export const articles: Article[] = [
  {
    slug: "how-to-choose-a-phone-for-content-creation",
    title: "How to choose a phone for content creation",
    excerpt: "A practical way to compare camera, storage, battery, audio and workflow before paying for a creator phone.",
    category: "Buying Guide",
    readTime: "6 min read",
    sections: [
      { heading: "Start with the content you actually make", body: "Short-form social video, long-form YouTube, product photography and livestreaming place different demands on a phone. Decide whether camera flexibility, battery, storage or app performance matters most before comparing models." },
      { heading: "Storage becomes a workflow problem quickly", body: "High-resolution video consumes space fast. Think about how often you can offload files, whether cloud storage fits your data plan and whether external storage is practical for your setup." },
      { heading: "Audio quality deserves its own budget", body: "A good phone does not solve every recording problem. For interviews, talking-head videos and noisy environments, a compatible wireless microphone can improve perceived quality more than a small camera upgrade." },
      { heading: "Buy for the whole setup", body: "Budget for charging, power, storage, a stable mount and any microphone or lighting you genuinely need. The cheapest phone is not always the cheapest complete workflow." }
    ]
  },
  {
    slug: "laptop-buying-guide-for-work-school-and-creative-use",
    title: "Laptop buying guide for work, school and creative use",
    excerpt: "Choose processor, memory, storage and display based on what you run every week, not what looks impressive on a spec sheet.",
    category: "Buying Guide",
    readTime: "7 min read",
    sections: [
      { heading: "List your heaviest regular tasks", body: "Browser tabs and documents need far less sustained performance than video editing, 3D work, large code builds or modern games. Base the purchase on the most demanding tasks you actually perform often." },
      { heading: "Memory affects how comfortably you multitask", body: "More memory helps when several demanding applications stay open together. It does not automatically make every workload faster, so balance RAM against processor, storage and budget." },
      { heading: "Storage speed and capacity are different decisions", body: "Fast solid-state storage improves responsiveness, while capacity determines how much you can keep locally. Creators may need external storage even with a large internal drive." },
      { heading: "Ports and battery can matter more than benchmarks", body: "Check charging, external display support, USB ports, card readers and battery expectations against your real routine. Adapters and docks add cost and friction." }
    ]
  },
  {
    slug: "creator-audio-starter-guide",
    title: "A creator's starter guide to better audio",
    excerpt: "Clear speech usually improves content faster than buying more camera gear. Here is how to think about microphones, placement and monitoring.",
    category: "Creator Tips",
    readTime: "5 min read",
    sections: [
      { heading: "Distance matters", body: "Moving a microphone closer to the speaker often improves clarity more than buying a much more expensive microphone used from far away." },
      { heading: "Choose the format for the job", body: "Wireless clip-on microphones are convenient for mobile creators and interviews, while desk and studio microphones can make sense for podcasts, streaming and voice work." },
      { heading: "Reduce problems before recording", body: "Quiet the room, control wind and clothing noise, check battery and storage, then record a short test. Prevention is easier than trying to repair unusable audio later." },
      { heading: "Keep the signal chain simple", body: "Use the fewest adapters and conversion steps you need. Confirm device compatibility before buying a microphone, receiver, cable or interface." }
    ]
  }
];

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
