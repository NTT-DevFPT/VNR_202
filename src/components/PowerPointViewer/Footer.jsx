import { motion } from "framer-motion";
import { Github, Youtube, Linkedin, Mail, Phone } from "lucide-react";

export const PowerPointFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-t border-gray-700/50 shadow-xl"
    >
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>© {currentYear} VNR202 Studio</span>
            <span className="text-gray-600">•</span>
            <span>All rights reserved</span>
          </div>

          {/* Center: Contact Info */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="mailto:thanhtai10903@gmail.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </a>
            <a
              href="tel:+84981667547"
              className="flex items-center gap-2 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+84 981667547</span>
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/NTT-DevFPT"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

