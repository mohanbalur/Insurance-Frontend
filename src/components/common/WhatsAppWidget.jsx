import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-[#25D366] p-4 text-white shadow-lg transition duration-300 hover:scale-110 hover:shadow-2xl"
    >
      <MessageCircle size={28} />
    </a>
  );
}
