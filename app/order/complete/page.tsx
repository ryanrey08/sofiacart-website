import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function OrderCompletePage() {
  return (
    <PagePlaceholder
      title="Order completion structure"
      description="Prepared route for post-checkout confirmation and order status messaging aligned with the reference order complete design."
      sections={[
        { title: "Confirmation banner", description: "Success state and order number messaging." },
        { title: "Status timeline", description: "Order progress and fulfillment checkpoints." },
        { title: "Delivery summary", description: "Shipping destination and method recap." },
        { title: "Next actions", description: "Continue shopping and order-tracking calls to action." },
      ]}
    />
  );
}
