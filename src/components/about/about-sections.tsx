import Image from 'next/image'

const teamMembers = [
  {
    role: 'Management',
    name: 'Daniel van der Vee',
    phone: '0211-6868198',
    email: 'dvdv@0211wohnen.de',
  },
  {
    role: 'Finance and Controlling',
    name: 'Pascal Kusische',
    phone: '0211-6868198',
    email: 'info@0211wohnen.de',
  },
  {
    role: 'Accounting',
    name: 'Nina van der Vee',
    phone: '0211-6868198',
    email: 'nvd@0211wohnen.de',
  },
  {
    role: 'Marketing and Lettings',
    name: 'Sylvia van der Vee',
    phone: '0211-6868198',
    email: 'svd@0211wohnen.de',
  },
  {
    role: 'Letting and Controlling',
    name: 'Alexandra Schmidt',
    phone: '0211-6868198',
    email: 'as@0211wohnen.de',
  },
  {
    role: 'Property Management',
    name: 'Keavin Kosiorek',
    phone: '0211-6868198',
    email: 'hausmeister@0211wohnen.de',
  },
]

export function AboutSections() {
  return (
    <main className="space-y-24 py-12">
      <section className="container mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[16px]">
          <Image
            src="/images/about-banner.jpg"
            alt="About banner"
            width={1700}
            height={500}
            className="h-[230px] w-full object-cover object-[center_25%]"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
            <h1 className="banner-title">
              Connecting Families with Trusted Facilities
            </h1>
            <p className="banner-desc mt-3 max-w-5xl text-white/90">
              A aim to bridge the gap between families and quality care
              providers, making it simple to discover, compare, and connect with
              the right residential options for your loved ones.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.25fr]">
          <div className="grid grid-cols-[1fr_1fr] gap-5">
            <div className="relative row-span-2 overflow-hidden rounded-xl">
              <Image
                src="/images/connect-1.jpg"
                alt="Family home"
                width={760}
                height={600}
                className="h-[410px] w-full object-cover"
              />
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/images/connect-2.jpg"
                alt="People at home"
                width={760}
                height={290}
                className="h-[195px] w-full object-cover"
              />
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/images/connect-3.jpg"
                alt="Couch and laptop"
                width={760}
                height={290}
                className="h-[195px] w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="section-title text-[#1672E6]">
              Connecting People with Comfortable, Fully Furnished Homes
            </h2>
            <p className="section-desc text-slate-600">
              At our platform, our mission is to simplify the search for high
              quality furnished apartments by connecting tenants directly with
              trusted landlords and professionally managed properties. We
              believe every renter deserves clarity, reliability, and
              straightforward access to homes that match their needs without
              unnecessary complications or hidden processes. By reducing
              barriers and streamlining communication, we make finding a
              temporary home faster, easier, and more transparent, giving
              tenants the confidence to choose the right place for their stay.
            </p>
            <p className="section-desc text-slate-600">
              For landlords, our platform creates the opportunity to present
              their apartments in a professional and structured way while
              reaching the right audience efficiently. We provide the tools to
              showcase property details, highlight amenities, manage
              availability, and respond to inquiries with ease. Our goal is to
              build a space where the right tenants and the right properties
              connect seamlessly, ensuring comfortable living experiences and
              well managed rentals at the right place and the right time.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <h2 className="section-title text-[#1672E6]">
              Personal, Professional and Service-Oriented!
            </h2>
            <p className="section-desc text-slate-600">
              We are a family-run and owner-managed company specializing in the
              rental of furnished designer apartments in and around Dusseldorf.
              The properties we offer are mostly from our own portfolio,
              therefore we pay meticulous attention to an exclusive and
              consistent standard of living.
            </p>
            <p className="section-desc text-slate-600">
              In addition to our own properties, we are happy to make our rental
              platform available to selected external clients who share our
              attention to detail and our design standards . It is important
              that our standards are met! Having been active in real estate
              market for many years, we have an excellent network of companies,
              real estate agents, and relocation specialists . Thanks to the
              quality we offer and our exceptional service, we gain new partners
              every day.
            </p>
            <p className="section-desc text-slate-600">
              The 0211wohnen team consists of capable real estate specialists
              who use their respective strengths with passion and dedication in
              their respective areas of responsibility every day.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/images/service-1.jpg"
              alt="Service team"
              width={900}
              height={540}
              className="h-[360px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <h2 className="section-title text-center text-[#1672E6]">
          Why We Started
        </h2>
        <p className="section-desc mt-2 text-center text-slate-500">
          Created with a vision to make finding the right home simple,
          transparent, and reliable
        </p>
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/images/service-2.jpg"
              alt="Professional team"
              width={920}
              height={520}
              className="h-[380px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="section-desc text-slate-600">
              The idea for 0211wohnen was born from a simple observation -
              people searching for furnished apartments often face unnecessary
              complexity, unclear pricing, and too many intermediaries. High
              quality, professionally managed apartments are frequently
              difficult to find in one trusted place, while renters struggle to
              compare options and landlords lack a clear way to present their
              properties. We saw the need for a platform that removes the
              confusion, gives renters full visibility, and allows properties to
              be showcased directly and honestly without unnecessary middlemen.
            </p>
            <p className="section-desc text-slate-600">
              Our vision is to create a dependable, easy to use space where
              tenants and landlords can connect with confidence. By combining
              intuitive search tools, clear property information, and direct
              communication, we aim to make the rental process faster, smoother,
              and more transparent. 0211wohnen is more than a listing website -
              it is a platform designed to connect people with the right homes
              in the right location, with clarity and trust at every step.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16 lg:px-10">
        <h2 className="section-title text-[#1672E6]">Meet Our Team</h2>
        <p className="section-desc text-slate-500">
          Created with a vision to make finding the right home simple,
          transparent, and reliable.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map(member => (
            <article key={member.name} className="text-center">
              <div className="mx-auto w-[255px] rounded-[46%_54%_41%_59%/51%_45%_55%_49%] bg-[#0F7EFF] p-2">
                <Image
                  src="/images/team-1.png"
                  alt={member.name}
                  width={255}
                  height={180}
                  className="h-[178px] w-full rounded-[44%_56%_40%_60%/54%_46%_54%_46%] object-cover"
                />
              </div>
              <p className="mt-5 text-[14px] text-slate-500">{member.role}</p>
              <h3 className="mt-1 font-serif text-[24px] leading-[130%] text-slate-800">
                {member.name}
              </h3>
              <p className="mt-2 text-[14px] text-slate-500">{member.phone}</p>
              <p className="text-[14px] text-[#1672E6]">{member.email}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
