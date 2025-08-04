const Joi = require('joi');

const ListingSchema = Joi.object({
    listing :Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("", null),
        price:Joi.number().required().min(0)
    }).required()
}) 

const reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),

    }).required()
})


module.exports = { ListingSchema,reviewSchema };
