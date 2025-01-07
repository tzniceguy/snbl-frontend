import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto min-h-screen p-6">
      <div className="flex flex-col justify-center items-center rounded-xl overflow-hidden bg-white shadow-lg">
        {/* Header Section */}
        <div className="w-full bg-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src="/api/placeholder/64/64"
                alt="Profile"
                className="relative w-full h-full object-contain"
                fill={true}
              />
            </div>
            <h1 className="text-2xl font-semibold">John Doe</h1>
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-gray-700">johndoe@example.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-blue-100 rounded-full">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Telephone</span>
              <span className="text-gray-700">+2557123456789</span>
            </div>
          </div>
        </div>
        {/*Shipping information */}
        <div className="w-full p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-blue-100 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Anuani</span>
              <address className="text-gray-700">location</address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
