import mongoose from 'mongoose'
import initModel from '../../models/initModel'
import { Model, modelObj } from '../../models'
import { action, actionFile } from '../../dbActions'

class BaseControler {

	index(req, res) {
		const modelName = req.query.model
		const reqAction = req.query.action || 'paginate'
		let reqSelect = null
		let reqPopulate = null
		let reqLimit = null
		let reqSort = null
		req.query.sort = req.query.sort ? JSON.parse(req.query.sort) : { updatedAt: -1 }
		if (req.query.populate)
			req.query.populate = JSON.parse(req.query.populate)
		if (reqAction !== 'paginate') {
			reqSelect = req.query.select || null
			reqPopulate = req.query.populate || null
			reqLimit = req.query.limit || null
			reqSort = req.query.sort || null
			delete req.query.select
			delete req.query.populate
			delete req.query.limit
			delete req.query.sort
		}
		delete req.query.model
		delete req.query.action
		action({
			modelName: modelName,
			options: req.query,
			action: reqAction,
			select: reqSelect,
			populate: reqPopulate,
			limit: reqLimit,
			sort: reqSort,
			onSucces: (data) => res.json(data),
			onError: (err) => res.json({ err: err })
		})
	}

	list(req, res) {
		action({
			onSucces: (data) => {
				data.push({
					name: 'model',
					schemaObj: modelObj,
					preview: ['name', 'schemaObj', 'preview']
				})
				res.json(data)
			},
			onError: (err) => res.json({ err: err })
		})
	}

	create(req, res) {
		const modelName = req.query.model

		if (modelName.endsWith('.files')) {
			actionFile.create({
				req: req,
				res: res,
				onSucces: (data) => res.json({ files: data }),
				onError: (err) => res.json({ err: err })
			})

		} else {
			const Model = mongoose.model(modelName)
			const item = new Model(req.body)

			action({
				model: item,
				action: 'save',
				onSucces: (data) => {
					if (modelName === 'model')
						initModel(data)
					res.json(data)
				},
				onError: (err) => res.json({ err: err })
			})
		}
	}

	update(req, res) {
		action({
			modelName: req.query.model,
			action: 'findByIdAndUpdate',
			query: req.body._id,
			options: { $set: req.body },
			additional: { new: true, runValidators: true, context: 'query' },
			onSucces: (data) => {
				if (req.query.model === 'model')
					initModel(data)
				res.json(data)
			},
			onError: (err) => res.json({ err: err })
		})
	}

	delete(req, res) {
		const modelName = req.query.model

		if (modelName.endsWith('.files')) {
			actionFile.delete({
				id: req.query.id,
				onSucces: (data) => res.json({ files: data }),
				onError: (err) => res.json({ err: err })
			})

		} else {
			action({
				modelName: modelName,
				action: 'deleteOne',
				query: { _id: req.query.id },
				onSucces: (data) => res.json(data),
				onError: (err) => res.json({ err: err })
			})
		}
	}
}

export default BaseControler;