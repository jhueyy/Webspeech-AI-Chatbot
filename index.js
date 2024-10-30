require('dotenv').config(); // Load environment variables
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const app = express();
const io = require('socket.io');

// Initialize Dialogflow client
const sessionClient = new dialogflow.SessionsClient();
const projectId = process.env.GCLOUD_PROJECT_ID;

// Serve static files
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

// Start the server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    'Server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
});

// Initialize WebSocket
io(server).on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (text) => {
    console.log('Message:', text);
    const sessionId = uuid.v4();
    // PROBLEM: 
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    console.log("Session Path: ", sessionPath);
    try {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: text,
            languageCode: 'en-US',
          },
        },
      };

      const [response] = await sessionClient.detectIntent(request);
      const aiText = response.queryResult.fulfillmentText || '(No response)';

      console.log('Bot reply:', aiText);
      socket.emit('bot reply', aiText);
    } catch (error) {
      console.error('ERROR:', error);
      socket.emit('bot reply', 'There was an error processing your message.');
    }
  });
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/views' });
});
