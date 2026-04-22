import { motion } from "motion/react";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface RecommendedStoresProps {
  onBack: () => void;
}

const stores = [
  { name: "Nike", url: "https://www.nike.com/us/es/", logo: "https://logo.clearbit.com/nike.com" },
  { name: "Adidas", url: "https://www.adidas.com/us", logo: "https://logo.clearbit.com/adidas.com" },
  { name: "Puma", url: "https://us.puma.com/us/en", logo: "https://logo.clearbit.com/puma.com" },
  { name: "Apple", url: "https://www.apple.com/", logo: "https://logo.clearbit.com/apple.com" },
  { name: "Newegg", url: "https://www.newegg.com/", logo: "https://logo.clearbit.com/newegg.com" },
  { name: "Best Buy", url: "https://www.bestbuy.com/", logo: "https://logo.clearbit.com/bestbuy.com" },
  { name: "Target", url: "https://www.target.com/", logo: "https://logo.clearbit.com/target.com" },
  { name: "Amazon", url: "https://www.amazon.com/", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Jordan", url: "https://www.nike.com/us/es/jordan", logo: "https://logo.clearbit.com/nike.com" },
  { name: "Under Armour", url: "https://www.underarmour.com/en-us/", logo: "https://logo.clearbit.com/underarmour.com" },
  { name: "StockX", url: "https://stockx.com/", logo: "https://logo.clearbit.com/stockx.com" },
  { name: "6PM", url: "https://www.6pm.com/", logo: "https://logo.clearbit.com/6pm.com" },
  { name: "Nvidia", url: "https://www.nvidia.com/en-us/", logo: "https://logo.clearbit.com/nvidia.com" },
  { name: "Insta360", url: "https://www.insta360.com/", logo: "https://logo.clearbit.com/insta360.com" },
  { name: "MSI", url: "https://us.msi.com/", logo: "https://logo.clearbit.com/msi.com" },
  { name: "Corsair", url: "https://www.corsair.com/us/en", logo: "https://logo.clearbit.com/corsair.com" },
  { name: "Walmart", url: "https://www.walmart.com/", logo: "https://logo.clearbit.com/walmart.com" },
  { name: "GoPro", url: "https://gopro.com/en/us", logo: "https://logo.clearbit.com/gopro.com" },
  { name: "Logitech", url: "https://www.logitech.com/en-us", logo: "https://logo.clearbit.com/logitech.com" },
  { name: "Guess", url: "https://www.guess.com/en-us/home", logo: "https://logo.clearbit.com/guess.com" },
];

export function RecommendedStores({ onBack }: RecommendedStoresProps) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-8 border-primary text-primary hover:bg-primary/10"
          >
            ← Volver al Inicio
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <h1 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Tiendas Recomendadas
            </h1>
          </div>

          <p className="text-muted-foreground mb-8" style={{ fontSize: '1.125rem' }}>
            Compra en las mejores tiendas internacionales y nosotros te ayudamos con la importación
          </p>

          {/* Recuadro Informativo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/40 rounded-2xl p-6 mb-12 shadow-lg"
          >
            <p className="text-foreground leading-relaxed">
              Si estás interesado en realizar la compra de algún producto en alguna de nuestras tiendas recomendadas o buscas algún producto en específico y quieres cotizar si es mejor importarlo, <strong className="text-primary">con gusto nosotros te asesoramos y te acompañamos en el proceso de compra e importación</strong>.
            </p>
            <div className="mt-4">
              <a
                href="https://wa.me/573204775878"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                <span style={{ fontWeight: 600 }}>Contáctanos por WhatsApp</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Grid de Tiendas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stores.map((store, index) => (
            <motion.a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              {/* Logo Container */}
              <div className="flex items-center justify-center h-20 mb-4">
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback si el logo no carga
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-primary text-2xl font-bold">${store.name}</div>`;
                    }
                  }}
                />
              </div>

              {/* Store Name */}
              <div className="text-center">
                <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                  {store.name}
                </p>
              </div>

              {/* Hover Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="text-primary" size={16} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}