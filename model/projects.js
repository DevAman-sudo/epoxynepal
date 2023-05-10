import mongoose from 'mongoose';

const projectsSchema = new mongoose.Schema({

  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
  }

});

const Projects = mongoose.models.Projects || mongoose.model('Projects', projectsSchema);

export default Projects;
