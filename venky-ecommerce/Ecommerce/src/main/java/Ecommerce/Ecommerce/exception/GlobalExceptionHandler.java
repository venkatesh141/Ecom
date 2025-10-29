package Ecommerce.Ecommerce.exception;


import Ecommerce.Ecommerce.dto.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleAllException(Exception ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Response> handleNotFoundException(NotFoundException ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Response> handleInvalidCredentialsExceptionException(InvalidCredentialsException ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

}
/*
Class Definition
java
@ControllerAdvice
public class GlobalExceptionHandler {
@ControllerAdvice: This annotation tells Spring that this class will handle exceptions globally across the whole application (for all controllers).

public class GlobalExceptionHandler: This is the class where we define how specific exceptions should be handled.

Handling All Exceptions
java
@ExceptionHandler(Exception.class)
public ResponseEntity<Response> handleAllException(Exception ex, WebRequest request){
@ExceptionHandler(Exception.class): This method will be called when any generic Exception occurs (acts as a catch-all).

public ResponseEntity<Response>: The method returns a ResponseEntity (a Spring wrapper that holds an HTTP status code + a response body).

(Exception ex, WebRequest request): The method receives the actual exception object (ex) and request details.

java
Response errorResponse = Response.builder()
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .message(ex.getMessage())
        .build();
A Response object is built using a builder pattern:

.status(...): Sets the HTTP status code (500 for internal server error).

.message(ex.getMessage()): Sets the error message from the exception.

.build(): Finalizes the object.

java
return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
Returns the response object along with HTTP 500 Internal Server Error.

Handling "Not Found" Exception
java
@ExceptionHandler(NotFoundException.class)
public ResponseEntity<Response> handleNotFoundException(NotFoundException ex, WebRequest request){
Handles NotFoundException when thrown anywhere in the app.

Returns an error response with an HTTP 404 (Not Found).

java
Response errorResponse = Response.builder()
        .status(HttpStatus.NOT_FOUND.value())
        .message(ex.getMessage())
        .build();
Builds the response object with:

Status code 404

Exception message

java
return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
Returns the response + 404 Not Found.

Handling Invalid Credentials Exception
java
@ExceptionHandler(InvalidCredentialsException.class)
public ResponseEntity<Response> handleInvalidCredentialsExceptionException(InvalidCredentialsException ex, WebRequest request){
Handles cases where an InvalidCredentialsException is thrown (for example, wrong username/password).

Returns an HTTP 400 Bad Request.

java
Response errorResponse = Response.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .message(ex.getMessage())
        .build();
Builds the response with:

Status code 400

Error message from exception

java
return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
Returns the response + 400 Bad Request.

Summary of Workings
ControllerAdvice: Centralized exception handling for all controllers.

@ExceptionHandler: Declares which exception the method handles.

ResponseEntity<Response>: Sends back structured JSON with an HTTP status code.

Response.builder(): Creates a consistent response format (status code + message).

 */
