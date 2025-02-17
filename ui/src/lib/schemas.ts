import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const types = loadFilesSync('**/*.graphql');
const typeDefs = mergeTypeDefs(types, { throwOnConflict: true, sort: false });

export default typeDefs;