import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface SortableItemProps {
  id: string;
  name: string;
  deleteUser: (id: string) => void;
  canDelete: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, name, deleteUser, canDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const boxStyles: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    marginBottom: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  };

  return (
    <Paper ref={setNodeRef} style={boxStyles} {...attributes} {...listeners}>
      <span>{name}</span>
      {canDelete && (
        <IconButton onMouseUp={() => deleteUser(id)} color="primary"
          disabled={isDragging}>
          <DeleteIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SortableItem;