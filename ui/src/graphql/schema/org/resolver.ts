import { Context } from '@/pages/api/graphql';
import { Org } from '@/graphql/__generated__/graphql';
import api from '@/lib/api'

const resolvers = {
    Org: {
        transactions: async (parent: Org, args: any, ctx: Context) => { 
            return api.get(`/api/v1/orgs/1/transactions`)   
        },
        stats: async (parent: Org, args: any, ctx: Context) => { 
            return api.get(`/api/v1/orgs/1/stats`)   
        },
    },
    Query: {
        org: async (parent: any, args: any, ctx: Context) => {
            // NOTE: yes, hardcoding this.
            return { id: 1 }
        },
    },
};

export default resolvers