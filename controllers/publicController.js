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
      res.render('public/index', { 
        title: "TechJobs.ma - Offres d'emploi", 
        offres, 
        filters 
      });
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

      res.render('public/show', { 
        title: offre.titre, 
        offre ,
        success: req.query.success
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
      res.status(500).send('Erreur Serveur');
    }
  },
  async apply(req, res) {
    try {
      const { id } = req.params;
      const { nom, email, message } = req.body;
      const cv_path = req.file ? req.file.filename : null;

      await OffreRepository.createApplication({
        offre_id: id,
        nom,
        email,
        cv_path,
        message
      });   

      res.redirect(`/offre/${id}?success=true`);
    } catch (error) {
      console.error("Erreur dans PublicController.apply:", error);
      res.status(500).send("Erreur serveur lors de l'envoi de la candidature.");
    }
  },
  async dashboard(req, res) {
    try {
      const offres = await OffreRepository.findAllWithApplicationsCount();
      res.render('public/suivies', {
        title: "Tableau de bord - Suivi des offres",
        offres
      });
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      res.status(500).send('Erreur Serveur');
    }
  }
};

module.exports = publicController;