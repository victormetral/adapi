export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Adapi — API La Remise',
    version: '1.0.0',
    description: 'API REST pour la gestion des objets, dépôts et donatrices de La Remise.',
  },
  servers: [
    { url: 'http://localhost:3000/api' },
  ],
  paths: {
    '/categories': {
      get: {
        summary: 'Liste toutes les catégories',
        responses: {
          200: { description: 'Tableau des catégories' },
        },
      },
    },
    '/objets': {
      get: {
        summary: 'Liste les objets, avec filtres optionnels',
        parameters: [
          { name: 'statut', in: 'query', schema: { type: 'string' } },
          { name: 'categorie_id', in: 'query', schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Tableau des objets' },
        },
      },
    },
    '/objets/{id}': {
      get: {
        summary: 'Un objet précis, avec catégorie, dépôt et donatrice',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Objet trouvé' },
          404: { description: 'Objet introuvable' },
        },
      },
    },
    '/objets/{id}/statut': {
      patch: {
        summary: "Fait évoluer le statut d'un objet",
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statut: { type: 'string', example: 'en_rayon' },
                  prix: { type: 'number', example: 25.5 },
                },
                required: ['statut'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Statut mis à jour' },
          400: { description: 'Statut invalide ou manquant' },
          404: { description: 'Objet introuvable' },
        },
      },
    },
    '/depots/{id}': {
      get: {
        summary: 'Un dépôt, sa donatrice et ses objets',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Dépôt trouvé' },
          404: { description: 'Dépôt introuvable' },
        },
      },
    },
    '/depots': {
      post: {
        summary: 'Enregistre un dépôt',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  personne_id: { type: 'integer', example: 1 },
                  date_depot: { type: 'string', example: '2026-09-01' },
                  type: { type: 'string', example: 'boutique' },
                },
                required: ['personne_id', 'date_depot', 'type'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Dépôt créé' },
          400: { description: 'Données invalides' },
        },
      },
    },
    '/depots/{id}/objets': {
      post: {
        summary: 'Ajoute un objet à un dépôt',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  libelle: { type: 'string', example: 'Théière vintage' },
                  poids_kg: { type: 'number', example: 1.2 },
                  etat_arrivee: { type: 'string', example: 'bon_etat' },
                  categorie_id: { type: 'integer', example: 3 },
                },
                required: ['libelle', 'poids_kg', 'etat_arrivee', 'categorie_id'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Objet créé' },
          400: { description: 'Données invalides' },
          404: { description: 'Dépôt introuvable' },
        },
      },
    },
    '/personnes': {
      post: {
        summary: 'Crée une donatrice',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nom: { type: 'string', example: 'Curie' },
                  prenom: { type: 'string', example: 'Marie' },
                  telephone: { type: 'string', example: '0600000000' },
                  adherente: { type: 'boolean', example: true },
                },
                required: ['nom', 'prenom'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Personne créée' },
          400: { description: 'nom ou prenom manquant' },
        },
      },
    },
    '/stats': {
      get: {
        summary: 'Objets par statut, poids total, poids détourné',
        responses: {
          200: { description: 'Statistiques globales' },
        },
      },
    },
  },
};