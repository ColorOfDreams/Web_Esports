const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Event = require('../models/Event');

async function fixMatchIds() {
    const events = await Event.find({});
    let fixedCount = 0;

    for (const event of events) {
        if (typeof event._id === 'string') {
            const newId = new ObjectId();

            const clone = new Event({
                ...event.toObject(),
                _id: newId,
            });

            await clone.save();
            await Event.deleteOne({ _id: event._id });
            fixedCount++;
        }
    }

    return fixedCount;
}

module.exports = fixMatchIds;
