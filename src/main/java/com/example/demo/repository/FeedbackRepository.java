package com.example.demo.repository;

import com.example.demo.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    // Tìm feedback theo danh sách trạng thái (để phục vụ service lấy feedback mới, đang xử lý)
    List<Feedback> findByStatusIn(List<Feedback.Status> statuses);
}
