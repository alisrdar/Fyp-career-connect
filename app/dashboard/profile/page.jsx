"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileHero from "@/components/dashboad/ProfileHero";
import EditUserModal from "@/components/dashboad/EditUserModal";
import ChangePasswordModal from "@/components/dashboad/profile/ChangePasswordModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPwdModal, setIsPwdModal] = useState(false);
  const { user, loading, err, setUser } = useAuth();

  // avatar upload + update
  const handleAvatarChange = async file => {
    try {
      // 1️⃣ upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const secure_url = uploadRes.data.secure_url;

      // send to updateuser API
      const { data } = await axios.put(
        "/api/dashboard/profile/updateuser",
        { avatarUrl: secure_url },
        { withCredentials: true }
      );
      if (data.success) setUser(data.user);
      else console.error("Avatar update failed:", data.error);
    } catch (e) {
      console.error("Upload error", e);
    }
  };

  if (loading) return <p>Loading profile…</p>;
  if (err) return <p className="text-red-500">{err}</p>;
  if (!user) return <p>No user data available. Please log in.</p>;

  return (
    <div className="flex bg-gray-50 dark:bg-background-dark min-h-screen">

      <main className="flex-1 xs:p-6 mx-auto space-y-6">
        <ProfileHero
          user={user}
          title={user.name}
          onAvatarChange={handleAvatarChange}
        />
        <div className="dark:border-b dark:border-muted mx-2" />

        <div className="bg-white dark:bg-background-dark shadow-lg dark:shadow-none border border-gray-200 dark:border-muted p-8 rounded-2xl m-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-foreground-dark">
              Profile Details
            </h3>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                size="md"
                btnText="Edit"
                className="px-5 py-2 rounded-full"
              />
              <Button
                variant="secondary"
                onClick={() => setIsPwdModal(true)}
                size="md"
                btnText="Change Password"
                className="px-5 py-2 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm uppercase text-gray-500 dark:text-extra-muted mb-1">
                Name
              </p>
              <p className="text-base font-medium text-gray-800 dark:text-foreground-dark">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase text-gray-500 dark:text-extra-muted mb-1">
                Email
              </p>
              <p className="text-base font-medium text-gray-800 dark:text-foreground-dark break-all">
                {user.email}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm uppercase text-gray-500 dark:text-extra-muted mb-1">
                Phone
              </p>
              <p className="text-base font-medium text-gray-800 dark:text-foreground-dark">
                {user.phone || "No phone set"}
              </p>
            </div>
          </div>
        </div>


        {isPwdModal && (
          <ChangePasswordModal
            onClose={() => setIsPwdModal(false)}
          />
        )}

        {isEditing && (
          <EditUserModal
            initialData={user}
            onClose={() => setIsEditing(false)}
            onSave={updated => {
              setUser(updated);
              setIsEditing(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
