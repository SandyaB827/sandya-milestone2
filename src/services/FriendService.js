export const FriendService = {
    friends: JSON.parse(sessionStorage.getItem('friends')) || [],
  
    addFriend(name) {
      const id = Date.now();
      this.friends.push({ id, name });
      sessionStorage.setItem('friends', JSON.stringify(this.friends));
      return this.friends;
    },
  
    editFriend(id, name) {
      const friend = this.friends.find(f => f.id === id);
      if (friend) friend.name = name;
      sessionStorage.setItem('friends', JSON.stringify(this.friends));
      return this.friends;
    },
  
    removeFriend(id) {
      this.friends = this.friends.filter(f => f.id !== id);
      sessionStorage.setItem('friends', JSON.stringify(this.friends));
      return this.friends;
    },
  
    getFriends() {
      return this.friends;
    }
  };