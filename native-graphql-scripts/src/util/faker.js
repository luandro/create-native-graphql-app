import faker from 'graphql-faker-programmatic';
// import faker from '../../../graphql-faker-programmatic/dist';
import fs from 'fs';
import pathExists from 'path-exists';

const endpointUrl = 'https://api.graph.cool/simple/v1/';

export default async function() {
  const projectId = await getProjectId();
  if (projectId) {
    console.log('FOUND PROJECT!', projectId);
    const finalEndpoint = `${endpointUrl}${projectId}`;
    // run faker extending
    faker(`./graphql/project.faker.graphql --extend ${finalEndpoint} --open`);
  } else {
    //run faker from project.faker.graphql
    faker('./graphql/project.faker.graphql');
  }
};

async function getProjectId() {
  return pathExists('graphql/graphcool.project').then(exists => {
    if (exists) {
      fs.readFile('graphql/graphcool.project', (err, data) => {
        if (err) throw err;
        return data.split(':', 2)[1].split(' ')[1].split(/[\r\n\t]+/gm)[0];
      });
    } else {
      return false;
    }
  });
}
