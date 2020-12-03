import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import uniqueValidator from 'mongoose-unique-validator'

const initModel = model => {
	if (mongoose.connection.models[model.name]) {
		delete mongoose.connection.models[model.name]
	}
	const mSchema = new Schema(model.schemaObj, { timestamps: true, ...model.schemaProps })
	mSchema.plugin(mongoosePaginate)
	mSchema.plugin(uniqueValidator)
	mongoose.model(model.name, mSchema)
}

export default initModel