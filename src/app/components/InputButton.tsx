import React, { KeyboardEvent } from 'react';
import { Button, TextField } from '@mui/material';

interface InputButtonProps {
  newUserName: string;
  setNewUserName: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => void;
  buttonText: string;
}

const InputButton: React.FC<InputButtonProps> = ({ newUserName, setNewUserName, onClick: onClickCallback, buttonText }) => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onClickCallback();
    }
  };

  return (
    <div>
      <TextField
        label="Username"
        placeholder=""
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginTop: 2 }}
        slotProps={{ htmlInput: { maxLength: 20 } }}
        onKeyDown={handleKeyDown}
      />
      <Button variant="contained" color="primary" onClick={onClickCallback} sx={{ marginTop: '10px' }} fullWidth>
        {buttonText}
      </Button>
    </div>
  );
};

export default InputButton;