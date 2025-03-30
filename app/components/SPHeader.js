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
            <div className="flex justify-between w-full">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                            <div className="py-1">
                                {["Pending", "Submitted"].map((task) => (
                                    <button
                                        key={task}
                                        onClick={() => handleSelectTask(task)}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
                    className="flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header