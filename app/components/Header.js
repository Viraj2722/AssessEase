"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "../services/auth";

const Header = () => {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="flex justify-between items-center mb-4 pb-3 border-b px-4 lg:px-0">
            <button
                onClick={handleLogout}
                className="ml-auto flex gap-2 bg-blue-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded hover:bg-blue-600 text-sm lg:text-base"
            >
                <LogOut size={16} className="hidden lg:block" />
                <span className="lg:ml-2">Logout</span>
            </button>
        </header>
    );
};

export default Header;
