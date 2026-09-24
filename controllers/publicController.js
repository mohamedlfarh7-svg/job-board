const offreRepository = require('../repositories/offreRepository');

class PublicController{
    static async index(req,res){
        try {
      const { search, ville, contrat, tech } = req.query;
      const offres = await OffreRepository.findAll({ search, ville, contrat, tech });
      res.render('public/index', {
        title: 'Trouvez votre emploi dream tech',
        offres,
        filters: { search, ville, contrat, tech }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      res.status(500).send('Erreur Serveur');
    }
    }
    static async show(req,res){
        try{
            const {id} = req.params;
            const offre = await offreRepository.findById(id);
            if(!offre){
                return res.status(404).render('404',{title: 'Offre non trouvée'})
            }
            res.render('public/show',{
                title : offre.title,
                offre
            })

        }catch(error){
            console.error('Erreur lors du chargement de l\'offre:', error);
            res.status(500).send('Erreur Serveur');
        }
    }
}
module.exports = PublicController;