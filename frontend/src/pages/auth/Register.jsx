import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Please fill in the form to register
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5">

          {/* FULL NAME */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="name@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-all"
          >
            Register
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link 
            to={"/Login"} 
            className="text-slate-900 font-semibold cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}