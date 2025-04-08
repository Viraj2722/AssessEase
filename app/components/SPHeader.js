import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../services/auth"

const Header = ({ onStatusChange }) => {
    const router = useRouter()
    const [selectedTask, setSelectedTask] = useState("Pending")
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const handleSelectTask = (task) => {
        setSelectedTask(task)
        setIsOpen(false)
        // Convert to lowercase for API consistency
        const status = task.toLowerCase()
        onStatusChange(status)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="flex justify-between items-center mb-4 pb-3 border-b">
            <div className="flex-1 flex justify-between items-center">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex gap-2 items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                        {selectedTask}
                        <svg
                            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100">
                            <div className="py-1">
                                {["Pending", "Submitted"].map((task) => (
                                    <button
                                        key={task}
                                        onClick={() => handleSelectTask(task)}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        {task}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header