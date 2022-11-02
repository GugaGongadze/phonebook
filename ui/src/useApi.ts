import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';

const API_URL = `http://localhost:4000`;

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export function useListContacts() {
  return useQuery<Contact[]>(['contacts'], async () => {
    const { listContacts } = await request(
      API_URL,
      gql`
        query {
          listContacts {
            id
            firstName
            lastName
            phoneNumber
          }
        }
      `
    );

    return listContacts;
  });
}

async function deleteContact(id: number) {
  const { deleteContact } = await request(
    API_URL,
    gql`
      mutation DeleteContact($id: Int!) {
        deleteContact(id: $id) {
          id
        }
      }
    `,
    {
      id,
    }
  );

  return deleteContact;
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['contacts'] });

      // Snapshot the previous value
      const contacts = queryClient.getQueryData(['contacts']);

      // Optimistically update to the new value
      queryClient.setQueryData<Contact[]>(['contacts'], (contacts) => {
        if (contacts === undefined) return [];
        return contacts.filter((contact) => contact.id !== id);
      });

      // Return a context object with the snapshotted value
      return { contacts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['contacts'], context?.contacts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export type CreateContactInput = Omit<Contact, 'id'>;

async function createContact(contact: CreateContactInput) {
  const { createContact } = await request(
    API_URL,
    gql`
      mutation CreateContact($data: CreateContactInput!) {
        createContact(data: $data) {
          id
          firstName
        }
      }
    `,
    { data: contact }
  );

  return createContact;
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onMutate: async (contact: CreateContactInput) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['contacts'] });

      // Snapshot the previous value
      const contacts: Contact[] | undefined = queryClient.getQueryData(['contacts']);

      if (contacts === undefined) return { contacts: [] };

      const nextId = contacts.length === 0 ? 1 : contacts[contacts.length - 1].id + 1;

      // Optimistically update to the new value
      queryClient.setQueryData<CreateContactInput[]>(['contacts'], (contacts) => [
        ...(contacts ?? []),
        { id: nextId, ...contact },
      ]);

      // Return a context object with the snapshotted value
      return { contacts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['contacts'], context?.contacts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

async function updateContact({
  id,
  contact,
}: {
  id: number;
  contact: CreateContactInput;
}) {
  const { updateContact } = await request(
    API_URL,
    gql`
      mutation UpdateContact($data: UpdateContactInput!, $id: Int!) {
        updateContact(data: $data, id: $id) {
          id
          firstName
        }
      }
    `,
    { data: contact, id }
  );

  return updateContact;
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContact,
    onMutate: async ({ id, contact }: { id: number; contact: CreateContactInput }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['contacts'] });

      // Snapshot the previous value
      const contacts: Contact[] | undefined = queryClient.getQueryData(['contacts']);

      const updatedContactIdx = contacts?.findIndex((contact) => contact.id === id) ?? -1;

      if (updatedContactIdx === -1) return { contacts: [] };

      // Optimistically update to the new value
      queryClient.setQueryData<CreateContactInput[]>(['contacts'], (contacts) =>
        !contacts
          ? []
          : [
              ...contacts.slice(0, updatedContactIdx),
              contact,
              ...contacts.slice(updatedContactIdx + 1),
            ]
      );
      return { contacts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['contacts'], context?.contacts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
