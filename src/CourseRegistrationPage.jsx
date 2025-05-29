import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CourseRegistrationPage.module.css";

const coursesData = [
  // Luồng Học sinh (4 khóa)
  {
    id: 1,
    badge: "Học sinh",
    title: "Phòng Ngừa Ma Túy Cho Học Sinh",
    description:
      "Khóa học trang bị kiến thức, kỹ năng phòng ngừa ma túy cho học sinh, giúp tăng cường ý thức tự bảo vệ bản thân.",
    ageRange: "12-18 tuổi",
    duration: "5 tuần",
  },
  {
    id: 7,
    badge: "Học sinh",
    title: "Kỹ Năng Tự Vệ Và Phòng Tránh Ma Túy",
    description:
      "Trang bị kỹ năng tự vệ, từ chối các cám dỗ và nguy cơ tiếp xúc với ma túy cho học sinh.",
    ageRange: "12-18 tuổi",
    duration: "4 tuần",
  },
  {
    id: 9,
    badge: "Học sinh",
    title: "Tăng Cường Ý Thức Phòng Ngừa Ma Túy Cho Học Sinh",
    description:
      "Khóa học giúp học sinh nhận thức sâu sắc về tác hại của ma túy và cách phòng tránh.",
    ageRange: "12-18 tuổi",
    duration: "3 tuần",
  },
  {
    id: 10,
    badge: "Học sinh",
    title: "Hoạt Động Ngoại Khóa Phòng Chống Ma Túy",
    description:
      "Các hoạt động ngoại khóa nhằm nâng cao kỹ năng sống và phòng chống ma túy cho học sinh.",
    ageRange: "12-18 tuổi",
    duration: "2 tuần",
  },

  // Luồng Sinh viên (4 khóa)
  {
    id: 2,
    badge: "Sinh viên",
    title: "Kỹ Năng Phòng Ngừa Ma Túy Cho Sinh Viên",
    description:
      "Tìm hiểu các kỹ năng, kiến thức cần thiết để nhận diện và phòng tránh ma túy trong môi trường đại học, cao đẳng.",
    ageRange: "18-25 tuổi",
    duration: "4 tuần",
  },
  {
    id: 5,
    badge: "Sinh viên",
    title: "Xây Dựng Lối Sống Lành Mạnh Không Ma Túy",
    description:
      "Giúp sinh viên phát triển kỹ năng sống tích cực, xây dựng thói quen lành mạnh, tránh xa các chất gây nghiện.",
    ageRange: "18-25 tuổi",
    duration: "3 tuần",
  },
  {
    id: 11,
    badge: "Sinh viên",
    title: "Quản Lý Stress Và Nguy Cơ Sử Dụng Ma Túy",
    description:
      "Khóa học giúp sinh viên nhận biết và quản lý stress, giảm nguy cơ sử dụng ma túy.",
    ageRange: "18-25 tuổi",
    duration: "3 tuần",
  },
  {
    id: 12,
    badge: "Sinh viên",
    title: "Tư Vấn Phòng Ngừa Ma Túy Cho Sinh Viên",
    description:
      "Hướng dẫn sinh viên cách tìm kiếm hỗ trợ và tư vấn khi gặp vấn đề liên quan đến ma túy.",
    ageRange: "18-25 tuổi",
    duration: "2 tuần",
  },

  // Luồng Phụ huynh (4 khóa)
  {
    id: 3,
    badge: "Phụ huynh",
    title: "Phụ Huynh Đồng Hành Cùng Con Phòng Ngừa Ma Túy",
    description:
      "Hướng dẫn phụ huynh cách nhận biết sớm nguy cơ, hỗ trợ và giáo dục con phòng tránh ma túy.",
    ageRange: "25-50 tuổi",
    duration: "3 tuần",
  },
  {
    id: 6,
    badge: "Phụ huynh",
    title: "Tư Vấn Và Hỗ Trợ Gia Đình Phòng Ngừa Ma Túy",
    description:
      "Trang bị kiến thức và kỹ năng để gia đình có thể phối hợp cùng nhà trường và cộng đồng phòng chống ma túy.",
    ageRange: "30-55 tuổi",
    duration: "4 tuần",
  },
  {
    id: 13,
    badge: "Phụ huynh",
    title: "Kỹ Năng Giao Tiếp Với Con Về Chủ Đề Ma Túy",
    description:
      "Giúp phụ huynh biết cách trò chuyện và giáo dục con về tác hại của ma túy.",
    ageRange: "25-55 tuổi",
    duration: "3 tuần",
  },
  {
    id: 14,
    badge: "Phụ huynh",
    title: "Xây Dựng Môi Trường Gia Đình Lành Mạnh",
    description:
      "Hướng dẫn phụ huynh tạo môi trường gia đình tích cực, hỗ trợ con tránh xa ma túy.",
    ageRange: "25-55 tuổi",
    duration: "2 tuần",
  },

  // Luồng Giáo viên (4 khóa)
  {
    id: 4,
    badge: "Giáo viên",
    title: "Đào Tạo Giáo Viên Nhận Biết Và Phòng Ngừa Ma Túy",
    description:
      "Khóa học dành cho giáo viên để nâng cao kỹ năng phát hiện dấu hiệu sử dụng ma túy và hỗ trợ học sinh hiệu quả.",
    ageRange: "25-60 tuổi",
    duration: "6 tuần",
  },
  {
    id: 8,
    badge: "Giáo viên",
    title: "Chiến Lược Giáo Dục Phòng Chống Ma Túy Trong Nhà Trường",
    description:
      "Hướng dẫn giáo viên xây dựng chương trình, tổ chức hoạt động phòng chống ma túy hiệu quả tại trường học.",
    ageRange: "25-60 tuổi",
    duration: "5 tuần",
  },
  {
    id: 15,
    badge: "Giáo viên",
    title: "Phương Pháp Đánh Giá Rủi Ro Ma Túy Trong Học Đường",
    description:
      "Giúp giáo viên đánh giá và nhận diện các nguy cơ liên quan đến ma túy trong nhà trường.",
    ageRange: "25-60 tuổi",
    duration: "4 tuần",
  },
  {
    id: 16,
    badge: "Giáo viên",
    title: "Tổ Chức Hoạt Động Ngoại Khóa Phòng Chống Ma Túy",
    description:
      "Hướng dẫn giáo viên tổ chức các hoạt động ngoại khóa để phòng chống ma túy hiệu quả.",
    ageRange: "25-60 tuổi",
    duration: "3 tuần",
  },
];

// Sidebar giả định nếu bạn chưa có dữ liệu
const sidebarItems = [

];

export default function CourseRegistrationPage() {
  const [filter, setFilter] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  const filteredCourses = coursesData.filter((course) => {
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter ? course.badge === filter : true;
    return matchSearch && matchFilter;
  });

  const handleRegister = (course) => {
    // Ví dụ chuyển về trang đăng ký chung
    navigate("/course-registration");
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {sidebarItems.map(({ icon, label }) => (
            <div key={label} className={styles.navItem}>
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.mainSection}>
        <div className={styles.searchFilter}>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học về phòng ngừa ma túy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Tìm kiếm khóa học"
          />

          <div className={styles.filterButtons}>
            {["Học sinh", "Sinh viên", "Phụ huynh", "Giáo viên"].map((type) => (
              <button
                key={type}
                className={filter === type ? styles.activeFilter : styles.filterBtn}
                onClick={() => setFilter(filter === type ? null : type)}
                aria-pressed={filter === type}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.courseList}>
          {filteredCourses.length === 0 && <p>Không tìm thấy khóa học phù hợp.</p>}
          {filteredCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <span
                className={`${styles.badge} ${
                  styles[course.badge.replace(" ", "").toLowerCase()]
                }`}
              >
                {course.badge}
              </span>
              <h3 className={styles.title}>{course.title}</h3>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.info}>
                <span>Tuổi: {course.ageRange}</span>
                <span>Thời gian: {course.duration}</span>
              </div>
              <button
                className={styles.registerBtn}
                onClick={() => handleRegister(course)}
                type="button"
              >
                Đăng ký
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
