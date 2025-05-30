package com.example.demo.service;

import com.example.demo.entity.CourseCategory;
import com.example.demo.repository.CourseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseCategoryService {

    @Autowired
    private CourseCategoryRepository categoryRepository;

    public List<CourseCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
    public CourseCategory createCategory(CourseCategory category) {
        return categoryRepository.save(category);
    }
}
