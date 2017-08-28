import graphcool from 'graphcool-programmatic';

export default async function() {
    graphcool('init', {
        outputPath: 'graphql/project.graphql',
    });
}