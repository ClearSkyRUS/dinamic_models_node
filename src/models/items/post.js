import mongoose, { Schema } from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const PostSchema = new Schema(
	{
        isActive: Boolean,
		img: String,
		en: {
            title: String,
            text: String,
        },
        ru: {
            title: String,
            text: String,
        },
        tags: { type : Array , "default" : [] }
	}
)

PostSchema.plugin(mongoosePaginate)

export const tableFields = ['en.title', 'ru.title', 'isActive']

const Post = mongoose.model('post', PostSchema)

export default Post