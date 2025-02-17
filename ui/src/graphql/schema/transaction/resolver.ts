import { Context } from '@/pages/api/graphql';
import { Org, MutationCreateTransactionArgs } from '@/graphql/__generated__/graphql';
import api from '@/lib/api'

const resolvers = {
    Transaction: {
    },
    Query: {
    },
    Mutation: {
        createTransaction: async (parent: any, args: MutationCreateTransactionArgs, ctx: Context) => {
            return api.post(`/api/v1/orgs/1/transactions`, args.input) 
        }
    },
};

export default resolvers