import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function RegisterPage() {
  return (
    <PagePlaceholder
      title="Registration flow structure"
      description="Prepared route for the reference registration page, including the core sections that will be wired to React Hook Form and backend auth endpoints in the next phase."
      sections={[
        { title: "Personal information", description: "Name, email, and contact fields." },
        { title: "Account security", description: "Password and password confirmation inputs." },
        { title: "Shipping address", description: "Address fields and default delivery settings." },
        { title: "Terms & conditions", description: "Consent checkbox and account creation action." },
      ]}
    />
  );
}
