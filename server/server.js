const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage (replace with a proper database in production)
let messages = [];

// GET endpoint to fetch messages
app.get('/api/messages', (req, res) => {
    try {
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST endpoint to save messages
app.post('/api/messages', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            throw new Error('Missing required fields');
        }
        
        // Store the message
        const newMessage = {
            id: Date.now(),
            name,
            email,
            message,
            timestamp: new Date()
        };
        
        messages.push(newMessage);
        
        res.json({ 
            success: true, 
            message: 'Message saved successfully',
            data: newMessage
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
