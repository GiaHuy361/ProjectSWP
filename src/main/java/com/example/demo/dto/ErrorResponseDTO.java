package com.example.demo.dto;

public class ErrorResponseDTO {
    private String message;
    private int status;

    public ErrorResponseDTO(String message, int status) {
        this.message = message;
        this.status = status;
    }

    // Getters và setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}