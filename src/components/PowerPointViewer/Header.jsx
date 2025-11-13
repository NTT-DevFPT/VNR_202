import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export const PowerPointHeader = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-md border-b border-blue-700/50 shadow-xl"
    >
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">VNR202</h1>
              <p className="text-xs text-blue-200 font-medium">Interactive 3D Notebook Collection</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Live</span>
            </div>
            <div className="text-xs text-blue-300">VNR202 Project</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

