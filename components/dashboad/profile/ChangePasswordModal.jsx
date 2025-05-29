"use client";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ChangePasswordModal({ onClose }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Password changed ");
        onClose();
      } else {
        alert(res.data.error || "Password change failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network/Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white dark:bg-background-dark w-full max-w-md p-6 rounded-xl shadow-xl space-y-6"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-foreground-dark">
          Change Password
        </h3>

        {/* Current Password */}
        <PasswordInput
          id="currentPassword"
          label="Current Password"
          name="currentPassword"
          register={register}
          validation={{ required: "Current password is required" }}
          error={errors.currentPassword}
        />

        {/* New Password */}
        <PasswordInput
          id="newPassword"
          label="New Password"
          name="newPassword"
          register={register}
          validation={{
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Minimum 8 characters",
            },
          }}
          error={errors.newPassword}
        />

        {/* Confirm New Password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          validation={{
            required: "Please confirm password",
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
            btnText="Cancel"
          />
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            btnText={saving ? "Saving..." : "Save"}
          />
        </div>
      </form>
    </div>
  );
}
