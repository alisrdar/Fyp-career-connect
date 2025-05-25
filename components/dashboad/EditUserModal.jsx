"use client";
import { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";

export default function EditUserModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone || ""
  });
  const fromFields = [{filed: "name"}, {filed: "email", disabled : true},{filed: "phone",}]
  const [saving, setSaving] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(
        "/api/dashboard/profile/updateuser",
        form,
        { withCredentials: true }
      );
      if (data.success) onSave(data.user);
      else alert(data.error || "Save failed");
    } catch (err) {
      console.error(err);
      alert("Network or server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white  w-full max-w-md p-6 rounded-lg shadow-lg space-y-4 relative dark:bg-background-dark  dark:text-foreground-dark"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-extra-muted"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold">Edit Profile</h3>

        {fromFields.map((item) => (
          <label key={item.filed} className="block">
            <span className="text-gray-700 capitalize">{item.filed}</span>
            <input
              name={item.filed}
              type={item.filed === "email" ? "email" : "text"}
              value={form[item.filed]}
              disabled= {item.disabled}
              onChange={handleChange}
              required={item.filed !== "phone"}
              
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </label>
        ))}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded"
            disabled = {saving}
            btnText={"Cancel"}
          />
          <Button
            variant="primary"
            type="submit"
            className="rounded"
            btnText={saving ? "Saving" : "Save"}
          />
        </div>
      </form>
    </div>
  );
}
