package Ecommerce.Ecommerce.exception;

public class NotFoundException extends RuntimeException{

    public NotFoundException(String message)
    {
        super(message);
    }
}
/*
public class NotFoundException

You are creating a custom exception called NotFoundException.

An exception is like an error signal in Java that something went wrong.

extends RuntimeException

Your NotFoundException inherits from RuntimeException.

RuntimeException is a type of exception that doesn’t need to be explicitly handled with try-catch.

Basically, you are saying: “This is a type of runtime error.”

The constructor:

  public NotFoundException(String message) {
    super(message);
}
ublic NotFoundException(String message) is a constructor. It is used when you create the exception.

super(message) calls the constructor of the parent class (RuntimeException) and passes a message describing the error.

Example usage:

throw new NotFoundException("User not found");

In simple words:

You created a custom error called NotFoundException.

You can throw it whenever something is missing, like a user or a product.

The message you pass will explain what exactly is missing.
 */