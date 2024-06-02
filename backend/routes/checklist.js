var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const middleware = require('../middleware');
const {ModelUser,ModelTravel, ModelChecklist} = require('../userModel');
const admin = require('../firebaseConfig'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.get('/:checklistId', middleware.decodeToken, async (req, res) => {
    const checklistId = req.params.checklistId;

    try {
        const checklist = await ModelChecklist.findOne({ _checklist_id: checklistId });

        if (!checklist) {
            return res.status(404).json({ message: "There is not a checklist" });
        }

        res.json(checklist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in obtaining the checklist." });
    }
});

router.post('/:checklistId',middleware.decodeToken, async (req, res) => {
    const { element } = req.body;
    const checklistId = req.params.checklistId;

    if (!element) {
        return res.status(400).json({ message: "The element is not specified in the body of the request." });
    }

    try {
        const checklist = await ModelChecklist.findOneAndUpdate({ _checklist_id: checklistId }, {
            $push: {
                elements: { element: element, checked: false }
            }
        }, { new: true });

        if (!checklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }

        res.json(checklist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to the checklist." });
    }
});
router.delete('/:checklistId/:elementId',middleware.decodeToken, async (req, res) => {
    const { checklistId, elementId } = req.params;

    try {
        const checklist = await ModelChecklist.findOneAndUpdate({ _checklist_id: checklistId }, {
            $pull: {
                elements: { _id: elementId }
            }
        }, { new: true });

        res.json(checklist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting item from the checklist." });
    }
});

router.patch('/:checklistId/:elementId',middleware.decodeToken, async (req, res) => {
    const { checklistId, elementId } = req.params;
    const { checked } = req.body;

    try {
        const checklist = await ModelChecklist.findOneAndUpdate(
            { _checklist_id: checklistId, "elements._id": elementId },
            { $set: { "elements.$.checked": checked } },
            { new: true }
        );

        res.json(checklist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error marking item in checklist" });
    }
});


module.exports = router;