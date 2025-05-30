package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    // Constructor không tham số (bắt buộc)
    public Report() {
    }

    // Constructor có tham số (tuỳ chọn)
    public Report(String title, String content, LocalDateTime generatedAt) {
        this.title = title;
        this.content = content;
        this.generatedAt = generatedAt;
    }

    // Getter và Setter
    public Integer getReportId() {
        return reportId;
    }

    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
