"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    if (isLogin) {
      // Handle login
    } else {
      // Handle registration
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
            <label htmlFor="firstname" className="block">
                <span className="text-sm">Jina La Kwanza</span>
                <input
                  type="text"
                  id="firtname"
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
                  id="firtname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                  required
                />
              </label>
              <label htmlFor="phonenumber" className="block">
                <span className="text-sm">namba ya simu</span>
                <input
                  type="text"
                  id="firtname"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  className="w-full mt-1 p-2 border outline-none rounded focus:border-blue-500"
                  required
                />
              </label>
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
