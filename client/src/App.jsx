import React, { useState } from 'react';
// used with rafce to create a component
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';
// we can import from another file that has all the required components
// so that we may keep our code clean and readable

import 'stream-chat-react/dist/css/index.css';
import './App.css';

// this imports our css file

const cookies = new Cookies();

const apiKey = 'ewaedjgsq8hd';
// this key is used to connect StreamChat

const authToken = cookies.get('token');

const client = StreamChat.getInstance(apiKey);

// this connects our user and gives us all of their messages
if (authToken) {
  client.connectUser(
    {
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      image: cookies.get('avatarURL'),
      hashedPassword: cookies.get('hashedPassword'),
      phoneNumber: cookies.get('phoneNumber'),
    },
    authToken
  );
}

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!authToken) return <Auth />;

  return (
    <div className='app__wrapper'>
      <Chat client={client} theme='team light'>
        <ChannelListContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
        <ChannelContainer
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  );
};

export default App;

// we are going to use the bum css methology to style our app
// b stands for block, u stands for underscores, and m stands for modifiers
