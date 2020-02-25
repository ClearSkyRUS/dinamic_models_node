import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const initModel = model => {
    if (mongoose.connection.models[model.name]) {
        delete mongoose.connection.models[model.name]
    }
    const mSchema = new Schema(model.schemaObj)
    mSchema.plugin(mongoosePaginate)
    mongoose.model(model.name, mSchema)
}

export default initModel