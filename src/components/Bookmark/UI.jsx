import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { BOOK_LIBRARY, currentBookAtom, bookPageAtom } from "../../state/library";

export const bookmarkFaceAtom = atom(0);

export const UI = ({ showMarquee = false }) => {
  const [bookIndex, setBookIndex] = useAtom(currentBookAtom);
  const [, setBookPage] = useAtom(bookPageAtom);
  const [face, setFace] = useAtom(bookmarkFaceAtom);

  const title = BOOK_LIBRARY[bookIndex].title;
  const isSwitchingBook = useRef(false);

  useEffect(() => {
    if (showMarquee) return;
    if (isSwitchingBook.current) {
      isSwitchingBook.current = false;
      return;
    }
    // Bỏ qua audio để tránh lỗi autoplay
    // const audio = new Audio("");
    // audio.play().catch(() => {}); // Ignore autoplay errors
  }, [face, showMarquee]);

  const prevBook = () => {
    isSwitchingBook.current = true;
    const next = (bookIndex - 1 + BOOK_LIBRARY.length) % BOOK_LIBRARY.length;
    setBookIndex(next);
    setBookPage(0);
    setFace(0);
  };
  const nextBook = () => {
    isSwitchingBook.current = true;
    const next = (bookIndex + 1) % BOOK_LIBRARY.length;
    setBookIndex(next);
    setBookPage(0);
    setFace(0);
  };

  return (
    <>
      {!showMarquee && (
        <main className="pointer-events-none select-none absolute inset-0 flex flex-col justify-between">
          <div className="flex justify-center mt-10 gap-4 pointer-events-auto">
            <button
              className="px-4 py-2 rounded-full bg-white/70 text-black hover:bg-white transition"
              onClick={prevBook}
            >
              ← Prev book
            </button>
            <h2 className="text-3xl font-bold">{title}</h2>
            <button
              className="px-4 py-2 rounded-full bg-white/70 text-black hover:bg-white transition"
              onClick={nextBook}
            >
              Next book →
            </button>
          </div>

          <div className="w-full flex justify-center mb-10 pointer-events-auto">
            <button
              className={`px-6 py-3 mx-3 rounded-full text-lg uppercase transition-all ${
                face === 0 ? "bg-blue-400 text-white" : "bg-white text-black"
              }`}
              onClick={() => setFace(0)}
            >
              Front
            </button>
            <button
              className={`px-6 py-3 mx-3 rounded-full text-lg uppercase transition-all ${
                face === 1 ? "bg-blue-400 text-white" : "bg-white text-black"
              }`}
              onClick={() => setFace(1)}
            >
              Back
            </button>
          </div>
        </main>
      )}
    </>
  );
};