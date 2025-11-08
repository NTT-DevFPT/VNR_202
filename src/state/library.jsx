import { atom } from "jotai";

/**
 * Tạo danh sách trang cho 1 cuốn dạng notebook:
 * - Trang đầu: front = coverFront, back = ruledTexture
 * - N trang giữa: front = ruledTexture, back = ruledTexture
 * - Trang cuối: front = ruledTexture, back = coverBack
 */
export function buildNotebookPages({
  coverFront,
  coverBack,
  innerRuledCount = 10,
  ruledTexture = "ruled-paper",
}) {
  const pages = [
    { front: coverFront, back: ruledTexture },
    ...Array.from({ length: innerRuledCount }).map(() => ({
      front: ruledTexture,
      back: ruledTexture,
    })),
    { front: ruledTexture, back: coverBack },
  ];
  return pages;
}

/**
 * Mỗi cuốn có câu chuyện riêng (story).
 * Có thể thay đổi title/paragraphs cho phù hợp nội dung thực tế.
 * 
 * Cấu trúc texture:
 * - notebookFolder: tên folder trong textures/ (ví dụ: "notebook1")
 * - coverTexture: tên file cover (ví dụ: "HD_DongKinhNghiaThuc_Cover")
 * - bookmarkFront: tên file bookmark front (ví dụ: "HD_DongKinhNghiaThuc_BM_Front")
 * - bookmarkBack: tên file bookmark back (ví dụ: "HD_DongKinhNghiaThuc_BM_Back")
 */
export const BOOK_LIBRARY = [
  {
    id: "notebook-01",
    title: "Đông Kinh Nghĩa Thục",
    notebookFolder: "notebook1",
    coverTexture: "HD_DongKinhNghiaThuc_Cover",
    bookmarkFront: "HD_DongKinhNghiaThuc_BM_Front",
    bookmarkBack: "HD_DongKinhNghiaThuc_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "HD_DongKinhNghiaThuc_BM_Front", 
      back: "HD_DongKinhNghiaThuc_BM_Back",
      folder: "notebook1"
    },
    story: {
      title: "Đông Kinh Nghĩa Thục (1907)",
      paragraphs: [
        "Phong trào Đông Kinh Nghĩa Thục là một phong trào giáo dục và văn hóa quan trọng trong lịch sử Việt Nam.",
        "Cuốn sổ này ghi lại những ý tưởng và hoạt động của phong trào cách mạng đầu thế kỷ 20.",
      ],
    },
  },
  {
    id: "notebook-02",
    title: "Khởi nghĩa Yên Thế",
    notebookFolder: "notebook2",
    coverTexture: "KN_YenThe_Cover",
    bookmarkFront: "KN_YenThe_BM_Front",
    bookmarkBack: "KN_YenThe_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "KN_YenThe_BM_Front", 
      back: "KN_YenThe_BM_Back",
      folder: "notebook2"
    },
    story: {
      title: "Khởi nghĩa Yên Thế",
      paragraphs: [
        "Cuộc khởi nghĩa Yên Thế là một trong những cuộc khởi nghĩa nông dân lớn nhất trong lịch sử Việt Nam.",
        "Ghi lại những chiến công và tinh thần đấu tranh của nghĩa quân Yên Thế.",
      ],
    },
  },
  {
    id: "notebook-03",
    title: "Phong trào Cần Vương",
    notebookFolder: "notebook3",
    coverTexture: "PT_CanVuong_Cover",
    bookmarkFront: "PT_CanVuong_BM_Front",
    bookmarkBack: "PT_CanVuong_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_CanVuong_BM_Front", 
      back: "PT_CanVuong_BM_Back",
      folder: "notebook3"
    },
    story: {
      title: "Phong trào Cần Vương",
      paragraphs: [
        "Phong trào Cần Vương là phong trào yêu nước chống thực dân Pháp cuối thế kỷ 19.",
        "Tài liệu này ghi lại những hoạt động và tinh thần yêu nước của các nghĩa sĩ.",
      ],
    },
  },
  {
    id: "notebook-04",
    title: "Phong trào Đông Du",
    notebookFolder: "notebook4",
    coverTexture: "PT_DongDu_Cover",
    bookmarkFront: "PT_DongDu_BM_Front",
    bookmarkBack: "PT_DongDu_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DongDu_BM_Front", 
      back: "PT_DongDu_BM_Back",
      folder: "notebook4"
    },
    story: {
      title: "Phong trào Đông Du",
      paragraphs: [
        "Phong trào Đông Du do Phan Bội Châu khởi xướng nhằm đưa thanh niên sang Nhật học tập.",
        "Ghi lại hành trình và những bài học từ phong trào cách mạng đầu thế kỷ 20.",
      ],
    },
  },
  {
    id: "notebook-05",
    title: "Phong trào Duy Tân",
    notebookFolder: "notebook5",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notebook5"
    },
    story: {
      title: "Phong trào Duy Tân",
      paragraphs: [
        "Phong trào Duy Tân là phong trào cải cách văn hóa, giáo dục và xã hội đầu thế kỷ 20.",
        "Tài liệu về những cải cách và đổi mới tư duy của thời kỳ này.",
      ],
    },
  },
  {
    id: "notebook-06",
    title: "Phong trào Duy Tân",
    notebookFolder: "notebook6",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notebook6"
    },
    story: {
      title: "Phong trào Duy Tân",
      paragraphs: [
        "Phong trào Duy Tân là phong trào cải cách văn hóa, giáo dục và xã hội đầu thế kỷ 20.",
        "Tài liệu về những cải cách và đổi mới tư duy của thời kỳ này.",
      ],
    },
  },
  {
    id: "notebook-07",
    title: "Khởi nghĩa Bãi Sậy",
    notebookFolder: "notrbook7",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notrbook7"
    },
    story: {
      title: "Khởi nghĩa Bãi Sậy",
      paragraphs: [
        "Khởi nghĩa Bãi Sậy là một trong những cuộc khởi nghĩa chống Pháp quan trọng.",
        "Ghi lại tinh thần đấu tranh và những chiến công của nghĩa quân.",
      ],
    },
  },
  {
    id: "notebook-08",
    title: "Phong trào Đông Kinh",
    notebookFolder: "notebook8",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notebook8"
    },
    story: {
      title: "Phong trào Đông Kinh",
      paragraphs: [
        "Phong trào Đông Kinh ghi lại những hoạt động văn hóa và giáo dục.",
        "Những đóng góp quan trọng cho sự phát triển của xã hội Việt Nam.",
      ],
    },
  },
  {
    id: "notebook-09",
    title: "Phong trào Văn Thân",
    notebookFolder: "notebook9",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notebook9"
    },
    story: {
      title: "Phong trào Văn Thân",
      paragraphs: [
        "Phong trào Văn Thân là phong trào yêu nước của giới trí thức.",
        "Tài liệu về những hoạt động và tư tưởng của các văn thân.",
      ],
    },
  },
  {
    id: "notebook-10",
    title: "Phong trào Dân Chủ",
    notebookFolder: "notebook10",
    coverTexture: "PT_DuyTan_Cover",
    bookmarkFront: "PT_DuyTan_BM_Front",
    bookmarkBack: "PT_DuyTan_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_DuyTan_BM_Front", 
      back: "PT_DuyTan_BM_Back",
      folder: "notebook10"
    },
    story: {
      title: "Phong trào Dân Chủ",
      paragraphs: [
        "Phong trào Dân Chủ đấu tranh cho quyền tự do và độc lập dân tộc.",
        "Tổng kết hành trình đấu tranh và những bài học quý giá từ lịch sử.",
      ],
    },
  },
];

// Atom: chỉ số cuốn hiện tại (đồng bộ Book và Bookmark)
export const currentBookAtom = atom(0);

// Atom: trang trong cuốn hiện tại (Book flip)
export const bookPageAtom = atom(0);

// Selector tiện dụng
export const currentBookSelector = atom((get) => BOOK_LIBRARY[get(currentBookAtom)]);
export const currentPagesSelector = atom((get) => get(currentBookSelector).pages);
export const currentBookmarkSelector = atom((get) => get(currentBookSelector).bookmark);