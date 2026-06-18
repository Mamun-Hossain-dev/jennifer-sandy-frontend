export function Footer() {
    return (
        <footer className="flex w-full flex-col items-center justify-between gap-4 border-t py-6 md:h-24 md:flex-row md:px-8 md:py-0">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js, Tailwind CSS, and shadcn/ui.
            </p>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-px active:scale-[0.98]">
                Contact Us
            </button>
        </footer>
    );
}
