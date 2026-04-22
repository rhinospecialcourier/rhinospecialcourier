import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    // Número de WhatsApp - ajusta según tu número real
    window.open("https://wa.me/573204775878?text=Hola%2C%20necesito%20información%20sobre%20sus%20servicios%20de%20courier", "_blank");
  };

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg transition-colors group"
      style={{
        boxShadow: "0 4px 14px rgba(37, 211, 102, 0.4)"
      }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="text-white" size={28} />
      
      {/* Pulso de animación */}
      <motion.div
        className="absolute inset-0 bg-green-600 rounded-full opacity-75"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.75, 0, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}