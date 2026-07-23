"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeft, Camera, Key, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SellerProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setAvatar(data.avatar || "");
        }
      })
      .catch(() => {
        fetch("/api/auth/session")
          .then((res) => res.json())
          .then((data) => {
            if (data?.user) {
              setName(data.user.name || "");
              setEmail(data.user.email || "");
              setPhone(data.user.phone || "");
            }
          });
      });
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");
      const uploadData = await uploadRes.json();
      const avatarUrl = uploadData.urls?.[0] || uploadData.url;

      if (!avatarUrl) throw new Error("No image URL returned from upload");

      const profileRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      if (!profileRes.ok) throw new Error("Failed to update profile picture");

      setAvatar(avatarUrl);
      toast.success("Profile picture updated!", { position: "top-center" });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated!", { position: "top-center" });
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPasswordLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to update password");
      } else {
        toast.success("Password updated!", { position: "top-center" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
        <ArrowLeft className="h-4 w-4" /> My Profile
      </Link>

      {/* Avatar Card */}
      <div className="flex flex-col items-center rounded-3xl bg-white p-6 shadow-sm border border-slate-100 text-center">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-3xl font-extrabold text-[#E8621A] border-4 border-white shadow-md">
              {name[0]?.toUpperCase() || "S"}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8621A] text-white shadow-md hover:bg-orange-600 disabled:opacity-50 transition"
            title="Change Profile Picture"
          >
            {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
        </div>
        <h2 className="mt-3 text-lg font-bold text-slate-900">{name}</h2>
        <p className="text-xs text-slate-400">Salesperson</p>
      </div>

      {/* Personal Info */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Information</h3>

        <form onSubmit={handleSaveInfo} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-slate-400">Email cannot be changed. Contact your admin.</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Password</h3>

        <form onSubmit={handleUpdatePassword} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
          >
            <Key className="h-4 w-4" /> {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Account / Sign Out */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Role</span>
          <span className="font-bold text-slate-900">Salesperson</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
