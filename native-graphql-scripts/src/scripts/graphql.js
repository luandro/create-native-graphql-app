// import graphcool from 'graphcool-programmatic';
import graphcool from '../../../graphcool-programmatic/dist/src';


export default async function(action) {
    switch (action) {
        case 'checkAuth':
            break
        case 'auth':
            graphcool('auth');
            break
    }
}