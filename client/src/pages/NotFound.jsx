// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FaArrowRight, FaRocket, FaSadTear } from 'react-icons/fa';

export default function NotFound() {
    useEffect(() => {
        document.title = "Page Not Found | MyApp";
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col items-center justify-center p-6 text-center">
            {/* Animasi Container */}
            <div className="relative mb-12">
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-primary/20 animate-float"></div>
                <div className="absolute -bottom-4 -right-6 w-12 h-12 rounded-full bg-secondary/20 animate-float-delay"></div>

                {/* Main Illustration */}
                <div className="relative z-10">
                    <div className="text-9xl font-bold text-primary flex justify-center items-end">
                        4
                        <div className="relative">
                            <FaSadTear className="text-6xl mb-2 mx-2 text-accent" />
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></div>
                        </div>
                        4
                    </div>
                </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Oops! Lost in Space</h1>
            <p className="text-lg mb-8 max-w-md">
                The page you&apos;re looking for has been abducted by aliens or never existed.
            </p>

            {/* Animated Rocket Button */}
            <Link
                to="/"
                className="btn btn-primary btn-lg group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
                <span>Back to Home</span>
                <FaArrowRight className="ml-2 group-hover:rotate-90 transition-transform duration-300" />
            </Link>

            {/* Fun Facts Section */}
            <div className="mt-12 bg-base-300/50 p-6 rounded-2xl max-w-md">
                <div className="flex items-start">
                    <FaRocket className="text-2xl mr-3 mt-1 text-accent" />
                    <div>
                        <h3 className="font-bold mb-2">Did You Know?</h3>
                        <p className="text-sm">
                            A 404 error is named after room 404 at CERN where the original web servers were located.
                            The room didn&apos;t exist, just like this page!
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out 1s infinite;
        }
      `}</style>
        </div>
    );
}