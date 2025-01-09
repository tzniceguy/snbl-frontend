"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { register } from "@/api/api";
import { registerData } from "@/api/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
    } else {
      // Handle registration
      const formData: registerData = {
        user: {
          username,
          email,
          first_name: firstname,
          last_name: lastname,
          phone_number: phonenumber,
        },
        address,
        password,
        password2,
      };

      try {
        await register(formData);
        // Redirect or show success message
        router.push("/profile");
      } catch (error) {
        console.error("Registration failed", error);
        // Show error message
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-sm mx-auto pt-20 pb-8 px-6">
        <form className="w-full" onSubmit={handleSubmit}>
          <header>
            <h1 className="text-center text-xl">
              {isLogin ? "Ingia" : "Jisajili"} ili kuendelea
            </h1>
          </header>

          <main className="mt-16">
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <label htmlFor="username" className="block">
                    <span className="text-sm">Jina la mtumiaji</span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                      required
                    />
                  </label>
                  <label htmlFor="firstname" className="block">
                    <span className="text-sm">Jina La Kwanza</span>
                    <input
                      type="text"
                      id="firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                      required
                    />
                  </label>
                  <label htmlFor="lastname" className="block">
                    <span className="text-sm">Jina La Pili</span>
                    <input
                      type="text"
                      id="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                      required
                    />
                  </label>
                  <label htmlFor="phonenumber" className="block">
                    <span className="text-sm">Namba ya simu</span>
                    <input
                      type="text"
                      id="phonenumber"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                      required
                    />
                  </label>
                  <label htmlFor="address" className="block">
                    <span className="text-sm">Anwani</span>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                      required
                    />
                  </label>
                </>
              )}
              <label htmlFor="email" className="block">
                <span className="text-sm">Barua pepe</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                  required
                />
              </label>
              <label htmlFor="password" className="block">
                <span className="text-sm">Neno la siri</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                  required
                />
              </label>
              {!isLogin && (
                <label htmlFor="password2" className="block">
                  <span className="text-sm">Thibitisha Neno la siri</span>
                  <input
                    type="password"
                    id="password2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                    required
                  />
                </label>
              )}
            </div>

            {isLogin && (
              <div className="mt-2">
                <Link
                  href="/forgot-password"
                  className="float-right text-sm text-sky-800 hover:text-sky-600"
                >
                  Umesahau neno siri?
                </Link>
              </div>
            )}
          </main>

          <footer className="mt-8 flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              {isLogin ? "Ingia" : "Jisajili"}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
            >
              {isLogin ? "Tengeneza akaunti" : "Nina akaunti tayari"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
