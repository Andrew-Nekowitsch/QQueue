import React from 'react';
import { DndContext, closestCenter, DragEndEvent, useSensors, MouseSensor, useSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { User } from '../../hooks/useUserManagement';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

export interface DragAndDropListProps {
  users: User[];
  handleDragEnd: (event: DragEndEvent) => void;
  deleteUser: (id: string) => void;
}

const DragAndDropList: React.FC<DragAndDropListProps> = ({ users, handleDragEnd, deleteUser }) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    mouseSensor,
    touchSensor
  );

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]} sensors={sensors}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <SortableContext items={users.map((user) => user.twitchId)} strategy={verticalListSortingStrategy}>
          {users.map((user) => (
            <SortableItem key={user.twitchId} id={user.twitchId} name={user.name} deleteUser={deleteUser} canDelete />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default DragAndDropList;