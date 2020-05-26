class FriendList {
  friends: string[] = []

  addFriend(name: string) {
    this.friends.push(name);
    this.announceFriendshipt(name);
  }

  announceFriendshipt(name: string) {
    console.log(`${name} is a friend!`);
  }

  removeFriend(name: string) {
    if (!this.friends.includes(name)) {
      throw new Error('Friend not found');
    }
    this.friends = this.friends.filter(f => f !== name);
  }
} 

describe('FriendList', () => {
  let friendList: FriendList;

  beforeEach(() => {
    friendList = new FriendList();
  });

  it('initializes friends list', () => {
    expect(friendList.friends.length).toEqual(0);
  });
  
  it('adds a friend to the list', () => {
    friendList.addFriend('Mark');
    expect(friendList.friends.length).toEqual(1);
  });
  
  it('announces friendshipt', () => {
    friendList.announceFriendshipt = jest.fn();
    expect(friendList.announceFriendshipt).toHaveBeenCalledTimes(0);

    friendList.addFriend('Mark');
    expect(friendList.announceFriendshipt).toHaveBeenCalledTimes(1);
    expect(friendList.announceFriendshipt).toHaveBeenCalledWith('Mark');
  });

  describe('removeFriend', () => {
    it('removes a friend', () => {
      friendList.addFriend('Mark');
      friendList.addFriend('Ariel');
      expect(friendList.friends.length).toEqual(2);
  
      friendList.removeFriend('Mark');
      expect(friendList.friends.length).toEqual(1);
    });

    it('throws error when not a friend', () => {
      friendList.addFriend('Mark');
      expect(() => friendList.removeFriend('Bob')).toThrow();
      expect(() => friendList.removeFriend('Bob')).toThrow(Error);
      expect(() => friendList.removeFriend('Bob')).toThrow(new Error('Friend not found'));
    });
  });
});