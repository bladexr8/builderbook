import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import logger from '../logs';

const { Schema } = mongoose;

const mongoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const EmailTemplate = mongoose.model('EmailTemplate', mongoSchema);

// if email template doesn't exist, add it to database
function insertTemplates() {
    logger.info("Creating Welcome Email Template...");
    const templates = [
        {
            name: 'welcome',
            subject: 'Welcome to builderbook.org',
            message: `{{userName}},
                <p>
                    Thanks for signing up for Builder Book!
                </p>
                <p>
                    In our books, we teach you how to build complete, production-ready apps from scratch.
                </p>
                
                Kelly & Timur, Team Builder Book
            `,
        },
    ];

    // check if template already exists
    templates.forEach(async (template) => {
        if ((await EmailTemplate.find({ name: template.name }).count()) > 0) {
            return;
        }
        EmailTemplate
            .create(template)
            .catch((error) => {
                logger.error('EmailTemplate insertion error: ', error);
            });
    });
}

insertTemplates();

export default async function getEmailTemplate(name, params) {
    const source = await EmailTemplate.findOne({ name });
    if (!source) {
        throw new Error('not found');
    }

    return {
        message: Handlebars.compile(source.message)(params),
        subject: Handlebars.compile(source.subject)(params),
    };
}
