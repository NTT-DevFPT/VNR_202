import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Loader, Html } from "@react-three/drei";
import { Experience } from "../Book/Experience";
import { Book } from "../Book/Book";
import { Bookmark } from "../Bookmark/Bookmark";
import { UI } from "../Book/UI";
import { useAtom } from "jotai";
import { BOOK_LIBRARY, currentBookAtom, bookPageAtom } from "../../state/library";
import { bookmarkFaceAtom } from "../Bookmark/UI";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { PowerPointHeader } from "./Header";
import { PowerPointFooter } from "./Footer";

export const PowerPointSlideViewer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookIndex, setBookIndex] = useAtom(currentBookAtom);
  const [page, setPage] = useAtom(bookPageAtom);
  const [bookmarkFace, setBookmarkFace] = useAtom(bookmarkFaceAtom);
  const totalSlides = BOOK_LIBRARY.length;
  const bookRef = useRef();

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Sync currentSlide với bookIndex
  useEffect(() => {
    setBookIndex(currentSlide);
    setPage(0);
    setBookmarkFace(0); // Reset bookmark face khi chuyển slide
  }, [currentSlide, setBookIndex, setPage, setBookmarkFace]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide]);

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const currentBook = BOOK_LIBRARY[currentSlide];
  const pages = currentBook?.pages || [];

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header */}
      <PowerPointHeader />
      
      {/* Slide Thumbnails Sidebar */}
      <div className="absolute left-0 top-16 bottom-16 w-40 bg-gray-800/95 backdrop-blur-md border-r border-gray-700/50 z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="p-3 space-y-2.5">
          {BOOK_LIBRARY.map((book, index) => (
            <button
              key={book.id}
              onClick={() => goToSlide(index)}
              className={`w-full rounded-lg border-2 transition-all duration-300 overflow-hidden group ${
                index === currentSlide
                  ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/30 scale-[1.02]"
                  : "border-gray-600/50 bg-gray-700/40 hover:border-blue-400/50 hover:bg-gray-700/60 hover:scale-[1.01]"
              }`}
            >
              {/* Thumbnail Number Badge */}
              <div className={`relative h-8 flex items-center justify-center text-xs font-bold ${
                index === currentSlide
                  ? "bg-blue-500/30 text-blue-200"
                  : "bg-gray-700/50 text-gray-300 group-hover:bg-gray-600/50"
              }`}>
                <span className="text-[10px] font-extrabold tracking-wider">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              
              {/* Book Title */}
              <div className="p-2.5 min-h-[48px] flex items-center justify-center">
                <p className={`text-[10px] font-semibold text-center leading-tight line-clamp-2 ${
                  index === currentSlide
                    ? "text-blue-100"
                    : "text-gray-300 group-hover:text-gray-200"
                }`}>
                  {book.title}
                </p>
              </div>
              
              {/* Active Indicator */}
              {index === currentSlide && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Area - Expanded for notebook and bookmark */}
      <div className="ml-40 h-full pt-16 pb-16 relative overflow-hidden">
        {/* Current Slide Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -50 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1] // Custom easing for smooth transition
            }}
            className="w-full h-full flex items-center justify-center p-2"
          >
            {/* Slide Content - White slide area like PowerPoint - Expanded */}
            <div className="relative w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
              {/* Slide Title Bar - Compact */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-6 py-3 z-10">
                <div className="text-white">
                  <h2 className="text-lg font-bold">{currentBook?.title || 'Untitled'}</h2>
                  <p className="text-xs text-blue-100">{currentBook?.story?.title || ''}</p>
                </div>
                <div className="text-white text-sm font-medium">
                  Slide {currentSlide + 1} / {totalSlides}
                </div>
              </div>

              {/* 3D Book Canvas - Expanded to show both notebook and bookmark */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                <Canvas
                  shadows
                  style={{ width: "100%", height: "100%" }}
                  camera={{
                    position: [0, 1.2, typeof window !== "undefined" && window.innerWidth > 800 ? 6 : 8],
                    fov: 50,
                  }}
                >
                  <Suspense fallback={null}>
                    <Experience>
                      <Book ref={bookRef} position={[-2, 0.25, 0]} scale={[1.2, 1.2, 1.2]} pages={pages} />
                      <Bookmark position={[2.5, 0.5, 0]} scale={[1.1, 1.1, 1.1]} />
                    </Experience>
                  </Suspense>
                </Canvas>
                <Loader />
                
                {/* Bookmark Controls - Overlay trên canvas */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-30">
                  <button
                    onClick={() => setBookmarkFace(bookmarkFace === 0 ? 1 : 0)}
                    className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                    title="Lật bookmark (Front/Back)"
                  >
                    <RotateCcw size={20} />
                    <span className="text-sm font-medium">
                      {bookmarkFace === 0 ? 'Front' : 'Back'}
                    </span>
                  </button>
                  <div className="bg-white/90 px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600 text-center">
                    Click bookmark để lật
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Improved styling */}
        <button
          onClick={goToPrevious}
          disabled={currentSlide === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white text-gray-900 p-4 rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={goToNext}
          disabled={currentSlide === totalSlides - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white text-gray-900 p-4 rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicator Dots - Improved styling */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          {BOOK_LIBRARY.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-blue-600 w-8 shadow-md"
                  : "bg-gray-400 w-2 hover:bg-gray-500 hover:w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <PowerPointFooter />
    </div>
  );
};

