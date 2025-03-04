import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import Joi from 'joi';

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        maxlength: 2048,
        minlength: 3,
        required: true
    },
    shortUrl: {
        type: String,
        maxlength: 5,
        default: () => nanoid(5),
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    validDays: {
        type: Number,
        default: 7
    },
    clicks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

function validateUrl(url) {
    const schema = Joi.object({
        originalUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        validDays: Joi.number().integer().min(1).max(365),
        createdAt: Joi.date(),
        clicks: Joi.number().integer().min(0),
        isActive: Joi.boolean()

    });
    return schema.validate(url);
}

const Url = mongoose.model('Url', urlSchema);

export { Url, validateUrl };
