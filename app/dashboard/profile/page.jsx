"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileHero from "@/components/dashboad/ProfileHero";
import EditUserModal from "@/components/dashboad/EditUserModal";
import Button from "@/components/ui/Button";
import { useUser } from "@/context/UserContext"; 

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { user, loading, err, setUser } = useUser();

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

  return (
    <div className="flex bg-gray-50 dark:bg-background-dark min-h-screen">

      <main className="flex-1 xs:p-6 mx-auto space-y-6">
        <ProfileHero 
          user={user} 
          title={user.name} 
          onAvatarChange={handleAvatarChange} 
        />
         <div className="dark:border-b dark:border-muted mx-2" />

        <div className="bg-white shadow p-6 rounded-lg m-2 dark:bg-background-dark dark:border dark:border-muted dark:text-foreground-dark">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Profile Details</h3>
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              size="md"
              btnText={"Edit"}
              className=" mr-4"
            />
          </div>
          <div className="space-y-2 text-gray-700 dark:text-extra-muted">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {user.phone || "No phone set"}
            </p>
          </div>
        </div>

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
