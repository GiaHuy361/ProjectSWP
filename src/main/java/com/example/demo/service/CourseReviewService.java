package com.example.demo.service;

import com.example.demo.entity.CourseReview;
import com.example.demo.repository.CourseReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseReviewService {

    @Autowired
    private CourseReviewRepository reviewRepository;

    public List<CourseReview> getReviewsByCourseId(Integer courseId) {
        return reviewRepository.findByCourseCourseId(courseId);
    }

    public CourseReview addReview(CourseReview review) {
        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
