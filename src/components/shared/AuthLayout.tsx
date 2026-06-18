"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  backToHomeUrl?: string;
  footer?: ReactNode;
}

export function AuthLayout({
  children,
  title,
  description,
  backToHomeUrl = "/",
  footer,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* Left side: Premium architectural image */}
      <div className="relative hidden lg:block lg:col-span-6 xl:col-span-6 h-screen overflow-hidden">
        <Image
          src="/images/auth-banner.jpg"
          alt="Modern architectural home"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        {/* Subtle premium overlay for better contrast and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/10 pointer-events-none" />
      </div>

      {/* Right side: Elegant Form Card */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-6 flex flex-col justify-between min-h-screen p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20">
        {/* Header link */}
        <div className="flex justify-end w-full">
          <Link
            href={backToHomeUrl}
            className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-[480px] mt-auto mb-[4vh] lg:mb-[5vh] py-6 flex flex-col justify-center">
          <div className="flex flex-col space-y-2.5 mb-8">
            <h1 className="text-[40px] leading-[150%] font-bold font-serif text-[#0678EF] text-center">
              {title}
            </h1>
            <p className="text-slate-500 text-[18px] leading-[150%] font-normal font-poppins text-center">
              {description}
            </p>
          </div>

          <div className="bg-white lg:bg-transparent lg:shadow-none lg:p-0 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 lg:border-none">
            {children}
          </div>

          {footer && (
            <div className="mt-8 text-center text-sm text-slate-500 font-normal">
              {footer}
            </div>
          )}
        </div>

        {/* Footer info/copyright */}
        <div className="w-full text-center text-xs text-slate-400 font-normal mt-auto pt-6">
          © {new Date().getFullYear()} ALH Hub. All rights reserved.
        </div>
      </div>
    </div>
  );
}
