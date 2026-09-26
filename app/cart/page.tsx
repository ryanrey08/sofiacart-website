import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function CartPage() {
  return (
    <PagePlaceholder
      title="Cart flow structure"
      description="Prepared shell for the shopping cart experience from the reference design, ready for cart state hydration and order-summary calculations."
      sections={[
        { title: "Cart items", description: "Product rows, quantity controls, and remove actions." },
        { title: "Order summary", description: "Subtotal, shipping, tax, and total calculations." },
        { title: "Checkout progress", description: "Current step indicators and navigation." },
        { title: "Promotions", description: "Voucher and pricing adjustments placeholder." },
      ]}
    />
  );
}
