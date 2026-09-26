import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function CheckoutPage() {
  return (
    <PagePlaceholder
      title="Checkout structure"
      description="Prepared route for shipping, delivery, payment, and order review components that will consume checkout APIs in the integration phase."
      sections={[
        { title: "Shipping details", description: "Saved addresses and delivery destination selection." },
        { title: "Delivery method", description: "Shipping method cards and cost selection." },
        { title: "Payment method", description: "Payment options and billing summary placeholder." },
        { title: "Order review", description: "Final confirmation block before order placement." },
      ]}
    />
  );
}
