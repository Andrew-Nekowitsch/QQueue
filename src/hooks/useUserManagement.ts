import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { sendPubSubMessage } from '../app/twitch';

const broadcastQueueUpdate = (updatedUsers: User[]) => {
  sendPubSubMessage({ type: 'queue_update', users: updatedUsers });
};

export interface User {
  twitchId: string;
  name: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  const addUser = (userName: string): void => {
    if (userName.trim()) {
      const newUser: User = {
        name: userName.trim(),
        twitchId: queueIndex.toString()
      };
      setQueueIndex(queueIndex + 1);
      updateUsers([...users, newUser]);
    }
  };

  const joinQueue = (userName: string, userId: string): void => {
    if (userName.trim() && !users.some((user) => user.twitchId === userId)) {
      const newUser: User = {
        name: userName.trim(),
        twitchId: userId
      };
      updateUsers([...users, newUser]);
    }
  };

  const removeUser = (id: string): void => {
    const updatedUsers = users.filter((user) => user.twitchId !== id);
    updateUsers(updatedUsers);
  };

  const updateUsers = (updatedUsers: User[]): void => {
    setUsers(updatedUsers);
    broadcastQueueUpdate(updatedUsers);
  }

  const handleDragEnd = (activeId: string, overId: string): void => {
    if (activeId !== overId) {
      setUsers((prev) => {
        const oldIndex = prev.findIndex((user) => user.twitchId === activeId);
        const newIndex = prev.findIndex((user) => user.twitchId === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return { users, addUser, handleDragEnd, removeUser, joinQueue, setUsers };
};
