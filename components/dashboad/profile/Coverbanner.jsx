"use client";
import Image from "next/image";
import { Plus, Settings, Share2, Mail, Edit2 } from "lucide-react";

export default function ProfileHero({ user, onAvatarChange, title }) {
  const avatarSrc =
    user.avatarUrl ||
    "https://cdn0.iconfinder.com/data/icons/education-and-school-filled-outline-1/128/boy_student_study_school_man_high_school_avatar-512.png";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAvatarChange(file);
  };

  return (
    <div className="w-full ">
      {/* Cover banner */}
      <div className={`relative w-full h-30 
        bg-gradient-to-tr 
         from-blue-50 via-indigo-100 to-purple-100
dark:from-gray-800 dark:via-gray-900 dark:to-black

        `}>
        
      </div>

      {/* Profile card */}
      <div className="relative -mt-12 mx-auto max-w-4xl dark:bg-background-dark bg-white rounded-lg p-6 flex items-center ">
        {/* Avatar + edit */}
        <div className="relative w-24 h-24">
          <Image
            src={avatarSrc}
            alt="Avatar"
            fill
            className="rounded-full object-cover border-4 border-white dark:border-background-dark"
          />

        </div>

        {/* Name, plan, email */}
        <div className="ml-6 flex-1">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold 800 dark:text-foreground-dark/80 text-gray-800">{title}</h1>

          </div>
          <div className="mt-2 flex items-center text-gray-500 dark:text-extra-muted">
            <Mail className="w-4 h-4 mr-1" />
            <span className="text-sm">{user.email}</span>
          </div>
        </div>
        {/* Action buttons */}
        {onAvatarChange && (
          <div className="flex space-x-2 text-gray-600 dark:text-extra-muted">
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 dark:bg-surface dark:hover:bg-muted flex items-center justify-center">
              <Plus className="w-5 h-5 " />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 dark:bg-surface dark:hover:bg-muted flex items-center justify-center">
              <Settings className="w-5 h-5 " />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 dark:bg-surface dark:hover:bg-muted flex items-center justify-center">
              <Share2 className="w-5 h-5 " />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
