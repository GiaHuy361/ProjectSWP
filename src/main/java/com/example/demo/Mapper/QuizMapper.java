
        package com.example.demo.Mapper;

import com.example.demo.dto.*;
import com.example.demo.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class QuizMapper {

    // ==== Quiz ====

    public static QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) return null;

        QuizDTO dto = new QuizDTO();
        dto.setQuizId(quiz.getQuizId());
        // Bỏ Math.toIntExact, giữ kiểu Long
        dto.setCourseId(quiz.getCourse() != null ? quiz.getCourse().getCourseId() : null);
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setCreatedAt(quiz.getCreatedAt());

        if (quiz.getQuestions() != null) {
            List<QuizQuestionDTO> questions = quiz.getQuestions().stream()
                    .map(QuizMapper::toDTO)
                    .collect(Collectors.toList());
            dto.setQuestions(questions);
        }

        return dto;
    }

    public static Quiz fromDTO(QuizDTO dto, Course course) {
        if (dto == null) return null;

        Quiz quiz = new Quiz();
        quiz.setQuizId(dto.getQuizId());
        quiz.setCourse(course);
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setCreatedAt(dto.getCreatedAt());
        // Lưu ý: questions thường được xử lý riêng
        return quiz;
    }

    // ==== QuizQuestion ====

    public static QuizQuestionDTO toDTO(QuizQuestion question) {
        if (question == null) return null;

        QuizQuestionDTO dto = new QuizQuestionDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuizId(question.getQuiz() != null ? question.getQuiz().getQuizId() : null);
        dto.setQuestionText(question.getQuestionText());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setQuestionType(question.getQuestionType());

        if (question.getAnswers() != null) {
            List<QuizAnswerDTO> answers = question.getAnswers().stream()
                    .map(QuizMapper::toDTO)
                    .collect(Collectors.toList());
            dto.setAnswers(answers);
        }
        return dto;
    }

    public static QuizQuestion fromDTO(QuizQuestionDTO dto, Quiz quiz) {
        if (dto == null) return null;

        QuizQuestion question = new QuizQuestion();
        question.setQuestionId(dto.getQuestionId());
        question.setQuiz(quiz);
        question.setQuestionText(dto.getQuestionText());
        question.setQuestionType(dto.getQuestionType());
        return question;
    }

    // ==== QuizAnswer ====

    public static QuizAnswerDTO toDTO(QuizAnswer answer) {
        if (answer == null) return null;

        QuizAnswerDTO dto = new QuizAnswerDTO();
        dto.setAnswerId(answer.getAnswerId());
        dto.setQuestionId(answer.getQuestion() != null ? answer.getQuestion().getQuestionId() : null);
        dto.setAnswerText(answer.getAnswerText());
        dto.setIsCorrect(answer.getIsCorrect());

        return dto;
    }

    public static QuizAnswer fromDTO(QuizAnswerDTO dto, QuizQuestion question) {
        if (dto == null) return null;

        QuizAnswer answer = new QuizAnswer();
        answer.setAnswerId(dto.getAnswerId());
        answer.setQuestion(question);
        answer.setAnswerText(dto.getAnswerText());
        answer.setIsCorrect(dto.getIsCorrect());

        return answer;
    }

    // ==== QuizResult ====

    public static QuizResultDTO toDTO(QuizResult result) {
        if (result == null) return null;

        QuizResultDTO dto = new QuizResultDTO();
        dto.setResultId(result.getResultId());
        dto.setQuizId(result.getQuiz() != null ? result.getQuiz().getQuizId() : null);
        dto.setUserId(result.getUser() != null ? result.getUser().getId() : null);
        dto.setScore(result.getScore());
        dto.setPassed(result.getPassed());
        dto.setTakenAt(result.getTakenAt());

        return dto;
    }

    public static QuizResult fromDTO(QuizResultDTO dto, Quiz quiz, User user) {
        if (dto == null) return null;

        QuizResult result = new QuizResult();
        result.setResultId(dto.getResultId());
        result.setQuiz(quiz);
        result.setUser(user);
        result.setScore(dto.getScore());
        result.setPassed(dto.getPassed());
        result.setTakenAt(dto.getTakenAt());

        return result;
    }
}
