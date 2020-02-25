import mongoose, { Schema } from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const MenuSchema = new Schema(
	{
		name: String,
		links: [{ type: Schema.Types.ObjectId, ref: 'link' }]
	}
)

MenuSchema.plugin(mongoosePaginate)
const Menu = mongoose.model('menu', MenuSchema)

export default Menu