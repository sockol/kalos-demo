import { Payment, columns } from "@/pages/(home)/columns"
import { DataTable } from "@/pages/(home)/data-table"
import { trpc } from '@/utils/trpc';
import Layout from "./layout";
import { gql } from "@apollo/client";
import { withApollo } from "@/lib/withApollo";
import { useFragment, useQuery, useSuspenseQuery } from "@apollo/client";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const POLL_INTERVAL_SECONDS = 1

const QUERY = gql`
  query GetAccounts {
    org {
      transactions {
        id
        name
        amount
        currency
        amountInUsd
        salesRep
        region
        createdAt
      }
      stats {
        totalRevenue
        highestPerformingSalesRep
        highestSellingRegion
      }
    }
  }
`


function Page() {
  const { data, error, loading, startPolling } = useQuery(QUERY)
  startPolling(1000 * POLL_INTERVAL_SECONDS)

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {
          error ? "error" :
            loading ? 'loading...' :
              <>
                <DataTable columns={columns} data={data.org.transactions} />

                <h4 className="text-sm font-medium leading-none">Global Stats</h4>

                <Card className="w-[350px]">
                  <CardContent>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">Total Revenue</h4>
                      <p className="text-sm text-muted-foreground">
                        {data.org.stats.totalRevenue}$
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">Highest Performing Sales Rep</h4>
                      <p className="text-sm text-muted-foreground">
                        {data.org.stats.highestPerformingSalesRep}
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">Highest Selling Region</h4>
                      <p className="text-sm text-muted-foreground">
                        {data.org.stats.highestSellingRegion}
                      </p>
                    </div>
                  </CardContent>
                </Card>

              </>
        }
      </div>
    </Layout>
  )
}
// export default trpc.withTRPC(Page);
export default withApollo({ ssr: true })(Page);
