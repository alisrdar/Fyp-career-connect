// components/ProfileCard.jsx
"use client";
import Image from "next/image";

export default function ProfileCard({ user, onAvatarChange }) {
  const handleFile = e => {
    const f = e.target.files?.[0];
    if (f) onAvatarChange(f);
  };

  return (
    <div className="relative -mt-12 mx-auto max-w-4xl bg-white rounded-xl p-6 shadow-md flex items-center space-x-6">
      {/* avatar + edit icon */}
      <div className="relative w-24 h-24">
        <Image
          src={user.avatarUrl}
          alt="Avatar"
          fill
          className="rounded-full object-cover border-4 border-white"
        />
        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          {/* pencil SVG */}
        </label>
      </div>
      {/* info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <span className="inline-block px-2 py-0.5 ml-2 text-sm font-medium rounded-full border border-green-300 text-green-600">
          {user.plan}
        </span>
        <p className="text-gray-600 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" />{/* mail icon */}
          {user.email}
        </p>
      </div>
    </div>
  );
}
