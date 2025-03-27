import React, { useEffect, useState } from 'react';
import { onAuthorized, onContext, TwitchAuth, TwitchContext, isAdmin, onPubSubMessage } from '../app/twitch';
import InputButton from '../app/components/InputButton';
import { Container, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../app/components/Header';
import DragAndDropList from '../app/components/DragAndDropList';
import { useUserManagement } from '../hooks/useUserManagement';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { users, addUser, handleDragEnd, removeUser, joinQueue, setUsers } = useUserManagement();
  const [newUserName, setNewUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    onAuthorized((auth: TwitchAuth) => {
      if (process.env.NODE_ENV === 'development') {
        setUserId('test');
      }
      else {
        setUserId(auth.userId);
      }
    });

    onContext((ctx: TwitchContext) => {
      setTheme(ctx.theme);
    });

    onPubSubMessage((message) => {
      if (message.type === 'queue_update') {
        setUsers(message.users);
      }
    });
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#bb86fc',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#6200ea',
      },
      background: {
        default: '#ffffff',
        paper: '#f5f5f5',
      },
      text: {
        primary: '#000000',
      },
    },
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isInQueue = users.some((user) => user.twitchId === userId);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <Container
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          margin: 0
        }}>
        <Paper elevation={3}
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0, // Allows child flex items to respect the container height
          }}>

          <Header theme={theme} toggleTheme={toggleTheme} />

          <DragAndDropList
            users={users}
            handleDragEnd={(event) => handleDragEnd(String(event.active.id), String(event.over?.id || ''))}
            deleteUser={removeUser}
          />

          <div style={{ marginTop: 'auto' }}>
            {!isAdmin() && (
              <InputButton
                newUserName={newUserName}
                setNewUserName={setNewUserName}
                onClick={() => isInQueue ? removeUser(userId) : joinQueue(newUserName, userId)}
                buttonText={isInQueue ? 'Leave Queue' : 'Join Queue'}
              />
            )}

            {isAdmin() && (
              <InputButton
                newUserName={newUserName}
                setNewUserName={setNewUserName}
                onClick={() => addUser(newUserName)}
                buttonText={'Add Player'}
              />
            )}
          </div>

        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
