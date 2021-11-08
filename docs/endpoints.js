
module.exports = function (app) {
    app.post('/client/register', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'client haqida api'

        const { first_name, last_name, father_name, email, name, url, phone, password, role } = req.body;

        if (false)
            return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'Usuário encontrado.' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
        return res.status(200).send(data)

    }),
    app.post('/client/list', (req, res) => {
            // #swagger.tags = ['Client']
            // #swagger.description = 'client haqida api'

     let { pageNumber, pageSize } = req.body;



     if (false)
        return res.status(404).send(false)

            /* #swagger.responses[200] = { 
                   schema: { $ref: "#/definitions/User" },
                   description: 'Usuário encontrado.' 
            } */
            /* #swagger.responses[400] = {
                   description: 'Xatolik roy berdi' 
            } */
    return res.status(200).send(data)

    }),
    app.get('/client/delete/:id', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'client haqida api'

        const id = req.params.id;

    if (false)
        return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'Usuário encontrado.' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
    return res.status(200).send(data)

    }),
    app.get('/client/getone/:id', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'client haqida api'

        const id = req.params.id;

    if (false)
        return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'Usuário encontrado.' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
    return res.status(200).send(data)

    }),
    app.get('/welcome', (req, res) => {
            // #swagger.tags = ['User']
            // #swagger.description = 'Endpoint para obter um usuário.'
            // #swagger.parameters['id'] = { description: 'ID haqida' }

            /* #swagger.parameters['filtro'] = {
                   description: 'Um filtro qualquer.',
                   type: 'string'
            } */
            const filtro = req.query.filtro
            const id = req.query.id

            if (false)
                return res.status(404).send(false)

            /* #swagger.responses[200] = { 
                   schema: { $ref: "#/definitions/User" },
                   description: 'Usuário encontrado.' 
            } */
            /* #swagger.responses[400] = {
                   description: 'Xatolik roy berdi' 
            } */
            return res.status(200).send(data)

    })

}