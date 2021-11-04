
module.exports = function (app) {

    app.get('/welcome', (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para obter um usuário.'
        // #swagger.parameters['id'] = { description: 'ID do usuário.' }

        /* #swagger.parameters['filtro'] = {
               description: 'Um filtro qualquer.',
               type: 'string'
        } */
        const filtro = req.query.filtro
  
        if(false)
            return res.status(404).send(false)
      
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'Usuário encontrado.' 
        } */
        return res.status(200).send(data)

    })

}