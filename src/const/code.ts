export enum ErrorCodes {
    // Validation Errors
    VALIDATION_ERROR = 'VALIDATION_ERROR', // Indicates that the provided input does not meet the validation criteria.
  
    // Database Errors
    DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR', // Indicates that there was a problem connecting to the database.
    DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR', // Indicates that a query failed to execute correctly.
  
    // Authentication Errors
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED', // Indicates that user authentication failed (e.g., invalid credentials).
    AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED', // Indicates that the user is not authorized to access a particular resource.
  
    // Service Errors
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // Indicates that a service is temporarily unavailable or under maintenance.
    THIRD_PARTY_SERVICE_ERROR = 'THIRD_PARTY_SERVICE_ERROR', // Indicates an error occurred when interacting with a third-party service.
  
    // HTTP Errors
    NOT_FOUND = 'NOT_FOUND', // Indicates that the requested resource was not found.
    BAD_REQUEST = 'BAD_REQUEST', // Indicates that the request could not be processed due to a client error (e.g., malformed request).
    UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS', // Indicates that the request lacks valid authentication credentials.
  
    // Miscellaneous Errors
    CONFLICT = 'CONFLICT', // Indicates that the request could not be completed due to a conflict with the current state of the resource.
    TIMEOUT = 'TIMEOUT', // Indicates that the request timed out.
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // Indicates an unexpected server error occurred.
  }
  