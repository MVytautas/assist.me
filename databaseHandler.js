var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("db", true, true);

module.exports = {
  update: function (arrayName, text) {
        console.log('In ' + arrayName + ' array');
        
        var item = {};
        var id = 1;
        
        try {
            id = db.getData("/" + arrayName + "[-1]/id") + 1;
        } catch(error) {
            
        }
        
        var exists = false;
        
        if (id !== 1) {
            db.getData("/" + arrayName).forEach(function (arrayItem, index) {
                if (arrayItem.text !== text || exists) { return; }
                // item.count += 1;
                db.push("/" + arrayName + "[" + index + "]/count", arrayItem.count += 1);
                exists = true;
            });
        }
        
        if (exists) { return 'This question existed. Increased count.'; }
    
        console.log('Adding item');
        
        item.text = text;      // set the question text (comes from the request)
        item.id = id;
        item.count = 1;
        
        var arrayKey = id - 1;
    
        db.push("/" + arrayName + "[" + arrayKey + "]", item);
        
        return arrayName + ' array was updated successfully!';
    }
};