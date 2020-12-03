import mongoose from 'mongoose'
import initModel from '../../models/initModel'
import { action, actionFile } from '../../dbActions'

const LANGS_HOLDER = '${langs}'
const LANG_HOLDER = '${lang}'
class BaseControler {

	index(req, res) {
		const modelName = req.query.model
		const imageName = req.query.image
		const requestLang = req.query.forlang
		delete req.query.model
		delete req.query.image
		delete req.query.forlang
		action({
			action: 'findOne',
			options: { name: modelName },
			select: 'images',
			onSucces: model => parseImage(model.images[imageName]),
			onError: err => res.json({ err: err })
		})
		const parseImage = (image, defaults = false) => {
			if (!image) {
				if (defaults) return res.json({ err: 'no image found', image: image })
				return action({
					modelName: 'defaultImage',
					action: 'findOne',
					options: { name: imageName },
					select: 'params',
					onSucces: item => parseImage(item ? item.params : item, true),
					onError: err => res.json({ err: err })
				})
			}

			const sort = req.query.sort
				? JSON.parse(req.query.sort)
				: image.sort || { updatedAt: -1 }
			const limit = req.query.limit || image.limit || 10

			delete req.query.sort
			delete req.query.limit
			delete req.query.action

			const options = {
				...(image.query 
					? image.query
					: {}),
				...(req.query 
					? req.query
					: {})
			}
			const method = image.action || 'paginate'
			let select = image.select
			const populate = image.populate
			const drop = image.drop

			if (requestLang && ((select && select.includes(LANG_HOLDER)) || checkObjectForHolder(populate, LANG_HOLDER) || checkObjectForHolder(drop, LANG_HOLDER))) {
				select = select ? select.replace(LANG_HOLDER, requestLang) : select
				replaceAllInObject(populate, requestLang, LANG_HOLDER)
				replaceAllInObject(drop, requestLang, LANG_HOLDER)
			}
			if ((select && select.includes(LANGS_HOLDER)) || checkObjectForHolder(populate, LANGS_HOLDER) || checkObjectForHolder(drop, LANGS_HOLDER)) {
				getLangsAndContinue([method, options, select, populate, limit, sort, drop], setLangsAndGetData)
				return
			}

			getData(method, options, { select, populate, limit, sort }, drop)
		}
		const checkObjectForHolder = (object, HOLDER) => {
			if (!object) return false
			for (const key in object) {
				const value = object[key]
				if (typeof value === 'string' && value.includes(HOLDER) ||
					typeof value === 'object' && checkObjectForHolder(value, HOLDER)) return true
			}
			return false
		}
		const getLangsAndContinue = (params, callback) => {
			action({
				modelName: 'lang',
				action: 'find',
				options: { isActive: true },
				select: 'sign',
				onSucces: langs => callback(...params, langs),
				onError: err => res.json({ err: err })
			})
		}
		const setLangsAndGetData = (method, options, select, populate, limit, sort, drop, langs) => {
			langs = langs.map(lang => lang.sign).join(' ')
			select = select ? select.replace(LANGS_HOLDER, langs) : select
			replaceAllInObject(populate, langs, LANGS_HOLDER)
			replaceAllInObject(drop, langs, LANGS_HOLDER)
			getData(method, options, { select, populate, limit, sort }, drop)
		}
		const replaceAllInObject = (object, replacer, HOLDER) => {
			if (!object) return object
			for (const key in object) {
				const value = object[key]
				if (typeof value === 'string') {
					const pieces = value.split(' ').filter(str => str.includes(HOLDER))
					pieces.forEach(piece => {
						let result = ''
						replacer.split(' ').forEach(str => {
							if (result !== '') result += ' '
							result += piece.replace(HOLDER, str)
						})
						object[key] = value.replace(piece, result)
					})
					continue
				}
				if (typeof value === 'object') replaceAllInObject(value, replacer, HOLDER)
			}
		}
		const getData = (method, options, params, drop) => {
			params = {
				options: {
					...options,
					...(method === 'paginate' ? params : {}),
				},
				...(method !== 'paginate' ? params : {}),
			}

			action({
				modelName: modelName,
				action: method,
				...params,
				onSucces: data => modifyAndSendData(data, method, drop),
				onError: err => res.json({ err: err })
			})
		}
		const modifyAndSendData = (data, method, drop) => {
			if (drop) {
				drop.forEach(obj => {
					const toDrop = obj.toDrop.split(' ')
					const keys = obj.keys.split(' ')
					toDrop.forEach(key =>
						dropKeys(
							Array.isArray(data)
								? data
								: (method === 'paginate' ? data.docs : [data]),
							key,
							keys
						)
					)
				})
			}
			res.json(data)
		}
		const dropKeys = (arr, toDrop, arrKeys) => {
			const dropKeys = toDrop.split('.')
			const lastKey = dropKeys.pop();
			for (const obj of arr) {
				if (!obj) continue
				arrKeysFor: for (const key of arrKeys) {
					let setObj = obj
					for (const objKey of dropKeys) {
						setObj = setObj[objKey]
						if (!setObj) continue arrKeysFor
					}
					setObj[lastKey] = setObj[lastKey] ? setObj[lastKey][key] : null
				}
			}
			return arr
		}
	}

	list(req, res) {
		action({
			onSucces: data => res.json(data),
			onError: err => res.json({ err: err })
		})
	}

	create(req, res) {
		const modelName = req.query.model

		if (modelName.endsWith('.files')) {
			actionFile.create({
				req: req,
				res: res,
				onSucces: data => res.json({ files: data }),
				onError: err => res.json({ err: err })
			})

		} else {
			const Model = mongoose.model(modelName)
			const item = new Model(req.body)

			action({
				model: item,
				action: 'save',
				onSucces: data => {
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
			onSucces: data => {
				if (req.query.model === 'model')
					initModel(data)
				res.json(data)
			},
			onError: err => res.json({ err: err })
		})
	}

	delete(req, res) {
		const modelName = req.query.model

		if (modelName.endsWith('.files')) {
			actionFile.delete({
				id: req.query.id,
				onSucces: data => res.json({ files: data }),
				onError: err => res.json({ err: err })
			})

		} else {
			action({
				modelName: modelName,
				action: 'deleteOne',
				query: { _id: req.query.id },
				onSucces: data => res.json(data),
				onError: err => res.json({ err: err })
			})
		}
	}
}

export default BaseControler;