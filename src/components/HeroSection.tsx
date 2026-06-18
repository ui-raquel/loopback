export function HeroSection() {
    return (
        <div className="flex flex-col items-start max-w-md text-white">
            <div className="absolute bottom-0 left-0 w-200 h-1/2 overflow-hidden z--10 opacity-15">
                <img
                    src="/assets/dave-high-rating.svg"
                    alt="Landing Image"
                    className="w-full h-auto"
                />
            </div>
            
            <div className="flex items-center mb-6">
                <span>
                    <img
                        src="/assets/logo.svg"
                        alt="Loopback Logo"
                        className="w-50 h-auto inline-block mr-2"
                    />
                </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight z-10">
                Ask & Give Feedback
            </h1>

            <p className="text-lg opacity-90">
                Join design and UI/UX students and help them improve their work!
                In exchange, you'll receive feedback on yours.
            </p>
        </div>
    );
}