import { buildSchema } from "https://cdn.pika.dev/graphql/^15.0.0";

const schema = buildSchema(`
    schema {
        query: Query
        mutation: Mutation
    }

    type Query {
        getTotal: Float
        getEntries: [Entry]
    }

    type Mutation {
        addEntry(input:TestInput): Entry
        deleteEntry(id: String) : Entry
    }

    input TestInput {
        amount: Float
        type: String
    }

    type Entry {
        id: String
        amount: Float
        type: String
    }
`);

export default schema;
