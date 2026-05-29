import { Link, useNavigate } from "react-router-dom";
import { register } from "../../_service/auth";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(form);

      alert("Register berhasil");
      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>

          <p className="text-slate-500 mt-2">
            Please fill in the form to register
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Username
            </label>

            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              placeholder="john_doe"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
            {/* logikaalertnya */}
            {form.username && !/^[a-z0-9_]+$/.test(form.username) && (
              <p className="text-xs text-red-500 font-medium mt-1">
                Username hanya boleh huruf kecil, angka, dan underscore.
              </p>
            )}
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="John Doe"
              required
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
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="name@gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Phone
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="08123456789"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              rows="3"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              placeholder="Your address"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all resize-none"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Bio
            </label>

            <textarea
              rows="3"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
              placeholder="Tell something about yourself"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all resize-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Minimum 8 characters"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
            {form.password && form.password.length < 8 && (
              <p className="text-xs text-red-500 font-medium mt-1">
                Password minimal 8 karakter.
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={form.password_confirmation}
              onChange={(e) => {
                setForm({
                  ...form,
                  password_confirmation: e.target.value,
                });

                setErrors({
                  ...errors,
                  password: null,
                });
              }}
              placeholder="Repeat your password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
            {form.password_confirmation &&
              form.password !== form.password_confirmation && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  Password dan Confirm Password tidak sama.
                </p>
              )}
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
            className="text-slate-900 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
