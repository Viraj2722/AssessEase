import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const Header = ({ onStatusChange }) => {
    const router = useRouter()
    const [selectedTask, setSelectedTask] = useState("Pending")
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        localStorage.removeItem("user")
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
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu">
                                {["Pending", "Submitted"].map(task => (
                                    <div
                                        key={task}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectTask(task)}
                                    >
                                        {task}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                    </svg>
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header