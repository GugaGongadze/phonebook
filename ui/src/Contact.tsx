import { IconButton, Stack, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import { Contact, useDeleteContact } from './useApi';
import { grey, red } from '@mui/material/colors';

interface ContactItemProps {
  contact: Contact;
  handleOpenUpdateForm: (contact: Contact) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  handleOpenUpdateForm,
}) => {
  const { id, firstName, lastName, phoneNumber } = contact;

  const { mutate: deleteContact } = useDeleteContact();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: `0.5px solid ${grey[400]}`,
          padding: 2,
          cursor: 'pointer',
        }}
        onClick={() => handleOpenUpdateForm(contact)}
      >
        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {firstName} {lastName}
          </Typography>
          <Stack direction="row" sx={{ color: grey[400] }} alignItems="center" gap={1}>
            <PhoneIcon fontSize="small" />
            <Typography>{phoneNumber}</Typography>
          </Stack>
        </Stack>

        <IconButton
          aria-label="delete"
          sx={{ width: 40, height: 40 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteContact(id);
          }}
        >
          <DeleteIcon sx={{ color: red[400] }} />
        </IconButton>
      </Stack>
    </>
  );
};
