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
    backCoverColor: "#9B7F57", // Màu nâu vàng ấm (giáo dục, văn hóa)
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
    backCoverColor: "#3D5A3D", // Màu xanh lá rừng đậm (rừng núi Yên Thế)
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
    backCoverColor: "#f4d35c", // Màu đỏ nâu đậm (lòng yêu nước, chiến đấu)
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
    backCoverColor: "#1E3A5B", // Màu xanh dương đậm (biển cả, hành trình Đông Du)
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
    backCoverColor: "#1E3A5B", // Màu vàng nâu ấm (cải cách, đổi mới)
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
    title: "Phong trào Chống Thuế Trung Kỳ",
    notebookFolder: "notebook6",
    coverTexture: "PT_ChongThueTrungKi_Cover",
    backCoverColor: "#e8e3e3", // Màu nâu sẫm (đất, nông dân)
    bookmarkFront: "PT_ChongThueTrungKi_BM_Front",
    bookmarkBack: "PT_ChongThueTrungKi_BM_Cover", // Dùng Cover thay Back vì không có Back
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_ChongThueTrungKi_BM_Front", 
      back: "PT_ChongThueTrungKi_BM_Cover",
      folder: "notebook6"
    },
    story: {
      title: "Phong trào Chống Thuế Trung Kỳ",
      paragraphs: [
        "Phong trào Chống Thuế Trung Kỳ là phong trào đấu tranh của nông dân chống lại sưu cao thuế nặng.",
        "Tài liệu về tinh thần đấu tranh và khí phách của người dân Trung Kỳ.",
      ],
    },
  },
  {
    id: "notebook-07",
    title: "Khởi nghĩa Bãi Sậy",
    notebookFolder: "notebook7",
    coverTexture: "PT_VoSanHoa_Cover",
    backCoverColor: "#df1b1b", // Màu xanh lá đậm (đồng bằng, lau sậy)
    bookmarkFront: "PT_VoSanHoa_BM_Front",
    bookmarkBack: "PT_VoSanHoa_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_VoSanHoa_BM_Front", 
      back: "PT_VoSanHoa_BM_Back",
      folder: "notebook7"
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
    title: "Khởi nghĩa Thái Nguyên",
    notebookFolder: "notebook8",
    coverTexture: "KN_ThaiNguyen_Cover",
    backCoverColor: "#df2020", // Màu nâu vàng đậm (rừng núi, khởi nghĩa)
    bookmarkFront: "KN_ThaiNguyen_BM_Front",
    bookmarkBack: "KN_ThaiNguyen_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "KN_ThaiNguyen_BM_Front", 
      back: "KN_ThaiNguyen_BM_Back",
      folder: "notebook8"
    },
    story: {
      title: "Khởi nghĩa Thái Nguyên",
      paragraphs: [
        "Khởi nghĩa Thái Nguyên là một cuộc khởi nghĩa quan trọng chống thực dân Pháp.",
        "Ghi lại tinh thần đấu tranh và những chiến công của nghĩa quân Thái Nguyên.",
      ],
    },
  },
  {
    id: "notebook-09",
    title: "Phan Châu Trinh",
    notebookFolder: "notebook9",
    coverTexture: "PhanChauTrinh_Cover",
    backCoverColor: "#FFFFFF", // Màu nâu xám (văn học, trí thức)
    bookmarkFront: "PhanChauTrinh_BM_Front",
    bookmarkBack: "PhanChauTrinh_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PhanChauTrinh_BM_Front", 
      back: "PhanChauTrinh_BM_Back",
      folder: "notebook9"
    },
    story: {
      title: "Phan Châu Trinh",
      paragraphs: [
        "Phan Châu Trinh là nhà cách mạng, nhà văn hóa lớn của Việt Nam đầu thế kỷ 20.",
        "Tài liệu về cuộc đời và sự nghiệp đấu tranh vì dân tộc của Phan Châu Trinh.",
      ],
    },
  },
  {
    id: "notebook-10",
    title: "Phong trào Án Xá Phan Bội Châu",
    notebookFolder: "notebook10",
    coverTexture: "PT_AnXaPBC_Cover",
    backCoverColor: "#e8cb88", // Màu xanh dương xám (tự do, cách mạng)
    bookmarkFront: "PT_AnXaPBC_BM_front", // Chú ý: file thực tế là "front" (chữ thường)
    bookmarkBack: "PT_AnXaPBC_BM_Back",
    pages: buildNotebookPages({
      innerRuledCount: 10,
      ruledTexture: "ruled-paper",
    }),
    bookmark: { 
      front: "PT_AnXaPBC_BM_front", // Chú ý: file thực tế là "front" (chữ thường)
      back: "PT_AnXaPBC_BM_Back",
      folder: "notebook10"
    },
    story: {
      title: "Phong trào Án Xá Phan Bội Châu",
      paragraphs: [
        "Phong trào Án Xá Phan Bội Châu là phong trào đấu tranh đòi thả Phan Bội Châu.",
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