const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
// this allows us to call our environmnt variables in our node app

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors()); // this is used for cross origin requests

app.use(express.json()); // this is used for parsing json between front and back end
app.use(express.urlencoded({ extended: false })); // this is used for parsing urlencoded data between front and back end

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

*/

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://modern-medical-pager.herokuapp.com/auth'); // If you want everyone to be able to access your api. set it to '*'
  res.status(200).send('hi');
  res.send('Hello, World!');
});

app.post('/', (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.messages.create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber
            })
            .then(() => console.log('Message sent!'))
            .catch((err) => console.log(err));
        }
      })

    return res.status(200).send("Message sent!");
  }

  return res.status(200).send("Not a message request");
});

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
