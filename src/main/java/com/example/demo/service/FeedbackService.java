package com.example.demo.service;

import com.example.demo.entity.Feedback;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    /**
     * Lấy danh sách feedback có trạng thái New hoặc InProgress.
     * @return List feedback
     */
    public List<Feedback> getNewAndInProgressFeedbacks() {
        // Lưu ý: method này yêu cầu bạn có method findByStatusIn trong FeedbackRepository
        return feedbackRepository.findByStatusIn(List.of(Feedback.Status.New, Feedback.Status.InProgress));
    }

    /**
     * Cập nhật phản hồi cho feedback theo id, bao gồm status và response.
     * @param id feedback id (Integer)
     * @param responseData dữ liệu trả lời (status, response)
     * @return true nếu cập nhật thành công, false nếu không tìm thấy hoặc lỗi trạng thái
     */
    public boolean respondFeedback(Integer id, Map<String, String> responseData) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(id);
        if (optionalFeedback.isEmpty()) return false;

        Feedback feedback = optionalFeedback.get();

        if (responseData.containsKey("status")) {
            try {
                Feedback.Status status = Feedback.Status.valueOf(responseData.get("status"));
                feedback.setStatus(status);
                if (status == Feedback.Status.Resolved) {
                    feedback.setResolvedAt(LocalDateTime.now());
                }
            } catch (IllegalArgumentException e) {
                // Trạng thái không hợp lệ
                return false;
            }
        }

        if (responseData.containsKey("response")) {
            feedback.setResponse(responseData.get("response"));
        }

        feedbackRepository.save(feedback);
        return true;
    }
}
