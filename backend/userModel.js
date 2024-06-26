const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required:true,
            unique: true
        },
        firebase_id: {
            type: String
        },
        profile_photo: {
            type: String
        }
    },
    {
        versionKey: false
    }
)

const ModelUser = mongoose.model("users", userSchema);

const travelSchema = new mongoose.Schema(
    {
        _user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        country: {
            type: String,
            required: true
        },
        country_cod: {
            type: String,
            required: true
        },
        city: {
            type: String
        },
        description: {
            type: String,
            required: true
        },
        suggestions: [
            {
                location: {
                    type: String,
                    
                },
                description: {
                    type: String,
                    
                }
            }
        ],
        restaurant_recomendations: {
            type: [String]
        },
        init_date: {
            type: Date
        },
        finish_date: {
            type: Date
        }
    },
    {
        versionKey: false
    }
);
const ModelTravel = mongoose.model("travels",travelSchema)

const checklistSchema = new mongoose.Schema(
    {
        _checklist_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'travels',
            required: true
        },
        elements: [
            {
                element: {
                    type: String,
                    required: true
                },
                checked: {
                    type: Boolean,
                    required: true
                }
            }
        ]
    },
    {
        versionKey: false
    }
);

const ModelChecklist = mongoose.model("checklists",checklistSchema)
module.exports = {
    ModelUser,
    ModelTravel,
    ModelChecklist
}