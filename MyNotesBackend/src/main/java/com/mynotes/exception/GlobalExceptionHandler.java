package com.mynotes.exception;

import com.mynotes.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 1. ÖZEL HATA: Veri bulunamadığında (404)
    @ExceptionHandler(RecourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(RecourceNotFoundException ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                request.getDescription(false), // Hangi URL'den geldi?
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 2. GENEL HATA: Beklenmeyen durumlar (500)
    // Firebase ExecutionException ve InterruptedException hatalarını da burada yakalarız.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Beklenmeyen bir hata oluştu: " + ex.getMessage(),
                request.getDescription(false),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
