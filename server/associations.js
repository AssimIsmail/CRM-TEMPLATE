const User = require('./models/user.model');
const Centre = require('./models/centre.model');
const Project = require('./models/project.model');
const Status = require('./models/status.model');
const Offre = require('./models/offre.model');
const Question = require('./models/question.model');
const Reponse = require('./models/reponse.model');
const Enregistrement = require('./models/enregistrement.model');
const Event = require('./models/event.model');
const Document = require('./models/document.model');
const Note = require('./models/note.model');
const Tache = require('./models/tache.model');
const ProjectStatus = require('./models/project_status.model');

// User and Centre Relationship
// A Centre can have many Users
Centre.hasMany(User, { foreignKey: 'centreId', as: 'users' });
// A User belongs to a Centre
User.belongsTo(Centre, { foreignKey: 'centreId', as: 'centre' });

// Project and Centre Relationship
// A Centre can have many Projects
Centre.hasMany(Project, { foreignKey: 'centreId', as: 'projects' });
// A Project belongs to a Centre
Project.belongsTo(Centre, { foreignKey: 'centreId', as: 'centre' });

// Project and Status Relationship (Many-to-Many)
Project.belongsToMany(Status, {
  through: ProjectStatus,
  foreignKey: 'projectId',
  otherKey: 'statusId',
  as: 'statuses'
});
Status.belongsToMany(Project, {
  through: ProjectStatus,
  foreignKey: 'statusId',
  otherKey: 'projectId',
  as: 'projects'
});

// Offre and Centre Relationship
// A Centre can have many Offres
Centre.hasMany(Offre, { foreignKey: 'centreId', as: 'offres' });
// An Offre belongs to a Centre
Offre.belongsTo(Centre, { foreignKey: 'centreId', as: 'centre' });

// Offre and Project Relationship
// A Project can have many Offres
Project.hasMany(Offre, { foreignKey: 'projectId', as: 'offres' });
// An Offre belongs to a Project
Offre.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Offre and Status Relationship
// A Status can have many Offres
Status.hasMany(Offre, { foreignKey: 'statusId', as: 'offres' });
// An Offre has a Status
Offre.belongsTo(Status, { foreignKey: 'statusId', as: 'status' });

// New associations for prospecteur and vendeur
User.hasMany(Offre, { foreignKey: 'prospecteurId', as: 'prospectedOffres' });
Offre.belongsTo(User, { foreignKey: 'prospecteurId', as: 'prospecteur' });

User.hasMany(Offre, { foreignKey: 'vendeurId', as: 'soldOffres' });
Offre.belongsTo(User, { foreignKey: 'vendeurId', as: 'vendeur' });

// User and Question Relationship
User.hasMany(Question, { foreignKey: 'userId', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Reponse Relationship
User.hasMany(Reponse, { foreignKey: 'userId', as: 'reponses' });
Reponse.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Question and Reponse Relationship
Question.hasMany(Reponse, { foreignKey: 'questionId', as: 'reponses' });
Reponse.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User and Enregistrement Relationship
User.hasMany(Enregistrement, { foreignKey: 'userId', as: 'enregistrements' });
Enregistrement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Offre and Enregistrement Relationship
Offre.hasMany(Enregistrement, { foreignKey: 'offreId', as: 'enregistrements' });
Enregistrement.belongsTo(Offre, { foreignKey: 'offreId', as: 'offre' });

// User and Event Relationship
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Document Relationship
User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Note Relationship
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Tache Relationship
User.hasMany(Tache, { foreignKey: 'userId', as: 'taches' });
Tache.belongsTo(User, { foreignKey: 'userId', as: 'user' });
