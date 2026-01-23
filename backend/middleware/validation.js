const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email requis'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit faire au moins 6 caractères',
        'any.required': 'Mot de passe requis'
    }),
    name: Joi.string().required().messages({
        'any.required': 'Nom requis'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email requis'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Mot de passe requis'
    })
});

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: errorMessages.join(', ') });
    }
    next();
};

module.exports = {
    validateRegister: validateRequest(registerSchema),
    validateLogin: validateRequest(loginSchema)
};
