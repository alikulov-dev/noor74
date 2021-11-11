
module.exports = function (app) {
    app.post('/client/register', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'client services'

        const { first_name="string", last_name="string", father_name="string", email, img_id, phone, password, role } = req.body;

        if (false)
            return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Client" },
               description: 'Adding clients' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
        return res.status(200).send(data)

    }),
    //mistake get to post
    app.post('/client/login', (req, res) => {
       // #swagger.tags = ['Client']
       // #swagger.description = 'client services'

       const { email, password } = req.body;

       if (false)
           return res.status(404).send(false)

       /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Client" },
              description: 'Thsi api helps to login' 
       } */
       /* #swagger.responses[400] = {
              description: 'Xatolik roy berdi' 
       } */
       return res.status(200).send(data)

    }),
    app.post('/client/list', (req, res) => {
            // #swagger.tags = ['Client']
            // #swagger.description = 'this api response is list of all clients'

     let { pageNumber, pageSize } = req.body;



     if (false)
        return res.status(404).send(false)

            /* #swagger.responses[200] = { 
                   schema: { $ref: "#/definitions/Client" },
                   description: 'client services' 
            } */
            /* #swagger.responses[400] = {
                   description: 'Xatolik roy berdi' 
            } */
    return res.status(200).send(data)

    }),
    app.post('/client/resendlink', (req, res) => {
       // #swagger.tags = ['Client']
       // #swagger.description = 'this api response is list of all clients'

       let { email } = req.body.email;



       if (false)
        return res.status(404).send(false)

       /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/Client" },
              description: 'client services' 
       } */
       /* #swagger.responses[400] = {
              description: 'Xatolik roy berdi' 
       } */
       return res.status(200).send(data)

         }),
    // update elements
    app.post('/client/update/:id', (req, res) => {
       // #swagger.tags = ['Client']
       // #swagger.description = 'client services'

       const id = req.params.id;
       const { first_name, last_name, father_name, email, img_id, phone, password, role } = req.body;


       if (false)
       return res.status(404).send(false)

       /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/User" },
              description: 'This api helps to update exact user by id' 
       } */
       /* #swagger.responses[400] = {
              description: 'Xatolik roy berdi' 
       } */
        return res.status(200).send(data)

    }),
    app.patch('/client/auth/:id', (req, res) => {
       // #swagger.tags = ['Client']
       // #swagger.description = 'client services'

       const id = req.params.id;

       if (false)
       return res.status(404).send(false)

       /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/User" },
              description: 'This api helps to update exact user by id' 
       } */
       /* #swagger.responses[400] = {
              description: 'Xatolik roy berdi' 
       } */
        return res.status(200).send(data)

    }),
    app.delete('/client/delete/:id', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'this api helps to delete exact client by id'

        const id = req.params.id;

    if (false)
        return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Client" },
               description: 'Client successfully deleted' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
    return res.status(200).send(data)

    }),
    app.get('/client/getone/:id', (req, res) => {
        // #swagger.tags = ['Client']
        // #swagger.description = 'api hels to get exact client by id'

        const id = req.params.id;

    if (false)
        return res.status(404).send(false)

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Client" },
               description: 'The result of this' 
        } */
        /* #swagger.responses[400] = {
               description: 'Xatolik roy berdi' 
        } */
    return res.status(200).send(data)

    }),
    app.post('/image', (req, res) => {
       // #swagger.tags = ['Img']
       // #swagger.description = 'Endpoint para obter um usuário.'
       const file = req.file


       if (false)
           return res.status(404).send(false)

       /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/User" },
              description: 'Fie success fully added' 
       } */
       /* #swagger.responses[400] = {
              description: 'Xatolik roy berdi' 
       } */
       return res.status(200).send(data)

    })
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