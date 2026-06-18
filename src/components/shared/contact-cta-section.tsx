import { TranslatedText } from '@/components/shared/translated-text'

export function ContactCtaSection() {
  return (
    <section className="container mx-auto px-4 pb-6 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[14px] bg-[#EAF3FF] px-4 py-10 text-center sm:px-6">
        <div className="pointer-events-none absolute right-16 top-[-44px] hidden h-[180px] w-[180px] rounded-full border-4 border-[#bfdbfe] md:block" />
        <h3 className="section-title relative z-10 text-[#1672E6]">
          <TranslatedText
            text="Interested? Contact us directly."
            cacheKey="cta:heading"
          />
        </h3>
        <p className="section-desc relative z-10 mt-1 text-slate-500">
          <TranslatedText
            text="Our team is here to provide personalized guidance and support reach out anytime."
            cacheKey="cta:body"
          />
        </p>
        <button
          type="button"
          className="relative z-10 mt-5 rounded-md bg-[#1672E6] px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] sm:px-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
        >
          <TranslatedText text="Contact Us" cacheKey="cta:button" />
        </button>
      </div>
    </section>
  );
}
