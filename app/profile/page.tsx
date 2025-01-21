"use client";
import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Edit2, LogOut } from "lucide-react";
import { logout, fetchProfile } from "@/api/api";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  email: string;
  telephone: string;
  location: string;
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isAddress?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  isAddress = false,
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

const clearAuthData = () => {
  localStorage.removeItem("userProfile");
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const savedProfile = localStorage.getItem("userProfile");

        if (!authToken) {
          router.replace("/auth");
          return;
        }

        // First set saved profile if available
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData({
            name: parsedProfile.user?.first_name || "User",
            email: parsedProfile.user?.email || "",
            telephone: parsedProfile.user?.telephone || "",
            location: parsedProfile.user?.location || "",
          });
        }

        // Fetch fresh profile data
        const freshProfile = await fetchProfile();
        const formattedProfile = {
          name: freshProfile.user?.first_name || "User",
          email: freshProfile.user?.email || "",
          telephone: freshProfile.user?.telephone || "",
          location: freshProfile.user?.location || "",
        };

        setProfileData(formattedProfile);
        localStorage.setItem("userProfile", JSON.stringify(freshProfile));
      } catch (error) {
        console.error("Profile fetch failed:", error);
        clearAuthData();
        router.replace("/auth");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkAuthAndFetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        await logout();
      }
      clearAuthData();
      router.replace("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear data and redirect even if logout API fails
      clearAuthData();
      router.replace("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto min-h-screen p-6">
      <div className="flex flex-col justify-center items-center rounded-xl overflow-hidden bg-white shadow-lg">
        {/* Header Section */}
        <div className="w-full bg-gray-100 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="text-2xl">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-semibold">{profileData.name}</h1>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100"
                onClick={handleEditProfile}
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
