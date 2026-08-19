// ============================================================
// Sample Questions — Lịch Sử Việt Nam
// Replace these with actual questions later.
// ============================================================
import { Question } from '@/types/game';

const questions: Question[] = [
  {
    id: 1,
    question: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?',
    answers: ['1953', '1954', '1955', '1956'],
    correctAnswer: 1,
    explanation:
      'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đã kết thúc thắng lợi cuộc kháng chiến chống thực dân Pháp kéo dài 9 năm.',
  },
  {
    id: 2,
    question: 'Ai là người đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa?',
    answers: ['Võ Nguyên Giáp', 'Hồ Chí Minh', 'Phạm Văn Đồng', 'Trường Chinh'],
    correctAnswer: 1,
    explanation:
      'Ngày 2/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
  },
  {
    id: 3,
    question: 'Nhà Trần đánh bại quân Nguyên Mông bao nhiêu lần?',
    answers: ['1 lần', '2 lần', '3 lần', '4 lần'],
    correctAnswer: 2,
    explanation:
      'Nhà Trần đã 3 lần đánh bại quân Nguyên Mông xâm lược vào các năm 1258, 1285 và 1287-1288.',
  },
  {
    id: 4,
    question: 'Trống đồng Đông Sơn thuộc nền văn hóa nào?',
    answers: ['Văn hóa Sa Huỳnh', 'Văn hóa Đông Sơn', 'Văn hóa Óc Eo', 'Văn hóa Hòa Bình'],
    correctAnswer: 1,
    explanation:
      'Trống đồng Đông Sơn là biểu tượng tiêu biểu nhất của nền văn hóa Đông Sơn, tồn tại từ khoảng thế kỷ 7 TCN đến thế kỷ 1-2 SCN.',
  },
  {
    id: 5,
    question: 'Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?',
    answers: ['Năm 40', 'Năm 42', 'Năm 44', 'Năm 38'],
    correctAnswer: 0,
    explanation:
      'Mùa xuân năm 40, Hai Bà Trưng phất cờ khởi nghĩa ở Mê Linh, đánh đuổi quân Đông Hán, giành độc lập trong 3 năm.',
  },
  {
    id: 6,
    question: 'Lý Thường Kiệt chỉ huy đánh bại quân xâm lược nào trên sông Như Nguyệt?',
    answers: ['Quân Nguyên', 'Quân Minh', 'Quân Tống', 'Quân Thanh'],
    correctAnswer: 2,
    explanation:
      'Năm 1077, Lý Thường Kiệt chỉ huy đánh bại quân Tống trên phòng tuyến sông Như Nguyệt (sông Cầu), bảo vệ nền độc lập.',
  },
  {
    id: 7,
    question: 'Ai là vị vua sáng lập triều đại nhà Lý?',
    answers: ['Lý Thái Tổ', 'Lý Thái Tông', 'Lý Nhân Tông', 'Lý Thánh Tông'],
    correctAnswer: 0,
    explanation:
      'Lý Công Uẩn (Lý Thái Tổ) lên ngôi năm 1009, sáng lập nhà Lý và dời đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay).',
  },
  {
    id: 8,
    question: 'Chiến thắng Bạch Đằng năm 938 do ai lãnh đạo?',
    answers: ['Trần Hưng Đạo', 'Ngô Quyền', 'Lê Hoàn', 'Lý Thường Kiệt'],
    correctAnswer: 1,
    explanation:
      'Năm 938, Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập.',
  },
  {
    id: 9,
    question: 'Phong trào Cần Vương được phát động bởi ai?',
    answers: ['Vua Hàm Nghi', 'Vua Tự Đức', 'Vua Duy Tân', 'Vua Thành Thái'],
    correctAnswer: 0,
    explanation:
      'Năm 1885, vua Hàm Nghi ban chiếu Cần Vương kêu gọi nhân dân đứng lên chống Pháp, mở ra phong trào yêu nước sôi nổi.',
  },
  {
    id: 10,
    question: 'Nguyễn Huệ (Quang Trung) đại phá quân Thanh vào mùa xuân năm nào?',
    answers: ['1788', '1789', '1790', '1791'],
    correctAnswer: 1,
    explanation:
      'Mùa xuân năm 1789, vua Quang Trung - Nguyễn Huệ đại phá 29 vạn quân Thanh, giải phóng Thăng Long chỉ trong 5 ngày.',
  },
  {
    id: 11,
    question: 'Hiệp định Genève về Đông Dương được ký kết năm nào?',
    answers: ['1953', '1954', '1955', '1956'],
    correctAnswer: 1,
    explanation:
      'Hiệp định Genève được ký ngày 21/7/1954, công nhận độc lập, chủ quyền và toàn vẹn lãnh thổ của Việt Nam, Lào và Campuchia.',
  },
  {
    id: 12,
    question: 'Thành nhà Hồ (Thanh Hóa) được UNESCO công nhận là Di sản Thế giới năm nào?',
    answers: ['2009', '2010', '2011', '2012'],
    correctAnswer: 2,
    explanation:
      'Thành nhà Hồ được UNESCO công nhận là Di sản Văn hóa Thế giới năm 2011, là thành đá duy nhất ở Đông Nam Á.',
  },
  {
    id: 13,
    question: 'Chữ Quốc ngữ được phát triển chủ yếu bởi ai?',
    answers: ['Nguyễn Trãi', 'Alexandre de Rhodes', 'Nguyễn Du', 'Phan Bội Châu'],
    correctAnswer: 1,
    explanation:
      'Alexandre de Rhodes, một giáo sĩ Bồ Đào Nha, đã có công lớn trong việc hoàn thiện và phổ biến chữ Quốc ngữ vào thế kỷ 17.',
  },
  {
    id: 14,
    question: 'Trận Đống Đa nổi tiếng trong lịch sử Việt Nam gắn với vị tướng nào?',
    answers: ['Trần Hưng Đạo', 'Lê Lợi', 'Quang Trung', 'Nguyễn Trãi'],
    correctAnswer: 2,
    explanation:
      'Trận Đống Đa (1789) do vua Quang Trung chỉ huy, đánh bại quân Thanh xâm lược, là một trong những chiến thắng vĩ đại nhất.',
  },
  {
    id: 15,
    question: 'Kinh đô của nước Đại Việt thời nhà Trần nằm ở đâu?',
    answers: ['Hoa Lư', 'Thăng Long', 'Phú Xuân', 'Đại La'],
    correctAnswer: 1,
    explanation:
      'Thăng Long (Hà Nội ngày nay) là kinh đô của Đại Việt từ thời Lý và tiếp tục được nhà Trần sử dụng làm kinh đô.',
  },
];

export default questions;
