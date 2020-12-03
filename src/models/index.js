import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import initModel from './initModel'

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

Model.find().then((Models, err) => {
	if (err)
		console.log(err)

	Models.forEach(model => initModel(model))
});