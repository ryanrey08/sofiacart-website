import { Headphones, Package, ShieldCheck, ShoppingBag } from "lucide-react";

const perks = [
  { icon: ShoppingBag, title: "Faster Checkout", text: "Saved addresses for quicker purchases." },
  { icon: Package, title: "Track Your Orders", text: "Follow every order from placement to completion." },
  { icon: ShieldCheck, title: "Secure & Safe", text: "Your information is protected." },
  { icon: Headphones, title: "Here to Help", text: "Request returns right from your account." },
];

/** Welcome panel shown beside the sign-in forms (Canva register/login screens). */
export function AuthAside({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="hidden flex-col gap-6 lg:flex">
      <div className="relative flex min-h-[260px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFE5EC] via-[#F3E8FF] to-[#E0E7FF] p-8 shadow-sm">
        <h2 className="text-3xl font-black text-ink">
          {title} <br />
          <span className="text-brand-pink">Sofia</span>
          <span className="text-brand-orange">Cart</span>
        </h2>
        <p className="mt-2 text-xs font-bold text-ink">Everything. In One Cart.</p>
        <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-600">{subtitle}</p>
        <ShoppingBag aria-hidden className="absolute -bottom-6 -right-4 h-44 w-44 rotate-12 text-brand/10" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {perks.map(({ icon: Icon, title: perkTitle, text }) => (
          <div key={perkTitle} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/5 text-brand">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">{perkTitle}</h4>
              <p className="text-[10px] text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
