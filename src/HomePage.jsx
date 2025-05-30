import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const stats = [
  { title: "Người dùng hiện tại", value: "8,250", note: "+120 tuần này", colorClass: styles.statLightBlue },
  { title: "Khóa học đã đăng ký", value: "320", note: "+20 tuần này", colorClass: styles.statLightGreen },
  { title: "Lượt đặt lịch tư vấn", value: "1,100", note: "+40 tháng này", colorClass: styles.statLightYellow },
  { title: "Chương trình truyền thông", value: "35", note: "+2 tháng này", colorClass: styles.statLightGray },
];

const actions = [
  { title: "Đăng ký khóa học", colorClass: styles.actionBlue },
  { title: "Làm khảo sát", colorClass: styles.actionGreen },
  { title: "Đặt lịch hẹn", colorClass: styles.actionYellow },
  { title: "Xem báo cáo", colorClass: styles.actionBlue },
];

const articles = [
  {
    title: "Những dấu hiệu cảnh báo sớm sử dụng ma túy",
    description: "Tìm hiểu các dấu hiệu giúp phát hiện nguy cơ sử dụng ma túy trong cộng đồng, gia đình.",
    date: "12/05/2025",
    img: "url-to-image-1.jpg",
  },
  {
    title: "Gia đình đồng hành phòng ngừa ma túy",
    description: "Vai trò của gia đình trong giáo dục, hướng dẫn, hỗ trợ con em tránh xa ma túy.",
    date: "8/5/2025",
    img: "url-to-image-2.jpg",
  },
  {
    title: "Những chương trình truyền thông hiệu quả",
    description: "Cách tổ chức các hoạt động truyền thông cộng đồng phòng chống ma túy.",
    date: "6/5/2025",
    img: "url-to-image-3.jpg",
  },
  {
    title: "Vai trò của chuyên gia tư vấn",
    description: "Chuyên viên tư vấn hỗ trợ, đồng hành cùng bạn và cộng đồng trong phòng ngừa ma túy.",
    date: "3/5/2025",
    img: "url-to-image-4.jpg",
  },
  {
    title: "Ứng dụng công nghệ trong phòng chống ma túy",
    description: "",
    date: "",
    img: "url-to-image-5.jpg",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepageContainer}>
      {/* Header text */}
      <div>
        <h1 className={styles.headerTitle}>
          Vì một cộng đồng <span className={styles.headerHighlight}>không ma túy</span>
        </h1>
        <p className={styles.headerParagraph}>
          Chúng tôi đồng hành cùng bạn trong hành trình{" "}
          <strong className={styles.headerStrong}>phòng ngừa và đẩy lùi</strong> tệ nạn ma túy, xây dựng cộng
          đồng khỏe mạnh, văn minh, an toàn cho mọi người.
        </p>
        <p className={styles.headerSmallParagraph}>
          Sứ mệnh của chúng tôi là kết nối, hỗ trợ và cung cấp kiến thức, công cụ thực tiễn giúp phòng ngừa sử dụng ma túy trong cộng đồng.
        </p>
        <button className={styles.btnPrimary} onClick={() => navigate(" ")}>Tham gia ngay</button>
        <button className={styles.btnSecondary}>Tìm hiểu thêm</button>
      </div>

      {/* Stats */}
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statBox} ${stat.colorClass}`}>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statNote}>{stat.note}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className={styles.actionsContainer}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${styles.actionBtn} ${action.colorClass}`}
            onClick={() => {
              if (action.title === "Đăng ký khóa học") {
                navigate("/course-registration");
              } else {
                alert(`Bạn bấm vào: ${action.title}`);
              }
            }}
          >
            {action.title}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className={styles.articlesContainer}>
        <h3 className={styles.articlesHeader}>Bài viết chia sẻ kinh nghiệm</h3>
        <div className={styles.articleList}>
          {articles.map((art, index) => (
            <div key={index} className={styles.articleCard}>
              <img src={art.img} alt={art.title} className={styles.articleImage} />
              <div className={styles.articleContent}>
                <div className={styles.articleDate}>{art.date}</div>
                <h4 className={styles.articleTitle}>{art.title}</h4>
                <p className={styles.articleDescription}>{art.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;