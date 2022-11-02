import { Button, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Contact, CreateContactInput } from './useApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

interface FormProps {
  modalOpen: boolean;
  closeModal: () => void;
  actionName: 'Update' | 'Create' | null;
  contact: Contact | null;
  handleSubmit: (
    actionName: 'Update' | 'Create',
    contact: CreateContactInput,
    id?: number
  ) => void;
}

export const Form: React.FC<FormProps> = ({
  actionName,
  handleSubmit,
  modalOpen,
  closeModal,
  contact,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (contact === null) return;

    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setPhoneNumber(contact.phoneNumber);
  }, [contact]);

  const handleClick = () => {
    if (actionName === null) return;

    handleSubmit(
      actionName,
      {
        firstName,
        lastName,
        phoneNumber,
      },
      contact?.id
    );

    setFirstName('');
    setLastName('');
    setPhoneNumber('');
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    closeModal();
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ marginBottom: 1 }}
        >
          Create new contact
        </Typography>
        <TextField
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <TextField
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <TextField
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <Button disabled={!firstName || !lastName || !phoneNumber} onClick={handleClick}>
          {actionName}
        </Button>
      </Box>
    </Modal>
  );
};
