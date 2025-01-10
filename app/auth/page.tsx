"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/api/api";
import type { RegisterData, LoginData } from "@/api/api";

type FormFields = {
  email: string;
  password: string;
  password2: string;
  firstname: string;
  username: string;
};

const INITIAL_FORM_STATE: FormFields = {
  email: "",
  password: "",
  password2: "",
  firstname: "",
  username: "",
};

export default function Page() {
  const [formData, setFormData] = useState<FormFields>(INITIAL_FORM_STATE);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError("Tafadhali jaza nafasi zote muhimu");
      return false;
    }

    if (!isLogin) {
      if (!formData.username || !formData.firstname) {
        setError("Tafadhali jaza nafasi zote muhimu");
        return false;
      }

      if (formData.password !== formData.password2) {
        setError("Maneno ya siri hayafanani");
        return false;
      }

      // Basic email validation for registration only
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Tafadhali ingiza barua pepe sahihi");
        return false;
      }
    }

    if (formData.password.length < 8) {
      setError("Neno la siri linahitaji angalau herufi 8");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const loginData: LoginData = {
          username: formData.username,
          password: formData.password,
        };

        const response = await login(loginData);
        if (response && typeof response === "object") {
          localStorage.setItem("userProfile", JSON.stringify(response));
          router.push("/profile");
        }
      } else {
        const registrationData: RegisterData = {
          user: {
            username: formData.username,
            email: formData.email,
            first_name: formData.firstname,
          },
          password: formData.password,
          password2: formData.password2,
        };

        const response = await register(registrationData);
        if (response && typeof response === "object") {
          localStorage.setItem("userProfile", JSON.stringify(response));
          router.push("/profile");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.user?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "Kuna hitilafu imetokea";
      setError(errorMessage);
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    id: keyof FormFields,
    label: string,
    type: string = "text",
    required: boolean = true,
  ) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={formData[id]}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        required={required}
        disabled={isLoading}
        autoComplete={type === "password" ? "current-password" : "off"}
      />
    </div>
  );

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData(INITIAL_FORM_STATE);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Ingia" : "Jisajili"} ili kuendelea
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && renderInput("firstname", "Jina La Kwanza")}
            {renderInput("username", "Jina la mtumiaji")}
            {!isLogin && renderInput("email", "Barua pepe", "email")}
            {renderInput("password", "Neno la siri", "password")}
            {!isLogin &&
              renderInput("password2", "Thibitisha Neno la siri", "password")}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Umesahau neno siri?
                </Link>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Inaendelea...
                  </span>
                ) : isLogin ? (
                  "Ingia"
                ) : (
                  "Jisajili"
                )}
              </button>

              <button
                type="button"
                onClick={toggleAuthMode}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {isLogin ? "Tengeneza akaunti" : "Nina akaunti tayari"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
