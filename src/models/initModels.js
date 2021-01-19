import { Model } from './'
import initModel from './initModel'

const initModels = async () => {
	return Model.find({}, (err, models) => {
		models.forEach(model => initModel(model))
	})
}

export default initModels