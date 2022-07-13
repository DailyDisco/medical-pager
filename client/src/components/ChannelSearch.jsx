import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import { ResultsDropdown } from "./";

//icons
import { SearchIcon } from "../assets";

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] },
      });
      // query the users
      const userResponse = client.queryUsers({
        // don't include the current user
        id: { $ne: client.userID },
        // include the user if they have the same name as the query
        name: { $autocomplete: text },
      });

      // starts both requests at the same time making it quicker
      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
    } catch (error) {
      setQuery("");
    }
  };

  const onSearch = (event) => {
    event.preventDefault();
    // this keeps the page from refreshing

    setLoading(true);

    setQuery(event.target.value);
    // this sets the query to the value of the input

    getChannels(event.target.value);
    // this returns all the channels that match the query
  };

  const setChannel = (channel) => {
    setQuery("");
    setActiveChannel(channel);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          className="channel-search__input__text"
          placeholder="Search"
          type="text"
          value={query}
          onChange={onSearch}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
};

export default ChannelSearch;
