"use client"
import React, { useState } from 'react';
import { Payment, columns } from "@/pages/(home)/columns"
import { DataTable } from "@/pages/(home)/data-table"
import Layout from "@/pages/layout";
import { withApollo } from "@/lib/withApollo";
import { useFragment, useQuery, useSuspenseQuery } from "@apollo/client";
import { gql, useMutation } from '@apollo/client';
import { TransactionInput } from '@/graphql/__generated__/graphql';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Region } from '@/lib/regions';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    amount: z.coerce.number().min(0, {
        message: "Name must be at least 0.",
    }),
    currency: z.string().min(2, {
        message: "Must provide currency",
    }),
    salesRep: z.string().min(2, {
        message: "Must provide sales rep name",
    }),
    region: z.enum([
        Region.USA.toString(),
        Region.Europe.toString(),
        Region.Mars.toString()
    ]),
})

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`;

const Page = () => {
    const [create, { data, loading, error }] = useMutation(CREATE_TRANSACTION);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "some name",
            amount: 1,
            currency: "USD",
            salesRep: "bob",
            region: "USA",
        },
    })

    return (
        <Layout>
            <div className="container mx-auto py-10">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit((input: z.infer<typeof formSchema>) => create({ variables: { input } }))} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Customer Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salesRep"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Sales Rep</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }: { field: any }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a region" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={Region.USA.toString()}>{Region.USA}</SelectItem>
                                        <SelectItem value={Region.Europe.toString()}>{Region.Europe}</SelectItem>
                                        <SelectItem value={Region.Mars.toString()}>{Region.Mars}</SelectItem>
                                    </SelectContent>
                                </Select>

                            )}
                        />

                        <Button type="submit">
                            {
                                loading ? <p>Loading...</p> : 'Submit'
                            }
                        </Button>
                    </form>
                </Form>

                {
                    error ? <p>Error : {error.message}</p> :
                        data ? 'Saved transaction' : ''
                }
            </div>
        </Layout>
    )
};

export default withApollo({ ssr: false })(Page);





