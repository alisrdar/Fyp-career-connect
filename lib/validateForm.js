// validations
export const emailValidation = {
    required : "Email is required",
    pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
    },
}
export const passwordValidation = {
    required: "Password is required",
    minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
    },
    maxLength: {
        value: 30,
        message: "Password must not exceed 30 characters",
    },
    pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]{6,}/,
        message: "Password must contain at least one letter and one number",
    },
};

export const nameValidation = {
    required: "Name is required",
    minLength: {
        value: 3,
        message: "Name must be at least 3 characters long",
    },
    maxLength: {
        value: 50,
        message: "Name must not exceed 50 characters",
    },
    pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Name can only contain letters and spaces",
    },
}; 