import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FriendService } from '../services/FriendService';
import './FriendList.css';

const FriendList = ({ friends, setFriends }) => {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  // Validation schema for adding a friend
  const addFriendSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('Please enter a friend\'s name')
      .test('unique', 'This name is already taken', value => 
        !friends.some(f => f.name.toLowerCase() === value?.toLowerCase())
      )
  });

  // Validation schema for editing a friend
  const editFriendSchema = Yup.object({
    editName: Yup.string()
      .trim()
      .required('Please enter a friend\'s name')
      .test('unique', 'This name is already taken', value => 
        !friends.some(f => f.name.toLowerCase() === value?.toLowerCase() && f.id !== editId)
      )
  });

  const addFriend = (values, { resetForm }) => {
    const updatedFriends = FriendService.addFriend(values.name.trim());
    setFriends([...updatedFriends]);
    resetForm();
  };

  const removeFriend = (id) => {
    const updatedFriends = FriendService.removeFriend(id);
    setFriends([...updatedFriends]);
  };

  const startEditing = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const saveEdit = (values) => {
    const updatedFriends = FriendService.editFriend(editId, values.editName.trim());
    setFriends([...updatedFriends]);
    setEditId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Friends</h2>

        {/* Add Friend Form */}
        <Formik
          initialValues={{ name: '' }}
          validationSchema={addFriendSchema}
          onSubmit={addFriend}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="input-group mb-3">
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Friend's name"
                />
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Add Friend
                </button>
              </div>
              <ErrorMessage name="name" component="div" className="text-danger small mb-2" />
            </Form>
          )}
        </Formik>

        {/* Friend List */}
        <ul className="list-group">
          {friends.map(friend => (
            <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center">
              {editId === friend.id ? (
                <Formik
                  initialValues={{ editName }}
                  validationSchema={editFriendSchema}
                  onSubmit={saveEdit}
                >
                  {({ isSubmitting }) => (
                    <Form className="d-flex w-100">
                      <Field
                        type="text"
                        name="editName"
                        className="form-control me-2"
                        placeholder="Edit name"
                      />
                      <button type="submit" className="btn btn-success btn-sm me-2" disabled={isSubmitting}>
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <ErrorMessage name="editName" component="div" className="text-danger small w-100 mt-1" />
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  {friend.name}
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEditing(friend.id, friend.name)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;