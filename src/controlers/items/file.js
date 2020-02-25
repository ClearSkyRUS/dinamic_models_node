import mongoose from 'mongoose'
import { actionFile } from '../../dbActions'

class FilesControler {
    get(req, res) {
        actionFile.get({
            query: req.query,
            onError: (err) => res.json({ err: err }),
            onSucces: (data) => data.pipe(res)
        })
    }
}

export default FilesControler;