export const AUTH_MESSAGE = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful. Please check your email to verify your account.',
    FORGOT_PASSWORD_SUCCESS: 'Check your email to reset your password.',
    FORGOT_PASSWORD_FAILED: 'Failed to send password reset email.',
    RESET_PASSWORD_SUCCESS: 'Your password has been reset successfully.',
    RESET_PASSWORD_FAILED: 'Failed to reset password.',
    RESET_LINK_INVALID: 'Reset link is invalid or expired.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    LOGIN_FAILED: 'Login failed. Please check your email and password.',
    LOGIN_REQUIRED: 'Please log in to continue.',
} as const

export const AUTH_LABEL = {
    GOOGLE_CONNECTING: 'Connecting...',
    CONTINUE_WITH_GOOGLE: 'Continue with Google',
    LOGGING_IN: 'Logging in...',
    LOGIN: 'Log in',
    FORGOT_PASSWORD: 'Forgot password?',
    SIGN_UP: 'Sign up',
    CREATING_ACCOUNT: 'Creating...',
    CREATE_ACCOUNT: 'Create account',
    SIGN_IN: 'Sign in',
    SENDING: 'Sending...',
    SEND: 'Send',
    SAVING: 'Saving...',
    BACK_TO_SIGN_UP: 'Go back to Sign up',
} as const

export const AUTH_TEXT = {
    LOGIN_TITLE: 'Welcome back',
    LOGIN_DESCRIPTION: 'Enter your details to sign in to your account.',
    OR: 'or',
    EMAIL_LABEL: 'Email address',
    EMAIL_PLACEHOLDER: 'name@example.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: '........',
    NO_ACCOUNT: "Don't have an account?",
    REGISTER_TITLE: 'Nice to meet you!',
    REGISTER_DESCRIPTION: 'Create an account.',
    CONFIRM_PASSWORD_LABEL: 'Confirm Password',
    ALREADY_HAVE_ACCOUNT: 'Already have an account?',
    FORGOT_PASSWORD_TITLE: 'Forgot Password?',
    FORGOT_PASSWORD_DESCRIPTION: "Enter your email address and we'll send you a link to reset your password.",
    RESET_PASSWORD_TITLE: 'Reset your password',
    RESET_PASSWORD_DESCRIPTION: 'Enter your new password',
    NEW_PASSWORD_LABEL: 'Your new password',
} as const

export const AUTH_URL = {
    GOOGLE_LOGIN: 'http://localhost:4000/auth/google',
} as const

export const AUTH_BRAND = {
    LOGO: '/images/svg/logo.svg',
    LOGO_ALT: 'Juju Blue Logo',
    NAME: 'Juju Blue',
    TAGLINE: 'Elevate your discourse.',
} as const

export const AUTH_VALIDATION_MESSAGE = {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Email is invalid',
    PASSWORD_REQUIRED: 'Password is required',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    NEW_PASSWORD_REQUIRED: 'New password is required',
    NEW_PASSWORD_MIN: 'Password must be at least 8 characters',
    PASSWORDS_MUST_MATCH: 'Passwords must match',
} as const
