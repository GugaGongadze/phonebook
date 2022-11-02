import { Container, CssBaseline, Stack, Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactsIcon from '@mui/icons-material/Contacts';

import Contacts from './Contacts';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <ContactsIcon fontSize="large" />
          <Typography variant="h3" gutterBottom>
            Phone Book App
          </Typography>
        </Stack>
        <Contacts />
      </Container>
    </QueryClientProvider>
  );
}

export default App;
