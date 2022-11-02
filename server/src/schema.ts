import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  inputObjectType,
  arg,
} from 'nexus'
import { Context } from './context'

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('listContacts', {
      type: 'Contact',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.contact.findMany()
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('createContact', {
      type: 'Contact',
      args: {
        data: nonNull(
          arg({
            type: 'CreateContactInput',
          }),
        ),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.contact.create({
          data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            phoneNumber: args.data.phoneNumber,
          },
        })
      },
    })

    t.nonNull.field('updateContact', {
      type: 'Contact',
      args: {
        id: nonNull(intArg()),
        data: nonNull(
          arg({
            type: 'UpdateContactInput',
          }),
        ),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.contact.update({
          where: { id: args.id },
          data: {
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            phoneNumber: args.data.phoneNumber,
          },
        })
      },
    })

    t.field('deleteContact', {
      type: 'Contact',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.contact.delete({
          where: { id: args.id },
        })
      },
    })
  },
})

const Contact = objectType({
  name: 'Contact',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('phoneNumber')
  },
})

const CreateContactInput = inputObjectType({
  name: 'CreateContactInput',
  definition(t) {
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('phoneNumber')
  },
})

const UpdateContactInput = inputObjectType({
  name: 'UpdateContactInput',
  definition(t) {
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('phoneNumber')
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Contact, CreateContactInput, UpdateContactInput],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
