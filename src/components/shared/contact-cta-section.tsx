export function ContactCtaSection() {
  return (
    <section className="container mx-auto px-6 pb-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[14px] bg-[#EAF3FF] px-6 py-10 text-center">
        <div className="pointer-events-none absolute right-16 top-[-44px] h-[180px] w-[180px] rounded-full border-4 border-[#bfdbfe]" />
        <h3 className="section-title relative z-10 text-[#1672E6]">Interested? Contact us directly.</h3>
        <p className="section-desc relative z-10 mt-1 text-slate-500">Our team is here to provide personalized guidance and support reach out anytime.</p>
        <button
          type="button"
          className="relative z-10 mt-5 rounded-md bg-[#1672E6] px-7 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
        >
          Contact Us
        </button>
      </div>
    </section>
  );
}
