const nodeCtrl = {};

const Note = require('../models/Note');

nodeCtrl.renderNoteForm = (req, res) => {
  res.render('notes/new-note');
};

nodeCtrl.createNewNote = async (req, res) => {
  const {title, description } = req.body;
  const newNote = new Note({title, description });
  newNote.user = req.user.id;
  await newNote.save();
  
  req.flash('success_msg', 'Note Added Successully');
  res.redirect('/notes');
};

nodeCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({user:req.user.id}).sort({createdAt:'desc'});
  res.render('notes/all-notes', { notes });
}

nodeCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if(note.user != req.user.id){
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  }
  res.render('notes/edit-note', note); // se la paso a la vista
}

nodeCtrl.updateNote = async (req, res) => {
  const {title, description} = req.body;
  const note = await Note.findByIdAndUpdate(req.params.id,{ title, description });
  if(note.user != req.user.id){
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  }
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/notes');
}

nodeCtrl.deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if(note.user != req.user.id){
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  }
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/notes');
}


module.exports = nodeCtrl;