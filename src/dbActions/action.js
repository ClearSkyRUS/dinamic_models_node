import mongoose from 'mongoose'

export default ({
    onSucces = (data) => console.log(data),
    onError = (data) => console.log(data),
    action = 'find',
    modelName = 'model',
    model,
    options,
    query,
    additional
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
    const firstArg = action === 'find' ? options : query
    const secondArg = action === 'find' ? query : options
    model[action](firstArg, secondArg, additional).then((Items, err) => {
        if (err)
            onError(err)
        onSucces(Items)
    }).catch(err => onError(err))
}