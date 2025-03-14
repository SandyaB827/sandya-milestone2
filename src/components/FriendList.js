import React, { useState } from 'react';
import { FriendService } from '../services/FriendService';
import './FriendList.css';

const FriendList = ({ friends, setFriends }) => {
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null); // Track which friend is being edited
  const [editName, setEditName] = useState(''); // Store the edited name

  const addFriend = () => {
    if (!name) return;
    const updatedFriends = FriendService.addFriend(name);
    setFriends([...updatedFriends]);
    setName('');
  };

  const removeFriend = (id) => {
    const updatedFriends = FriendService.removeFriend(id);
    setFriends([...updatedFriends]);
  };

  const startEditing = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const saveEdit = (id) => {
    if (!editName) return;
    const updatedFriends = FriendService.editFriend(id, editName);
    setFriends([...updatedFriends]);
    setEditId(null); // Exit edit mode
    setEditName('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  return (
    <div className="friend-list">
      <h2>Friends</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Friend's name"
      />
      <button onClick={addFriend}>Add Friend</button>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            {editId === friend.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Edit name"
                />
                <button onClick={() => saveEdit(friend.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {friend.name}
                <button onClick={() => startEditing(friend.id, friend.name)}>Edit</button>
                <button onClick={() => removeFriend(friend.id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;