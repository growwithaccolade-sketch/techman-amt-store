"use client";

import { useEffect } from "react";

const selectors = [
  ".premiumHeroCopy > *",
  ".heroStage",
  ".brandRail > span",
  ".premiumSectionHead",
  ".collectionTile",
  ".premiumDealCopy > *",
  ".dealFeatureItem",
  ".premiumProductCard",
  ".whyLead",
  ".whyGrid article",
  ".editorialMedia",
  ".editorialCopy > *",
  ".insightCard",
  ".homeContactBand > *",
  ".premiumNewsletterInner > *",
  ".contactHero > *",
  ".contactCards article",
  ".catalogHero > *",
  ".catalogControls",
  ".catalogPremiumGrid .premiumProductCard",
  ".productHero > *",
  ".specSection > *",
  ".reviewsSection > *",
  ".relatedCard",
  ".pageIntro > *",
  ".cartLine",
  ".orderSummary",
  ".formSection",
  ".couponBox",
  ".secureNote",
  ".accountCard",
  ".accountOrder",
  ".infoHero > *",
  ".infoContent > section",
  ".infoAside"
];

export default function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const progress = document.createElement("div");
    progress.className = "scrollProgress";
    document.body.appendChild(progress);

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
      document.body.classList.toggle("siteScrolled", window.scrollY > 18);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(",")));
    elements.forEach((element, index) => {
      element.classList.add("revealItem");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        element.classList.add("isRevealed");
      }
    });

    if (reduced) {
      elements.forEach((element) => element.classList.add("isRevealed"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("isRevealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      elements.forEach((element) => observer.observe(element));

      const hoverTargets = Array.from(
        document.querySelectorAll<HTMLElement>(".premiumProductCard,.collectionTile,.insightCard,.contactCards article")
      );

      hoverTargets.forEach((target) => {
        const move = (event: MouseEvent) => {
          const rect = target.getBoundingClientRect();
          target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          target.style.setProperty("--my", `${event.clientY - rect.top}px`);
        };
        target.addEventListener("mousemove", move);
        (target as HTMLElement & { __move?: (e: MouseEvent) => void }).__move = move;
      });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", updateScroll);
        progress.remove();
        hoverTargets.forEach((target) => {
          const move = (target as HTMLElement & { __move?: (e: MouseEvent) => void }).__move;
          if (move) target.removeEventListener("mousemove", move);
        });
      };
    }

    return () => {
      window.removeEventListener("scroll", updateScroll);
      progress.remove();
      root.classList.remove("motionReady");
    };
  }, []);

  return null;
}
