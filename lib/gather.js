var Firebase = require('firebase');
var ElasticClient = require('elasticsearchclient')
// initialize our ElasticSearch API
var client = new ElasticClient({ host: 'localhost', port: 9200 });
// listen for changes to Firebase data
var fb = new Firebase('https://movienight2.firebaseio.com/users/');
fb.on('child_added',   createOrUpdateIndex);
fb.on('child_changed', createOrUpdateIndex);
fb.on('child_removed', removeIndex);
function createOrUpdateIndex(snap) {

	var theUser = snap.val()
	theUser.uid = snap.key()


	if (!theUser.profile)
	{
		console.warn("theUser: " + theUser.uid + " has a null profile.")
	}
	
	console.log('++ ' + theUser.uid)

   client.index(this.index, this.type, theUser, theUser.uid)
     .on('data', function(data) { console.log('indexed ', snap.key()); })
     .on('error', function(err) { /* handle errors */ });
}
function removeIndex(snap) {
   client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
      if( error ) console.error('failed to delete', snap.key(), error);
      else console.log('deleted', snap.key());
   });
}