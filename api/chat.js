
const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const auth = require('./middleware/auth');

// GET all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const currentUser = req.member;

        const messages = await Message.find({
            familyId: currentUser.familyId,
            $or: [
                { senderId: currentUser.id },
                { receiverId: currentUser.id }
            ]
        }).sort({ timestamp: 'asc' });
        
        res.json(messages);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new message
router.post('/', auth, async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        if (!receiverId || !text) {
            return res.status(400).json({ message: 'Receiver and text are required.' });
        }

        const message = new Message({
            familyId: req.member.familyId,
            senderId: req.member.id,
            receiverId,
            text
        });
        await message.save();
        res.status(201).json(message);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST mark messages as read
router.post('/mark-as-read', auth, async (req, res) => {
    try {
        const { partnerId } = req.body;
        if (!partnerId) {
            return res.status(400).json({ message: 'Partner ID is required.' });
        }
        await Message.updateMany(
            { 
                familyId: req.member.familyId,
                receiverId: req.member.id, 
                senderId: partnerId,
                isRead: false
            },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Messages marked as read' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
