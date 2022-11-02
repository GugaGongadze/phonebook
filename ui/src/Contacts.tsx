import { Box, Button, Stack, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo, useState } from 'react';
import { ContactItem } from './Contact';
import { Form } from './Form';
import {
  useListContacts,
  useCreateContact,
  useUpdateContact,
  CreateContactInput,
  Contact,
} from './useApi';

function Contacts() {
  const { status, data: contacts, isFetching } = useListContacts();
  const { mutate: createContact } = useCreateContact();
  const { mutate: updateContact } = useUpdateContact();
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [actionName, setActionName] = useState<'Update' | 'Create' | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);

  const filteredContacts = useMemo(() => {
    if (contacts === undefined) return [];

    return contacts.filter((contact) =>
      contact.lastName.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const handleCreateContact = async (contact: CreateContactInput) => {
    createContact(contact);
  };

  const handleUpdateContact = async (id: number, contact: CreateContactInput) => {
    updateContact({
      id,
      contact,
    });
  };

  const handleOpenCreateForm = () => {
    setModalOpen(true);
    setActionName('Create');
  };

  const handleOpenUpdateForm = (contact: Contact) => {
    setModalOpen(true);
    setContact(contact);
    setActionName('Update');
  };

  const handleSubmit = (
    actionName: 'Update' | 'Create',
    contact: CreateContactInput,
    id?: number
  ) => {
    if (actionName === 'Create') {
      handleCreateContact(contact);
    } else {
      handleUpdateContact(id!, contact);
    }

    setModalOpen(false);
  };

  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <h1>Contacts</h1>

          <Button variant="outlined" onClick={handleOpenCreateForm}>
            + Add Contact
          </Button>
        </Stack>

        <TextField
          size="small"
          placeholder="Search for contact by last name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: '100%' }}
        />

        <Box>
          {status === 'loading' ? (
            'Loading...'
          ) : status === 'error' ? (
            <span>Error fetching contacts</span>
          ) : (
            <>
              <Stack
                sx={{ marginTop: 2, border: `1px solid ${grey[400]}`, borderRadius: 1 }}
              >
                {filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    handleOpenUpdateForm={handleOpenUpdateForm}
                  />
                ))}
              </Stack>
              <div>{isFetching ? 'Background Updating...' : ' '}</div>
            </>
          )}
        </Box>
      </Box>

      <Form
        actionName={actionName}
        handleSubmit={handleSubmit}
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        contact={contact}
      />
    </>
  );
}

export default Contacts;
