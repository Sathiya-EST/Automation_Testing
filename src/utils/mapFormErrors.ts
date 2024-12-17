

/**
 * Maps API error messages to the form errors using react-hook-form's setError.
 * @param {Object} validationMessage - The validation messages from the API response.
 * @param {Function} setError - react-hook-form's setError function to set the error for each field.
 */
const mapErrors = (validationMessage: object, setError: Function) => {
    Object.entries(validationMessage).forEach(([field, message]) => {
        setError(field, {
            type: "manual",
            message,
        });
    });
};
export default mapErrors;