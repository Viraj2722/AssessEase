"use client"; 

import React from "react";
import { useRouter } from "next/navigation"; 
import { LogOut } from "lucide-react";

const Header = () => {
    const router = useRouter(); 

    const handleLogout = () => {
        localStorage.removeItem("user"); 
        router.push("/login");
    };

    return (
        <header className="flex justify-between items-center mb-4 pb-3 border-b">
            <button
                onClick={handleLogout}
                className="ml-auto flex gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                <LogOut size={16} /> Logout
            </button>
        </header>
    );
};

export default Header;
