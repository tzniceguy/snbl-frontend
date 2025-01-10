"use client";
import React, { useState } from "react";
import { Mail, MapPin, Phone, Edit2, LogOut } from "lucide-react";
import { logout } from "@/api/api";

interface Profile {
  name: string;
  email: string;
  telephone: string;
  location: string;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
  isAddress = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isAddress?: boolean;
}) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="p-2 bg-blue-100 rounded-full">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div className="flex flex-col flex-1">
      <span className="text-sm text-gray-500">{label}</span>
      {isAddress ? (
        <address className="text-gray-700">{value}</address>
      ) : (
        <span className="text-gray-700">{value}</span>
      )}
    </div>
  </div>
);

export default function Page() {
  const [profileData, setProfileData] = useState<Profile>({
    name: "John Doe",
    email: "johndoe@example.com",
    telephone: "+2557123456789",
    location: "location",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Add your logout logic here
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen p-6">
      <div className="flex flex-col justify-center items-center rounded-xl overflow-hidden bg-white shadow-lg">
        {/* Header Section */}
        <div className="w-full bg-gray-100 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="text-2xl">{profileData.name.charAt(0)}</span>
              </div>
              <h1 className="text-2xl font-semibold">{profileData.name}</h1>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100"
                onClick={() => {
                  /* Add edit profile handler */
                }}
              >
                <Edit2 className="w-4 h-4" />
                Hariri
              </button>
              <button
                className="flex items-center gap-2 py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Ondoka
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Mawasiliano</h2>
          <InfoCard icon={Mail} label="Barua pepe" value={profileData.email} />
          <InfoCard
            icon={Phone}
            label="Namba ya simu"
            value={profileData.telephone}
          />
        </div>

        {/* Shipping Information */}
        <div className="w-full p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Anuani</h2>
          <InfoCard
            icon={MapPin}
            label="Anuani ya Nyumbani"
            value={profileData.location}
            isAddress
          />
        </div>
      </div>
    </div>
  );
}
