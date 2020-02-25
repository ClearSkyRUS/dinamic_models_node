import fs from 'fs';

const getFiles = (paths) => {
    return {
        key: fs.readFileSync(paths.key),
        cert: fs.readFileSync(paths.cert)
    }
}

export default getFiles