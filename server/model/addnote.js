const mongoose = require("mongoose");

//Schema
//A mongoose schema defines the structure of the document, default value,validators etc
const AddNoteSchema = new mongoose.Schema({
  notetitle: {
    type: String,
    required: true,
  },
  notedescription: {
    type: String,
    required: true,
  },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
  },
});

//Model
//create collection
const AddNote = new mongoose.model("Note", AddNoteSchema);

module.exports = AddNote;

/*
const updatedocument = async(id) =>{
    try{
        //findByIdAndUpdate() can be used to get the updated object but they are deprecated
        const result = await Playlist.updateOne({_id:id},{
            $set:{
                name:"React JS"
            }
    
        });
    
        
        console.log("updated");
        console.log(result);

    }catch(err){
        console.log(err);
    }
    
}

*/
