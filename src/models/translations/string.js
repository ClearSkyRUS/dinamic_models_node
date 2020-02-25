import mongoose, { Schema } from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const StringSchema = new Schema(
	{
		ref: { type: 'String' },
		en: { type: 'String' },
		ru: { type: 'String' }
	}
)

StringSchema.plugin(mongoosePaginate)
const mString = mongoose.model('string', StringSchema)

export default mString