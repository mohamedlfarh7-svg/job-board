const OffreRepository = require('../repositories/offreRepository');

const publicController = {
  async index(req, res) {
    try {
      const filters = {
        search: req.query.search || '',
        ville: req.query.ville || '',
        contrat: req.query.contrat || ''
      };

      const offres = await OffreRepository.findAll(filters);
      res.render('public/index', { offres, filters });
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      res.status(500).send('Erreur Serveur');
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const offre = await OffreRepository.findById(id);

      if (!offre) {
        return res.status(404).render('404', { title: 'Offre non trouvée' });
      }

      res.render('public/show', { offre });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
      res.status(500).send('Erreur Serveur');
    }
  }
};

module.exports = publicController;