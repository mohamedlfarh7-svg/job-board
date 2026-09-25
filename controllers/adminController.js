const offreRepository = require('../repositories/offreRepository');
const adminController = {
    async index(req,res){
        try{
            const offres = await offreRepository.findAllWithApplicationsCount;
            req.render('admin/index',{
                title: "Gestion des offres - Admin",
                offres
            })
        }catch(error){
            console.error('Erreur Admin Index:', error);
            res.status(500).send('Erreur Serveur');
        }
    },
    createView(req, res) {
    res.render('admin/create', { title: "Publier une nouvelle offre" });
  },
  async create(req, res) {
    try {
      await OffreRepository.create(req.body);
      res.redirect('/admin/offres');
    } catch (error) {
      console.error('Erreur Admin Create:', error);
      res.status(500).send('Erreur lors de la création de l\'offre.');
    }
  },
  async editView(req, res) {
    try {
      const offre = await OffreRepository.findById(req.params.id);
      if (!offre) return res.status(404).render('404', { title: 'Offre non trouvée' });

      res.render('admin/edit', {
        title: "Modifier l'offre",
        offre
      });
    } catch (error) {
      console.error('Erreur Admin Edit View:', error);
      res.status(500).send('Erreur Serveur');
    }
  },
  async update(req, res) {
    try {
      await OffreRepository.update(req.params.id, req.body);
      res.redirect('/admin/offres');
    } catch (error) {
      console.error('Erreur Admin Update:', error);
      res.status(500).send('Erreur lors de la mise à jour.');
    }
  },
  async delete(req, res) {
    try {
      await OffreRepository.delete(req.params.id);
      res.redirect('/admin/offres');
    } catch (error) {
      console.error('Erreur Admin Delete:', error);
      res.status(500).send('Erreur lors de la suppression.');
    }
  }
}; 
module.exports = adminController;