"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Upload } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(`Account created! Your Employee ID: ${data.employeeId}`)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (error: any) {
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg mb-4">
            <span className="text-2xl font-bold text-white">App/Web Logo</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign Up Page</h1>
        </div>

        {/* Sign Up Form */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name with Upload Logo Button */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Company Name :-
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter company name"
                  required
                />
                <button
                  type="button"
                  className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="Upload Logo"
                >
                  <Upload size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 italic">
                * Upload Logo feature available after signup
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Name :-
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email :-
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Phone :-
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password :-
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Confirm Password :-
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "SIGN UP"}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-pink-400 hover:text-pink-300 font-semibold"
                >
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Note Section */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-yellow-400 font-semibold mb-3 text-center">Note</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <span>
                Manual user cannot register, so when the HR or Admins or Admin creates a new User/Employee there ID should also be created with this method.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <span>
                There password should be auto generated for the first time by the system.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <span>
                They can login and change the system generated password.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}