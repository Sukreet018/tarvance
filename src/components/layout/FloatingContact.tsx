import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE } from "../../config/site";

const buttons = [
  {
    href: SITE.whatsapp,
    label: "Chat on WhatsApp",
    Icon: FaWhatsapp,
    cls: "bg-[#25d366] shadow-[#25d366]/40",
    ext: true,
  },
  {
    href: SITE.phoneHref,
    label: "Call TarVance",
    Icon: Phone,
    cls: "bg-[#254fca] shadow-[#254fca]/40",
    ext: false,
  },
];

export default function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-60 flex flex-col gap-2 sm:bottom-5 sm:right-5 sm:gap-3">
      {buttons.map(({ href, label, Icon, cls, ext }, i) => (
        <motion.a
          key={label}
          href={href}
          aria-label={label}
          title={label}
          {...(ext && { target: "_blank", rel: "noreferrer" })}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 + i * 0.15, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg sm:h-14 sm:w-14 ${cls}`}
        >
          <Icon size={20} className="sm:h-6 sm:w-6" />
        </motion.a>
      ))}
    </div>
  );
}
