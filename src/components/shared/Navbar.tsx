export function Navbar() {
    return (
        <nav className="flex h-14 w-full items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="font-bold transition-colors duration-200 hover:text-primary">
                Next.js Boilerplate
            </div>
            <div className="ml-auto flex items-center space-x-4">
                <button className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-[0.98]">
                    Sign in
                </button>
                <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-px active:scale-[0.98]">
                    Get started
                </button>
            </div>
        </nav>
    );
}
