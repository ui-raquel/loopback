import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/feed')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-pink to-brand-red flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-10 gap-10">
      {/* Left side - branding */}
      <div className="flex flex-col items-start max-w-md text-white">
        <div className="bg-white rounded-full px-6 py-2 mb-10">
          <span className="text-xl font-bold">
            <span className="text-brand-pink">Loop</span>
            <span className="text-gray-800">BACK.</span>
          </span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Ask & Give Feedback
        </h1>

        <p className="text-lg opacity-90">
          Join design and UI/UX students and help them improve their work!
          In exchange, you'll receive feedback on yours.
        </p>
      </div>

      {/* Right side - form card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Let's Get Started!
        </h2>
        <p className="text-gray-500 mb-8">Log in to join your peers</p>

        <form onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            placeholder="yourname@university.com"
            className="w-full bg-brand-pink/10 border border-brand-pink/20 rounded-xl px-4 py-3 mb-5 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-brand-pink/10 border border-brand-pink/20 rounded-xl px-4 py-3 mb-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />

          <label className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <input type="checkbox" className="rounded" />
            Remember Me
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-brand-pink to-brand-red text-white font-medium py-3 rounded-xl hover:opacity-90 transition"
          >
            Log in
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <span className="underline font-medium text-gray-700 cursor-pointer">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login