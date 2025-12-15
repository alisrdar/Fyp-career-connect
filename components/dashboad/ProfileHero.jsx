"use client";
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
    <div className="w-full">
      {/* Cover banner */}
      <div className="relative w-full h-40 bg-gradient-to-tr from-yellow-50 via-yellow-100 to-orange-400">
        {/* cover edit */}
        {onAvatarChange && (
          <label className="absolute top-4 right-4 bg-white  p-2 rounded-full shadow cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <Edit2 className="w-5 h-5 text-gray-600" />
          </label>
        )}
      </div>

      {/* Avatar + edit */}
      <div className="relative -mt-12 ml-6 z-1 w-24 h-24">
        <img
          src={avatarSrc}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover border-4 dark:border-none border-white"
        />
        {onAvatarChange && (
          <label className="absolute bottom-0 right-0 bg-white dark:bg-surface p-1 rounded-full shadow cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <Edit2 className="w-5 h-5 text-gray-600 dark:text-extra-muted" />
          </label>
        )}
      </div>

      {/* Profile card */}
      <div className="relative -mt-6 bg-white pb-8 dark:bg-background-dark dark:text-foreground-dark p-6 pl-2 flex items-center border-extra-muted shadow-sm">
        {/* Name, plan, email */}
        <div className="ml-4 flex-1 mt-1">
          <div className="flex items-center ">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground-dark/80">{title}</h1>
          </div>
          <div className="mt-1 flex items-center text-gray-500">
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
