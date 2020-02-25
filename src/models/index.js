import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import initModel from './initModel'

export const modelObj = {
    name: { type: 'String', index: true, required : true, dropDups: true },
    schemaObj: { type: 'Object'},
    preview: [{ type: 'String'}]
}

const ModelsSchema = new Schema(modelObj)

ModelsSchema.plugin(mongoosePaginate)

export const Model = mongoose.model('model', ModelsSchema)

Model.find().then((Models, err) => {
    if (err)
        console.log(err)

    Models.forEach(model => initModel(model))
});