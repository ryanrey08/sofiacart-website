"use client";

import { useMutation } from "@tanstack/react-query";
import { BadgeCheck, Laptop, MailWarning, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { AccountPageHeader } from "@/components/account/account-page-header";
import { PasswordInput } from "@/components/auth/password-input";
import { ErrorState, InlineError, ListSkeleton } from "@/components/storefront/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useRevokeSession,
  useSessions,
  useSettings,
  useUpdatePassword,
  useUpdateProfile,
  useUpdateSettings,
} from "@/hooks/use-account";
import { useLogout } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { ApiClientError, errorMessage } from "@/lib/api/client";
import { authService } from "@/lib/api/services/auth";
import { formatDateTime } from "@/lib/utils/format";
import { toast } from "@/stores/toast-store";
import type { User } from "@/types/domain";

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-sm font-black text-ink">{title}</h2>
        {description ? <p className="text-[11px] text-slate-500">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}

function FieldError({ error, field }: { error: unknown; field: string }) {
  const message = error instanceof ApiClientError ? error.fieldError(field) : undefined;
  return message ? <p className="text-[11px] text-red-600">{message}</p> : null;
}

function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const update = useUpdateProfile();
  const resend = useMutation({ mutationFn: authService.resendVerification });
  const emailChanged = email.trim().toLowerCase() !== user.email;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate(
      {
        name: name.trim(),
        phone: phone.trim() || null,
        ...(emailChanged ? { email: email.trim(), currentPassword } : {}),
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          toast.success("Profile updated", emailChanged ? "Check your new email for a verification link." : undefined);
        },
      }
    );
  }

  const generalError = update.error instanceof ApiClientError && update.error.status === 422 ? null : update.error;

  return (
    <Panel title="Profile" description="Your name and contact details.">
      {user.emailVerified ? (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600"><BadgeCheck className="h-4 w-4" /> Email verified</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          <MailWarning className="h-4 w-4" /> Your email address isn&apos;t verified yet.
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-[11px] font-bold text-amber-900"
            disabled={resend.isPending}
            onClick={() =>
              resend.mutate(undefined, {
                onSuccess: (message) => toast.success(message ?? "Verification email sent"),
                onError: (error) => toast.error("Couldn't send the email", errorMessage(error)),
              })
            }
          >
            {resend.isPending ? "Sending…" : "Resend verification email"}
          </Button>
        </div>
      )}
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="profile-name" className="text-xs font-semibold text-slate-700">Full Name</Label>
          <Input id="profile-name" required maxLength={255} value={name} onChange={(event) => setName(event.target.value)} className="h-9 rounded-xl text-xs" />
          <FieldError error={update.error} field="name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-phone" className="text-xs font-semibold text-slate-700">Mobile Number</Label>
          <Input id="profile-phone" maxLength={20} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+63 912 345 6789" className="h-9 rounded-xl text-xs" />
          <FieldError error={update.error} field="phone" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="profile-email" className="text-xs font-semibold text-slate-700">Email Address</Label>
          <Input id="profile-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-9 rounded-xl text-xs" />
          <FieldError error={update.error} field="email" />
        </div>
        {emailChanged ? (
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="profile-current-password" className="text-xs font-semibold text-slate-700">Current password (required to change your email)</Label>
            <PasswordInput id="profile-current-password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            <FieldError error={update.error} field="currentPassword" />
          </div>
        ) : null}
        <div className="space-y-2 sm:col-span-2">
          <InlineError error={generalError} />
          <Button type="submit" disabled={update.isPending} className="rounded-full bg-brand text-xs font-bold">
            {update.isPending ? "Saving…" : "Save Profile"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}

function PasswordForm() {
  const [values, setValues] = useState({ currentPassword: "", password: "", passwordConfirmation: "" });
  const [mismatch, setMismatch] = useState(false);
  const update = useUpdatePassword();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (values.password !== values.passwordConfirmation) return setMismatch(true);
    setMismatch(false);
    update.mutate(values, {
      onSuccess: (message) => {
        setValues({ currentPassword: "", password: "", passwordConfirmation: "" });
        toast.success("Password updated", message ?? undefined);
      },
    });
  }

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <Panel title="Change Password" description="Changing your password signs you out on your other devices.">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="current-password" className="text-xs font-semibold text-slate-700">Current Password</Label>
          <PasswordInput id="current-password" required autoComplete="current-password" value={values.currentPassword} onChange={set("currentPassword")} />
          <FieldError error={update.error} field="currentPassword" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-password" className="text-xs font-semibold text-slate-700">New Password</Label>
          <PasswordInput id="new-password" required minLength={8} autoComplete="new-password" value={values.password} onChange={set("password")} />
          <FieldError error={update.error} field="password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-password" className="text-xs font-semibold text-slate-700">Confirm New Password</Label>
          <PasswordInput id="confirm-password" required autoComplete="new-password" value={values.passwordConfirmation} onChange={set("passwordConfirmation")} />
          {mismatch ? <p className="text-[11px] text-red-600">Passwords do not match.</p> : <FieldError error={update.error} field="passwordConfirmation" />}
        </div>
        <div className="sm:col-span-3">
          <Button type="submit" disabled={update.isPending} className="rounded-full bg-brand text-xs font-bold">
            {update.isPending ? "Updating…" : "Update Password"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}

function NotificationSettings() {
  const settings = useSettings();
  const update = useUpdateSettings();

  if (settings.isPending) return <ListSkeleton rows={1} />;
  if (settings.isError) return <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />;

  const options = [
    { key: "orderUpdates" as const, label: "Order updates", text: "Notifications when your orders, payments or returns change." },
    { key: "promotions" as const, label: "Promotions", text: "News about deals and vouchers." },
  ];

  return (
    <Panel title="Notification Preferences">
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.key} className="flex items-start gap-3">
            <Checkbox
              id={`setting-${option.key}`}
              checked={settings.data[option.key]}
              disabled={update.isPending}
              onCheckedChange={(checked) =>
                update.mutate({ [option.key]: Boolean(checked) }, {
                  onSuccess: () => toast.success("Preferences saved"),
                  onError: (error) => toast.error("Couldn't save preferences", errorMessage(error)),
                })
              }
              className="mt-0.5"
            />
            <label htmlFor={`setting-${option.key}`} className="cursor-pointer">
              <span className="block text-xs font-bold text-ink">{option.label}</span>
              <span className="block text-[11px] text-slate-500">{option.text}</span>
            </label>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Sessions() {
  const sessions = useSessions();
  const revoke = useRevokeSession();
  const logout = useLogout();
  const router = useRouter();

  return (
    <Panel title="Signed-in Devices" description="Sign out of devices you don't recognize.">
      {sessions.isPending ? (
        <ListSkeleton rows={1} />
      ) : sessions.isError ? (
        <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />
      ) : (
        <ul className="divide-y divide-slate-100">
          {sessions.data.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-ink">
                    {session.name} {session.current ? <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">This device</span> : null}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Signed in {formatDateTime(session.createdAt)} · Last active {formatDateTime(session.lastUsedAt ?? session.createdAt)}
                  </p>
                </div>
              </div>
              {!session.current ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-red-600 hover:bg-red-50"
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate(session.id, { onError: (error) => toast.error("Couldn't sign out that device", errorMessage(error)) })}
                >
                  Sign out
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="outline"
        className="rounded-full border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
        disabled={logout.isPending}
        onClick={() => {
          if (!window.confirm("Sign out of SofiaCart on every device, including this one?")) return;
          router.push("/login");
          logout.mutate({ everywhere: true }, { onSettled: () => toast.info("Signed out of all devices") });
        }}
      >
        Sign out of all devices
      </Button>
    </Panel>
  );
}

export function AccountSettings() {
  const { user } = useSession();

  return (
    <>
      <AccountPageHeader icon={Settings} title="Account Settings" description="Manage your profile, password and preferences." />
      {user ? <ProfileForm key={user.id + user.email} user={user} /> : null}
      <PasswordForm />
      <NotificationSettings />
      <Sessions />
    </>
  );
}
