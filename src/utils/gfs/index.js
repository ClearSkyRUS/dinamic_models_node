
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'
import mongoose from 'mongoose'

export let gfs
export let upload

export const initGfs = bucketName => {
	gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
		bucketName: bucketName
	})

	const storage = new GridFsStorage({
		db: mongoose.connection.db,
		file: (req, file) => ({
			bucketName: bucketName,
			disableMD5: true,
			filename: file.originalname
		}),
		cache: bucketName
	})

	upload = multer({ storage }).array('files')
}