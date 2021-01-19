import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const modelObj = {
	name: { type: 'String', index: true, required: true, dropDups: true },
	schemaObj: { type: 'Object' },
	schemaProps: { type: 'Object' },
	preview: [{ type: 'String' }],
	images: { type: 'Object' },
}

const ModelsSchema = new Schema(modelObj, { timestamps: true, minimize: false })

ModelsSchema.plugin(mongoosePaginate)

export const Model = mongoose.model('model', ModelsSchema)