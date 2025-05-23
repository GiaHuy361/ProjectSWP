import React from "react";
import styles from "./HomePage.module.css";

import img1 from "./assets/image1.jpg";
import img2 from "./assets/image2.jpg";
import img3 from "./assets/image3.jpg";
import img4 from "./assets/image4.jpg"; // Ảnh bên phải tiêu đề
import img5 from "./assets/image8.jpg";

import iconBrain from "./assets/brain.jpg";
import iconHeart from "./assets/heart.jpg";
import iconPsycho from "./assets/psycho.jpg";

const HomePage = () => {
  return (
    <div className={styles.container}>
      {/* Phần header tiêu đề + ảnh bên phải */}
      <div className={styles.headerSection}>
        <div className={styles.textLeft}>
          <h1 className={styles.title}>Drug Prevention eLearning Platform</h1>

          <p className={styles.intro}>
            Một nền tảng cung cấp kiến thức phòng chống ma túy hiện đại, đa dạng và
            toàn diện, giúp học sinh chủ động nhận biết và phòng tránh các loại ma
            túy nguy hiểm. Giúp xây dựng lối sống lành mạnh, phát triển tư duy, kỹ
            năng sống, góp phần xây dựng cộng đồng an toàn, lành mạnh không ma túy.
            <br /><br />
            Nền tảng được thiết kế với giao diện trực quan, phù hợp cho học sinh, sinh viên, giáo viên và phụ huynh. Người dùng có thể dễ dàng truy cập các tài liệu, video minh họa, tình huống mô phỏng thực tế để tăng cường khả năng nhận diện và xử lý các tình huống liên quan đến ma túy.
            <br /><br />
            Ngoài ra, hệ thống còn tích hợp các bài kiểm tra đánh giá nhận thức, công cụ tự đánh giá nguy cơ và chức năng kết nối với chuyên gia tư vấn tâm lý trực tuyến, hỗ trợ can thiệp sớm và kịp thời.
            <br /><br />
            Chúng tôi tin rằng giáo dục phòng chống ma túy không chỉ là trách nhiệm của nhà trường, mà còn cần sự phối hợp từ gia đình và toàn xã hội. Cùng chung tay xây dựng một thế hệ trẻ khỏe mạnh, bản lĩnh và nói không với ma túy.
          </p>

        </div>
        <div className={styles.verticalDivider}></div>
        <div className={styles.imageRight}>
          <img src={img1} alt="Ảnh bên phải tiêu đề" />
        </div>
      </div>

      <h2 className={styles.sectionTitle1}>Thông Tin</h2>

      {/* Container bao ngoài phần ảnh + chữ */}
      <div className={styles.imageRowAndList}>
        <div className={styles.imageRow}>
          <img src={img2} alt="Thông tin 1" />
          <img src={img3} alt="Thông tin 2" />
          <img src={img4} alt="Thông tin 3" />
        </div>

        <div className={styles.listContainer}>
          <div className={styles.listHeader}>Các loại chất kích thích phổ biến hiện nay</div>
          <div className={styles.list}>
            <ul>
              <li>
                <b>Nhóm ma túy kích thích (Stimulants):</b>
                <ul>
                  <li>Methamphetamine (ma túy đá) – gây hưng phấn mạnh, dễ nghiện, làm suy kiệt cơ thể nhanh chóng.</li>
                  <li>Cocaine – gây khoái cảm tạm thời, dễ dẫn đến trầm cảm và hoang tưởng khi sử dụng lâu dài.</li>
                  <li>Amphetamine – làm tăng hoạt động não, có thể gây mất ngủ, loạn thần và rối loạn cảm xúc.</li>
                </ul>
              </li>
              <li>
                <b>Nhóm ma túy ức chế thần kinh (Depressants):</b>
                <ul>
                  <li>Heroin – gây cảm giác thư giãn mạnh, nhưng có khả năng gây nghiện cực cao và gây suy giảm chức năng hô hấp.</li>
                  <li>Morphine – dùng trong y tế nhưng dễ bị lạm dụng, gây lệ thuộc cả về thể chất lẫn tinh thần.</li>
                  <li>Codeine – thường xuất hiện trong thuốc ho, khi lạm dụng có thể gây nghiện và tổn thương gan.</li>
                </ul>
              </li>
              <li>
                <b>Nhóm gây ảo giác (Hallucinogens):</b>
                <ul>
                  <li>LSD (Acid) – gây ảo giác mạnh, làm thay đổi nhận thức về không gian và thời gian.</li>
                  <li>Ketamine – thuốc mê thú y, khi lạm dụng có thể gây mất trí nhớ và cảm giác tách rời cơ thể.</li>
                  <li>Magic Mushrooms (Nấm ảo giác) – gây rối loạn cảm xúc, hoang tưởng và rối loạn hành vi.</li>
                </ul>
              </li>
              <li>
                <b>Chất gây nghiện hợp pháp:</b>
                <ul>
                  <li>Nicotine (thuốc lá) – gây nghiện nhanh, ảnh hưởng trực tiếp đến tim mạch và hệ hô hấp.</li>
                  <li>Caffeine – tuy phổ biến nhưng khi lạm dụng có thể gây mất ngủ, lo âu và tăng huyết áp.</li>
                  <li>Alcohol (rượu, bia) – ảnh hưởng tới gan, thần kinh và là nguyên nhân dẫn đến nhiều tai nạn xã hội.</li>
                </ul>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Phần còn lại giữ nguyên */}
      <h2 className={styles.sectionTitle2}>
        Tác động của các chất kích thích đến cơ thể và não bộ
      </h2>

      {/* 2 hình đầu nằm trên tiêu đề và căn giữa */}
      <div className={styles.impactSection}>
        <div className={styles.topRow}>
          <div className={styles.impactItem}>
            <img src={iconBrain} alt="Hệ thần kinh" />
            <div className={styles.textContent}>
              <h3>Hệ thần kinh:</h3>
              <ul>
                <li>Rối loạn nhận thức, giảm trí nhớ, hoang tưởng, lú lẫn, rối loạn cảm xúc.</li>
                <li>Cơ thể gầy gò yếu ớt, lờ đờ, mệt mỏi liên tục.</li>
              </ul>
            </div>
          </div>
          <div className={styles.verticalDivider1}></div>
          <div className={styles.impactItem}>
            <img src={iconHeart} alt="Tim mạch - Nội tạng" />
            <div className={styles.textContent}>
              <h3>Tim mạch – Nội tạng:</h3>
              <ul>
                <li>Tăng nhịp tim bất thường, đau tim, suy tim, suy thận.</li>
                <li>Tụt huyết áp, mệt mỏi, suy yếu, ngừng tim.</li>
              </ul>
            </div>
          </div>
        </div>



        {/* Ảnh thứ 3 bên trái, chữ bên phải */}
        <div className={styles.bottomRow}>
          <img src={iconPsycho} alt="Tâm lý – xã hội" />
          <div className={styles.textContent}>
            <h3>Tâm lý – xã hội:</h3>
            <ul>

              <li>Rối loạn cảm xúc, bệnh thần kinh, có biểu hiện lo âu, sợ hãi, trầm cảm.</li>
              <li>Nhất là dễ bị kích động, hành xử bạo lực.</li>
              <li>Cảm giác cô đơn, mất kết nối với xã hội và gia đình.</li>
              <li>Giảm khả năng tập trung, ảnh hưởng đến học tập và công việc.</li>
              <li>Tăng nguy cơ tự tử và các hành vi tự hại.</li>
              <li>Rối loạn giấc ngủ, mất ngủ kéo dài gây suy nhược cơ thể.</li>
              <li>Ảnh hưởng tiêu cực đến khả năng xử lý tình huống và ra quyết định.</li>
              <li>Gia tăng các hành vi liều lĩnh, gây tổn hại cho bản thân và người khác.</li>
              <li>Cần có sự hỗ trợ tâm lý, can thiệp kịp thời để phục hồi sức khỏe tinh thần.</li>
            </ul>
          </div>
        </div>
      </div>



      <h2 className={styles.sectionTitle3}>Giải pháp phòng ngừa & Giáo dục:</h2>
      <div className={styles.preventionSection}>
        <div className={styles.preventionImage}>
          <img src={img5} alt="Giải pháp phòng ngừa" />
        </div>

        <ul className={styles.preventionList}>
          <li>Tham gia khóa học trực tuyến, tìm hiểu về hậu quả của ma túy.</li>
          <li>Làm bài test tự đánh giá ngay cơ nguy cơ nghiện, CRATFF.</li>
          <li>Gặp chuyên viên tâm lý online để được hướng dẫn phòng tránh và hỗ trợ tâm lý.</li>
          <li>Tăng cường truyền thông trong ma túy và cộng đồng.</li>
          <li>Tham gia các buổi tư vấn nhóm và các hoạt động hỗ trợ cộng đồng.</li>
          <li>Hỗ trợ gia đình và người thân trong việc nhận diện và phòng tránh ma túy.</li>
          <li>Khuyến khích môi trường học tập và làm việc không ma túy.</li>
          <li>Hợp tác với các tổ chức xã hội và chính quyền địa phương để nâng cao nhận thức.</li>
        </ul>
      </div>

    </div>

  );
};

export default HomePage;
