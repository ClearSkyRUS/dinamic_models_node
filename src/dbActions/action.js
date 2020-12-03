import mongoose from 'mongoose'

export default ({
	onSucces = data => console.log(data),
	onError = data => console.log(data),
	action = 'find',
	modelName = 'model',
	model,
	options,
	query,
	additional,
	select,
	populate,
	limit,
	sort
}) => {
	if (!model && !modelName)
		return onError('no model defined')
	else if (!model)
		model = mongoose.model(modelName)

	if (options && options.search) {
		query = {}
		const tree = model.schema.tree
		const keysArr = Object.keys(tree).filter(key => {
			return tree[key].type && tree[key].type === 'String'
		})
		if (keysArr.length) {
			if (!query.$or)
				query.$or = []
			let regex = new RegExp(options.search, 'i')
			for (let key of keysArr)
				query.$or.push({ [key]: regex })
		}
	}
	const paginateAction = action === 'paginate'
	const findAction = action === 'find' || action === 'findOne' || action === 'findById'
	const additionalOptions = paginateAction ? { lean: true, leanWithId: false } : {}
	const firstArg = findAction ? options : query
	const secondArg = findAction 
		? query 
		: (Object.keys({ ...options, ...additionalOptions }).length ? { ...options, ...additionalOptions } : undefined)

	let exec = model[action](firstArg, secondArg, additional)

	if (findAction)
		exec = exec.lean()

	if (select)
		exec = exec.select(select)

	if (populate) {
		if (Array.isArray(populate)) {
			populate.forEach(element => {
				exec = exec.populate(element)
			})
		} else {
			exec = exec.populate(populate)
		}
	}

	if (limit)
		exec = exec.limit(parseInt(limit))
	if (sort)
		exec = exec.sort(sort)

	exec.then((items, err) => {
		if (err)
			onError(`Exec error: ${err}`)

		onSucces(items)
	}).catch(err => onError(`Exec catch: ${err}`))
}