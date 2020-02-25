import mongoose, { Schema } from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const LinkSchema = new Schema(
	{
		href: String,
		text: { type: 'ObjectId', ref: 'string' }
	}
)

LinkSchema.plugin(mongoosePaginate)
const Link = mongoose.model('link', LinkSchema)

export default Link