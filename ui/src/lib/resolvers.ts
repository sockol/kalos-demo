import core from '@/graphql/schema/core/resolver'
import org from '@/graphql/schema/org/resolver'
import transaction from '@/graphql/schema/transaction/resolver'
import stats from '@/graphql/schema/stats/resolver'

const resolvers = [
    core,
    org,
    transaction,
    stats,
]

export default resolvers