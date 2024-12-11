import { useAuth } from '@/context/context';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const FullScreenLoader: React.FC = () => {
    const [dotCount, setDotCount] = useState(1);
    const pathName = usePathname();

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prevCount) => (prevCount % 3) + 1);
        }, 500);


        return () => {
            clearInterval(interval);
        };
    }, []);

    const { isAuthenticated } = useAuth();

    const router = useRouter();
    useEffect(() => {
        if (isAuthenticated && pathName == "/") router.push("/process");
        if (!isAuthenticated && pathName != "/") router.push("/");
    }, [isAuthenticated, pathName, router]
    );

    return (
        <div className="fixed inset-0 w-full h-full z-50 min-w-screen flex items-center justify-center min-h-screen bg-indigo-950 text-white">
            <div className="text-center">
                <p className="mb-4 text-lg">
                    Redireccionando<span className="dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </p>
                <div className="loader mx-auto"></div>
            </div>
        </div>
    );
};

export default FullScreenLoader;
