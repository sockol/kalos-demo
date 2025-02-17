import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    if (typeof value == "string") {
      return new Date(value).getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error('GraphQL DateTime Scalar serializer expected a `DateTime` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    if (typeof value === 'string') {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

const resolvers = {
    DateTime: dateScalar    
};

export default resolvers