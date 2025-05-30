package com.example.demo.service;

import com.example.demo.entity.CourseLesson;
import com.example.demo.repository.CourseLessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseLessonService {

    @Autowired
    private CourseLessonRepository lessonRepository;

    public List<CourseLesson> getLessonsByCourseId(Integer courseId) {
        return lessonRepository.findByCourseCourseIdOrderByLessonOrderAsc(courseId);
    }

    public CourseLesson addLesson(CourseLesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }
}
